import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class TemplateDto {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  fabric?: string;
  @IsOptional()
  @IsNumber()
  currencyId?: number;
  @IsOptional()
  @IsNumber()
  price?: number;
  @IsOptional()
  madeIn?: string;
  @IsOptional()
  fit?: string;
  @IsOptional()
  material?: string;
  @IsOptional()
  @IsArray()
  sizeIds: number[];
}

export class UpdateTemplateDto extends PartialType(TemplateDto) {}
