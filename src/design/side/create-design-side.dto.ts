import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateDesignSideDto {
  @IsNotEmpty()
  templateSideId: string;

  @IsBoolean()
  hasGraphics: boolean;

  @IsBoolean()
  hasText: boolean;

  @IsString()
  canvasState?: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  preview: string;
}
