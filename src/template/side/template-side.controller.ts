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
import { TemplateSideService } from './template-side.service';
import { TemplateSide } from './template-side.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientGuard } from '../../clients/client.guard';
import { TemplateSideDto, UpdateTemplateSideDto } from './template-side.dto';
import { TemplateService } from '../template.service';

@Controller()
@ApiTags('TemplateSides')
export class TemplateSideController {
  constructor(
    private readonly service: TemplateSideService,
    private readonly templateService: TemplateService,
  ) {}

  @ApiOperation({ summary: 'Get a single template side' })
  @UseGuards(ClientGuard)
  @Get('/templates/:templateId/sides/:id')
  async findOne(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<TemplateSide> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Get all template sides for template' })
  @UseGuards(ClientGuard)
  @Get('/templates/:templateId/sides')
  async findAll(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Request() req,
    @Query('limit') limit: number,
    @Query('step') step: number,
  ): Promise<TemplateSide[]> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.findAll(limit, step, templateId);
  }

  @ApiOperation({ summary: 'Create template side' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('/templates/:templateId/sides')
  async create(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Request() req,
    @Body() dto: TemplateSideDto,
  ): Promise<TemplateSide> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.create(dto, templateId);
  }

  @ApiOperation({ summary: 'Update template side' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Patch('/templates/:templateId/sides/:id')
  async update(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() dto: UpdateTemplateSideDto,
  ): Promise<TemplateSide> {
    await this.templateService.checkClientAuth(templateId, req.client);
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete template side' })
  @UseGuards(ClientGuard)
  @Delete('/templates/:templateId/sides/:id')
  async remove(
    @Param('templateId', ParseUUIDPipe) templateId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    await this.templateService.checkClientAuth(templateId, req.client);
    await this.service.delete(id);
  }
}
