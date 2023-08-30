import { IsBoolean, IsString } from 'class-validator';

export class PatchDesignSideDto {
  templateSideId?: string;

  @IsBoolean()
  hasGraphics?: boolean;

  @IsBoolean()
  hasText?: boolean;

  @IsString()
  canvasState?: string;

  image?: string;

  preview?: string;
}
