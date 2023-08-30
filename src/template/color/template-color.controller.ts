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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientGuard } from '../../clients/client.guard';
import { TemplateColor } from './template-color.entity';
import { TemplateColorDto, UpdateTemplateColorDto } from './template-color.dto';
import { TemplateColorService } from './template-color.service';
import { TemplateService } from '../template.service';

@Controller()
@ApiTags('TemplateColors')
export class TemplateColorController {
  constructor(
    private readonly service: TemplateColorService,
    private readonly templateService: TemplateService,
  ) {}

  @ApiOperation({ summary: 'Get a single template color' })
  @UseGuards(ClientGuard)
  @Get('/templates/:templateId/colors/:id')
  async findOne(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<TemplateColor> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Get all template colors for template' })
  @UseGuards(ClientGuard)
  @Get('/templates/:templateId/colors')
  async findAll(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Request() req,
    @Query('limit') limit: number,
    @Query('step') step: number,
  ): Promise<TemplateColor[]> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.findAll(limit, step, templateId);
  }

  @ApiOperation({ summary: 'Create template color' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('/templates/:templateId/colors')
  async create(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Request() req,
    @Body() dto: TemplateColorDto,
  ): Promise<TemplateColor> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.create(dto, templateId);
  }

  @ApiOperation({ summary: 'Update template color' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Patch('/templates/:templateId/colors/:id')
  async update(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() dto: UpdateTemplateColorDto,
  ): Promise<TemplateColor> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete template color' })
  @UseGuards(ClientGuard)
  @Delete('/templates/:templateId/colors/:id')
  async remove(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    await this.templateService.checkClientAuth(templateId, req.client);
    await this.service.delete(id);
  }
}
