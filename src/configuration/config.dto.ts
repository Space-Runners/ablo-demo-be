import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfigDto {
  @ApiProperty({
    description: 'The engineId for the configuration',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  engineId: string;

  @ApiProperty({
    description:
      'Keywords that will be embeded into the prompt for image generation',
    type: String,
    example: 'A cat in a hat',
  })
  @IsString()
  @IsNotEmpty()
  keywords: string;

  @ApiProperty({
    description: 'Parameters for the engine configuration',
    type: JSON,
    example: `{cfg_scale: 7,
      clip_guidance_preset: 'FAST_BLUE',
      height: 1024,
      width: 768,
      samples: 1,
      steps: 30,}`,
  })
  parameters: object;
}
