import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { TextToImageDto } from './text-to-image.dto';
import {
  styles,
  styleMap,
  keywordMap,
  suggestions,
  tonesValues,
  tonesMap,
} from './generator.rules';
import { GenerateImageDto } from './generate-image.dto';
import { removeBackgroundFromImageUrl } from 'remove.bg';

interface Balance {
  credits: number;
}

interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

@Injectable()
export class GeneratorService {
  private axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('STABLE_DIFF_TOKEN');

    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>('STABILITY_API'),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  async getStableUser() {
    const { data } = await this.axiosInstance.get('/v1/user/account');
    return data;
  }

  async getStableBalance(): Promise<Balance | any> {
    const { data } = await this.axiosInstance.get('/v1/user/balance');
    return data;
  }

  async getStableEngines() {
    const { data } = await this.axiosInstance.get('/v1/engines/list');
    return data;
  }

  async removeBackground(url: string): Promise<string> {
    try {
      const result = await removeBackgroundFromImageUrl({
        url,
        apiKey: this.configService.get<string>('REMOVEBG_API_KEY'),
        size: 'preview',
        type: 'auto',
        format: 'png',
      });
      const base64img = result.base64img;
      return base64img;
    } catch (error) {
      // Service sometimes returns an error: "Could not identify foreground in image"
      // Return the error with the error mesage to the client
      if (error && error[0]?.code === 'unknown_foreground') {
        throw new UnprocessableEntityException(error);
      }
      // Rethrow the error by default
      throw error;
    }
  }

  async getOptions() {
    return {
      styles: styleMap,
      tones: tonesMap,
      suggestions: keywordMap,
    };
  }

  async generateImage(params: GenerateImageDto): Promise<GenerationResponse> {
    const selectedTone = params.tone ? tonesValues[params.tone] : '';
    const suggestionsPrompt = [];
    for (const suggestion of params.subjectSuggestions) {
      for (const entry of suggestions[params.style]) {
        if (entry.name === suggestion) {
          suggestionsPrompt.push(entry.prompt);
        }
      }
    }

    const backgroundText =
      ', flat BG, simple BG, flat light BG, solid background, no background';

    const style = styles(
      params.style,
      params.freeText || suggestionsPrompt.join(','),
      selectedTone,
      params.background ? backgroundText : '',
    );

    const body = {
      text_prompts: style.text_prompt,
      cfg_scale: style.cfg_scale,
      clip_guidance_preset: style.clip_guidance_preset || 'NONE',
      height: style.height || 512,
      width: style.width || 512,
      samples: style.samples || 3,
      steps: style.steps || 50,
      sampler: style.sampler || 'K_LMS',
    };

    const { data } = await this.axiosInstance.post(
      `/v1/generation/${style.engineId}/text-to-image`,
      body,
    );

    return data;
  }

  /**
   * Generate text to image
   * @param params
   */
  async generateTextToImage(
    params: TextToImageDto,
  ): Promise<GenerationResponse> {
    const engineId = params.engineId || 'stable-diffusion-xl-beta-v2-2-2';

    const body = {
      text_prompts: params.text,
      cfg_scale: params.cfg_scale || 20,
      steps: params.steps || 50,
      clip_guidance_preset: 'NONE',
      height: params.height || 512,
      width: params.width || 512,
      samples: params.samples || 3,
    };

    if (params.style_preset) {
      body['style_preset'] = params.style_preset;
    }

    if (params.sampler) {
      body['sampler'] = params.sampler;
    }

    try {
      const { data } = await this.axiosInstance.post(
        `/v1/generation/${engineId}/text-to-image`,
        body,
      );

      return data;
    } catch (error) {
      console.log(error);
      const message = `Error from Stability.ai: ${error?.response?.data?.message}`;
      throw new BadRequestException(message, error);
    }
  }

  /**
   * Generate image to image
   * @param image
   * @param text
   */
  async generateImageToImage(
    image: string,
    text?: string,
  ): Promise<GenerationResponse> {
    const engineId = 'stable-diffusion-v1-5';
    const formData = new FormData();
    formData.append('init_image', fs.readFileSync(`uploads/${image}`));
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', '0.35');
    formData.append('text_prompts[0][text]', text || '');
    formData.append('cfg_scale', '7');
    formData.append('clip_guidance_preset', 'FAST_BLUE');
    formData.append('samples', '1');
    formData.append('steps', '30');

    const { data } = await this.axiosInstance.post(
      `/v1/generation/${engineId}/image-to-image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    await fs.unlinkSync(`uploads/${image}`);
    return data;
  }

  async upscaleImage(image: string): Promise<GenerationResponse> {
    const engineId = 'stable-diffusion-x4-latent-upscaler';
    const formData = new FormData();
    formData.append('image', fs.readFileSync(`uploads/${image}`));
    formData.append('width', 2048);

    const { data } = await this.axiosInstance.post(
      `/v1/generation/${engineId}/image-to-image/upscale`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    await fs.unlinkSync(`uploads/${image}`);
    return data;
  }
}
