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
import { Design } from './design.entity';
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
  async getAll(@Request() req): Promise<Design[]> {
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
    await this.service.checkAuth(id, req.user.id);
    return this.service.getOne(id);
  }

  @ApiOperation({ summary: 'Create a new design' })
  @ApiResponse({
    status: 201,
  })
  @Post('/designs')
  @UseGuards(JwtAuthGuard)
  async create(@Request() req, @Body() dto: any): Promise<any> {
    return this.service.create(dto, req.user);
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
    return this.service.delete(id);
  }
}
