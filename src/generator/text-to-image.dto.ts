import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

type TextPrompt = {
  text: string;
  weight: number;
};

export class TextToImageDto {
  @ApiProperty({
    description: 'Text to convert to image',
    example: 'Hello World',
  })
  @IsNotEmpty()
  text: TextPrompt[];

  @ApiProperty({
    description: 'The engine ID',
    example: 'stable-diffusion-v1-5',
    default: 'stable-diffusion-xl-beta-v2-2-2',
  })
  @IsString()
  engineId?: string;

  @ApiProperty({
    description:
      'How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt)',
    example: 20,
    default: 7,
  })
  @IsNumber()
  @Min(0)
  @Max(35)
  cfg_scale?: number;

  @ApiProperty({
    description:
      'Default: NONE\n' +
      'One of the: FAST_BLUE FAST_GREEN NONE SIMPLE SLOW SLOWER SLOWEST',
    example: 'NONE',
  })
  @IsString()
  clip_guidance_preset?: string;

  @ApiProperty({
    description: 'Height of the image in pixels. Must be in increments of 64',
    example: 512,
  })
  @IsNumber()
  @Max(512)
  height?: number;

  @ApiProperty({
    description: 'Width of the image in pixels. Must be in increments of 64',
    example: 512,
  })
  @IsNumber()
  @Max(512)
  width?: number;

  @ApiProperty({
    description: 'Number of samples to generate',
    example: 1,
    default: 1,
  })
  @Min(1)
  @Max(5)
  @IsNumber()
  samples?: number;

  @ApiProperty({
    description: 'Number of diffusion steps to run',
    example: 30,
    default: 50,
  })
  @Min(10)
  @Max(150)
  @IsNumber()
  steps?: number;

  @ApiProperty({
    description:
      'Pass in a style preset to guide the image model towards a particular style. This list of style presets is subject to change.',
    example: `One of the: 3d-model analog-film anime cinematic comic-book digital-art enhance fantasy-art isometric line-art low-poly modeling-compound neon-punk origami photographic pixel-art tile-texture`,
    default: null,
  })
  @IsString()
  style_preset?: string;

  @ApiProperty({
    description: `Enum: DDIM DDPM K_DPMPP_2M K_DPMPP_2S_ANCESTRAL K_DPM_2 K_DPM_2_ANCESTRAL K_EULER K_EULER_ANCESTRAL K_HEUN K_LMS
      Which sampler to use for the diffusion process.`,
    example: 'DDIM',
    default: null,
  })
  @IsString()
  sampler?: string;
}
