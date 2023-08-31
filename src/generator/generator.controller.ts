import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TextToImageDto } from './text-to-image.dto';
import { StorageService } from './storage.service';
import { GenerateImageDto } from './generate-image.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
@ApiTags('Generator')
export class GeneratorController {
  constructor(
    private readonly generatorService: GeneratorService,
    private readonly uploaderService: StorageService,
  ) {}

  @ApiOperation({ summary: 'Remove background from the image' })
  @ApiResponse({
    status: 201,
  })
  @Post('/generate/remove-background')
  @UseGuards(JwtAuthGuard)
  async removeBackground(@Request() req, @Body('imageUrl') imageUrl: string) {
    const image = await this.generatorService.removeBackground(imageUrl);

    const resultUrl = await this.uploaderService.uploadFile(
      Buffer.from(image, 'base64'),
      `${Date.now()}.png`,
      req.client.id,
    );
    return {
      image: resultUrl,
    };
  }

  @Get('/generate/options')
  @ApiOperation({ summary: 'Get generator options' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        styles: {
          type: 'object',
        },
        moods: {
          type: 'object',
        },
        suggestions: {
          type: 'object',
        },
      },
    },
  })
  async getOptions() {
    return this.generatorService.getOptions();
  }

  @ApiOperation({
    summary: 'Generate a new set of images given a style and subject',
  })
  @ApiResponse({
    status: 201,
  })
  @Post('/generate/image')
  @UseGuards(JwtAuthGuard)
  async generateImage(
    @Request() req,
    @Body() generateImage: GenerateImageDto,
  ): Promise<{ images: string[] }> {
    const response = await this.generatorService.generateImage(generateImage);

    const images = [];
    //   photos: Image[] = [];

    // for (const image of response.artifacts) {
    //   const url = await this.uploaderService.uploadFile(
    //     Buffer.from(image.base64, 'base64'),
    //     `${Date.now()}.png`,
    //     req.client.id,
    //   );
    //   images.push(url);

    //   const photo = new Image();
    //   photo.client = req.client;
    //   photo.url = url;
    //   photo.temporary = req.user?.email === AuthService.GUEST_EMAIL;
    //   photos.push(photo);
    // }

    // await this.photosService.bulkCreate(photos);

    return {
      images,
    };
  }

  @ApiOperation({
    summary: 'Generate a new set of images based off a pure text prompt',
  })
  @ApiResponse({
    status: 201,
  })
  @Post('/generate/text-to-image')
  @UseGuards(JwtAuthGuard)
  async generateTextToImage(
    @Body() textToImage: TextToImageDto,
    @Request() req,
  ): Promise<{ images: string[] }> {
    const response = await this.generatorService.generateTextToImage(
      textToImage,
    );

    const images = [];
    //   photos: Image[] = [];

    // for (const image of response.artifacts) {
    //   const result = await this.uploaderService.uploadFile(
    //     Buffer.from(image.base64, 'base64'),
    //     `${Date.now()}.png`,
    //     req.client.id,
    //   );
    //   images.push(result);

    //   const photo = new Image();
    //   photo.client = req.client;
    //   photo.url = result;

    //   photos.push(photo);
    // }

    // await this.photosService.bulkCreate(photos);

    return {
      images,
    };
  }

  @ApiOperation({
    summary: 'Generate a new set of images based off a supplied image',
  })
  @Post('/generate/image-to-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExtName = file.originalname.split('.').pop();
          const filename = `${Date.now()}.${fileExtName}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async generateImageToImage(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ): Promise<{ images: string[] }> {
    const response = await this.generatorService.generateImageToImage(
      image.filename,
    );

    const images = [];
    //   photos: Image[] = [];

    // for (const image of response.artifacts) {
    //   const result = await this.uploaderService.uploadFile(
    //     Buffer.from(image.base64, 'base64'),
    //     `${Date.now()}.png`,
    //     req.client.id,
    //   );
    //   images.push(result);

    //   const photo = new Image();
    //   photo.client = req.client;
    //   photo.url = result;

    //   photos.push(photo);
    // }

    // await this.photosService.bulkCreate(photos);

    return {
      images,
    };
  }

  @ApiOperation({
    summary: 'Upscale an image',
  })
  @Post('/generate/image-to-upscale')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const fileExtName = file.originalname.split('.').pop();
          const filename = `${Date.now()}.${fileExtName}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async upscaleImage(
    @Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/png' })],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File,
  ): Promise<{ images: string[] }> {
    const response = await this.generatorService.upscaleImage(image.filename);
    const images = [];
    //   photos: Image[] = [];

    // for (const image of response.artifacts) {
    //   const result = await this.uploaderService.uploadFile(
    //     Buffer.from(image.base64, 'base64'),
    //     `${Date.now()}.png`,
    //     req.client.id,
    //   );
    //   images.push(result);

    //   const photo = new Image();
    //   photo.client = req.client;
    //   photo.url = result;

    //   photos.push(photo);
    // }

    // await this.photosService.bulkCreate(photos);

    return {
      images,
    };
  }
}
