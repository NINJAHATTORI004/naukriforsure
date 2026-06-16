import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty()
  resumeId!: string;

  @ApiProperty()
  status!: string;
}