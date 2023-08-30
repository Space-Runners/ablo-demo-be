import { TemplateDto } from './template.dto';
import { TemplateSideDto } from './side/template-side.dto';
import { TemplateColorDto } from './color/template-color.dto';
import { IsArray, IsNotEmpty, IsObject } from 'class-validator';

export class TemplateFullDto extends TemplateDto {
  @IsNotEmpty()
  @IsArray()
  sides: TemplateSideDto[];
  @IsNotEmpty()
  @IsArray()
  colors: TemplateColorFullDto[];
}

class TemplateColorFullDto extends TemplateColorDto {
  @IsNotEmpty()
  @IsObject()
  images: { [sideName: string]: string };
}
