import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateColorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  hex: string;
}

export class UpdateTemplateColorDto extends PartialType(TemplateColorDto) {}
