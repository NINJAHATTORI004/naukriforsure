import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser, ICurrentUser } from '../../../shared/decorators/current-user.decorator';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { S3Service } from '../../../infrastructure/s3/s3.service';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { UploadResponseDto } from './resume.dto';

@ApiTags('Resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumeController {
  constructor(
    @InjectQueue('resume-parsing') private readonly resumeQueue: Queue,
    private readonly s3Service: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOkResponse({ type: UploadResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadResume(
    @CurrentUser() user: ICurrentUser,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), new FileTypeValidator({ fileType: 'application/pdf' })],
      }),
    ) file: Express.Multer.File,
  ): Promise<UploadResponseDto> {
    const fileUrl = await this.s3Service.uploadFile(file.buffer, file.mimetype, file.originalname, 'resumes');

    const resumeRecord = await this.prisma.resume.create({
      data: { userId: user.id, fileUrl, fileName: file.originalname, fileType: file.mimetype, parsedStatus: 'PENDING' },
    });

    await this.resumeQueue.add('parse-resume', { resumeId: resumeRecord.id, fileUrl });

    return { resumeId: resumeRecord.id, status: 'QUEUED' };
  }
}