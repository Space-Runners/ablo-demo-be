import {
  Controller,
  Param,
  Get,
  Query,
  Post,
  Request,
  Patch,
  Delete,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TemplateImageService } from './template-image.service';
import { TemplateImage } from './template-image.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientGuard } from '../../clients/client.guard';
import { TemplateImageDto, UpdateTemplateImageDto } from './template-image.dto';
import { TemplateService } from '../template.service';

@Controller()
@ApiTags('TemplateImages')
export class TemplateImageController {
  constructor(
    private readonly service: TemplateImageService,
    private readonly templateService: TemplateService,
  ) {}

  @ApiOperation({ summary: 'Get a single template image' })
  @UseGuards(ClientGuard)
  @Get('/templates/:templateId/images/:id')
  async findOne(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<TemplateImage> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Get all template images for template' })
  @UseGuards(ClientGuard)
  @Get('/templates/:templateId/images')
  async findAll(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Request() req,
    @Query('templateColorId', ParseUUIDPipe) templateColorId: string,
    @Query('limit') limit: number,
    @Query('step') step: number,
  ): Promise<TemplateImage[]> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.findAll(limit, step, templateColorId);
  }

  @ApiOperation({ summary: 'Create template image' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('/templates/:templateId/images')
  async create(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Request() req,
    @Body() dto: TemplateImageDto,
  ): Promise<TemplateImage> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Update template image' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Patch('/templates/:templateId/images/:id')
  async update(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() dto: UpdateTemplateImageDto,
  ): Promise<TemplateImage> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete template image' })
  @UseGuards(ClientGuard)
  @Delete('/templates/:templateId/images/:id')
  async remove(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    await this.templateService.checkClientAuth(templateId, req.client);
    await this.service.delete(id);
  }
}
