import {
  Controller,
  Delete,
  Get,
  Param,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { StorageService } from './storage.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientGuard } from '../clients/client.guard';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('/images')
@ApiTags('Images')
export class ImagesController {
  constructor(
    private readonly service: ImageService,
    private readonly storageService: StorageService,
  ) {}

  @ApiOperation({ summary: 'Get generated image by id' })
  @Get('/:id')
  @UseGuards(ClientGuard)
  async getGeneratedImage(@Request() req, @Param('id') id: string) {
    const image = await this.service.checkClientAuth(id, req.client);
    return image;
  }

  @ApiOperation({ summary: 'Get all generated images for user' })
  @Get('/user/:userId')
  @UseGuards(JwtAuthGuard)
  async getGeneratedImagesByUser(@Req() req) {
    return this.service.findByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Delete image by id' })
  @Delete('/:id')
  @UseGuards(ClientGuard)
  async deleteGeneratedImage(@Request() req, @Param('id') id: string) {
    const image = await this.service.checkClientAuth(id, req.client);

    await this.storageService.removeFile(image.url, 'items');
    await this.service.delete(id);
  }
}
