import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class TemplateImageDto {
  @IsNotEmpty()
  @IsUUID()
  templateColorId: string;
  @IsNotEmpty()
  @IsUUID()
  templateSideId: string;
  @IsNotEmpty()
  @IsString()
  image: string;
}

export class UpdateTemplateImageDto {
  @IsOptional()
  @IsString()
  image: string;
}
