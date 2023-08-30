import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  constructor(private readonly configService: ConfigService) {}

  async uploadFile(
    dataBuffer: Buffer,
    fileName: string,
    clientId?: string,
  ): Promise<string> {
    const client = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const key = clientId ? `${clientId}/${fileName}` : fileName;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Body: dataBuffer,
      Key: key,
    });

    await client.send(command);
    return `${this.configService.get('AWS_CDN_URL')}/${key}`;
  }

  async downloadFile(key: string): Promise<string> {
    const client = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: `${key}`,
    });

    const file = await client.send(command);
    return file.Body.transformToString();
  }

  async removeFile(fileIdOrS3Url: string, type?: string) {
    // If url, remove domain first
    let key = fileIdOrS3Url.replace(
      `${this.configService.get('AWS_CDN_URL')}/`,
      '',
    );
    key = type ? `${type}/${key}` : key;

    const client = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const input = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: key,
    };
    try {
      const command = new DeleteObjectCommand(input);
      await client.send(command);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async removeFolder(folder: string) {
    const client = new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const input = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: `${folder}`,
    };
    try {
      const command = new DeleteObjectCommand(input);
      await client.send(command);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
