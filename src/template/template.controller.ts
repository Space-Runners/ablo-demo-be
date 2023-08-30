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
import { TemplateService } from './template.service';
import { Template } from './template.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientGuard } from '../clients/client.guard';
import { TemplateDto, UpdateTemplateDto } from './template.dto';
import { TemplateFullDto } from './template-full.dto';

@Controller()
@ApiTags('Templates')
export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  @ApiOperation({ summary: 'Get a single template' })
  @UseGuards(ClientGuard)
  @Get('/templates/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<Template> {
    await this.service.checkClientAuth(id, req.client);
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Get all templates' })
  @UseGuards(ClientGuard)
  @Get('/templates')
  async findAll(
    @Request() req,
    @Query('limit') limit: number,
    @Query('step') step: number,
  ): Promise<Template[]> {
    return this.service.findAll(limit, step, req.client.id);
  }

  @ApiOperation({ summary: 'Create template' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('/templates')
  async create(@Request() req, @Body() dto: TemplateDto): Promise<Template> {
    return this.service.create(dto, req.client.id);
  }

  @ApiOperation({ summary: 'Create template (with subentities)' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Post('/templates/full')
  async createFull(
    @Request() req,
    @Body() dto: TemplateFullDto,
  ): Promise<Template> {
    return this.service.createFull(dto, req.client.id);
  }

  @ApiOperation({ summary: 'Update template' })
  @UseGuards(ClientGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @Patch('/templates/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() dto: UpdateTemplateDto,
  ): Promise<Template> {
    await this.service.checkClientAuth(id, req.client);
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete template' })
  @UseGuards(ClientGuard)
  @Delete('/templates/:id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<void> {
    await this.service.checkClientAuth(id, req.client);
    await this.service.delete(id);
  }
}
