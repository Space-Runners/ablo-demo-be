import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class TemplateSideDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsOptional()
  @IsBoolean()
  hasArea?: boolean;
  @IsOptional()
  @IsNumber()
  heightCm?: number;
  @IsOptional()
  @IsNumber()
  top?: number;
  @IsOptional()
  @IsNumber()
  left?: number;
  @IsOptional()
  @IsNumber()
  widthCm?: number;
}

export class UpdateTemplateSideDto extends PartialType(TemplateSideDto) {}
