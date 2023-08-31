import {
  Controller,
  Param,
  Get,
  Query,
  Request,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TemplateService } from './template.service';
import { Template } from './template.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
@ApiTags('Templates')
export class TemplateController {
  constructor(private readonly service: TemplateService) {}

  @ApiOperation({ summary: 'Get a single template' })
  @UseGuards(JwtAuthGuard)
  @Get('/templates/:id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
  ): Promise<Template> {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Get all templates' })
  @UseGuards(JwtAuthGuard)
  @Get('/templates')
  async findAll(
    @Request() req,
    @Query('limit') limit: number,
    @Query('step') step: number,
  ): Promise<Template[]> {
    return this.service.findAll(limit, step);
  }
}
