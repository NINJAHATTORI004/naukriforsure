import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.getOrThrow<string>('AWS_REGION');
    this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET');
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadFile(fileBuffer: Buffer, mimetype: string, originalName: string, folder: string): Promise<string> {
    const fileKey = `${folder}/${uuidv4()}-${originalName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: mimetype,
    });

    await this.s3Client.send(command);
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }
}