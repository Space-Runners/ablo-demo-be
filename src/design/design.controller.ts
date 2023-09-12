import {
  Body,
  Controller,
  Delete,
  Get,
  Request,
  Post,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { DesignService } from './design.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
@ApiTags('Design')
export class DesignController {
  constructor(private readonly service: DesignService) {}

  @ApiOperation({ summary: 'Get all designs for user' })
  @ApiResponse({
    status: 200,
  })
  @Get('/designs')
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req) {
    const designs = await this.service.getAllForUser(req.user.id);
    return designs;
  }

  @ApiOperation({ summary: 'Get single design' })
  @ApiResponse({
    status: 200,
  })
  @Get('/designs/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string, @Request() req) {
    const result = await this.service.checkAuth(id, req.user.id);
    return result;
  }

  @ApiOperation({ summary: 'Create a new design' })
  @ApiResponse({
    status: 201,
  })
  @Post('/designs')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() dto: any): Promise<any> {
    dto.externalUserId = req.user.id;
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Create a new design (full)' })
  @ApiResponse({
    status: 201,
  })
  @Post('/designs/full')
  @UseGuards(JwtAuthGuard)
  async createFull(@Request() req, @Body() dto: any): Promise<any> {
    dto.externalUserId = req.user.id;
    return this.service.createFull(dto);
  }

  @ApiOperation({ summary: 'Patch design' })
  @ApiResponse({
    status: 204,
  })
  @Patch('/designs/:id')
  @UseGuards(JwtAuthGuard)
  async patch(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: any,
  ): Promise<any> {
    await this.service.checkAuth(id, req.user.id);
    return this.service.patch(id, dto);
  }

  @ApiOperation({ summary: 'Delete design' })
  @ApiResponse({
    status: 204,
  })
  @Delete('/designs/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Request() req): Promise<void> {
    await this.service.checkAuth(id, req.user.id);
    await this.service.delete(id);
  }
}
