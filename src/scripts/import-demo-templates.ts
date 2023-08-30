import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INestApplication } from '@nestjs/common';
import { CurrencyService } from '../template/currency/currency.service';
import { SizeService } from '../template/size/size.service';
import { TemplateService } from '../template/template.service';
import { ClientService } from '../clients/client.service';
import { TemplateDto } from '../template/template.dto';
import { TemplateSideService } from '../template/side/template-side.service';
import { TemplateSideDto } from '../template/side/template-side.dto';
import { TemplateColorDto } from '../template/color/template-color.dto';
import { TemplateColorService } from '../template/color/template-color.service';
import { TemplateColor } from '../template/color/template-color.entity';
import { TemplateSide } from '../template/side/template-side.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TemplateImage } from '../template/image/template-image.entity';
import { Template } from '../template/template.entity';

import TEMPLATES, { variants } from './demo-templates';

const importTemplates = async () => {
  const app: INestApplication = await NestFactory.create(AppModule);

  console.log('\nImporting templates...');
  // Try finding Demo Client
  const clientService = app.get<ClientService>(ClientService);
  const client = await clientService.findOne({
    where: {
      name: 'Ablo Demo',
    },
  });
  if (!client) {
    console.log(`Unable to import - Demo Client not found`);
    return;
  }
  // If any templates exist, don't import
  const templateService = app.get<TemplateService>(TemplateService);
  const templatesExisting = await templateService.findAll(1, 0, client.id);
  if (templatesExisting.length) {
    console.log(`Skipping import - Templates already exist`);
    return;
  }

  const currencyService = app.get<CurrencyService>(CurrencyService);
  const currencies = await currencyService.findAll();
  const usd = currencies.find((c) => c.name === 'USD');

  const sizeService = await app.get<SizeService>(SizeService);
  const sizes = await sizeService.findAll();

  const templateSideService = app.get<TemplateSideService>(TemplateSideService);
  const templateColorService =
    app.get<TemplateColorService>(TemplateColorService);
  const templateImageRepo = app.get(getRepositoryToken(TemplateImage));

  const templates: Template[] = [];

  for (const templateRaw of TEMPLATES) {
    const dtoTemplate: TemplateDto = {
      name: templateRaw.name,
      fabric: templateRaw.fabric,
      currencyId: usd.id,
      price: templateRaw.price,
      madeIn: templateRaw.madeIn,
      fit: templateRaw.fit,
      material: templateRaw.description,
      sizeIds: [sizes[0].id, sizes[1].id, sizes[2].id],
    };
    const template = await templateService.create(dtoTemplate, client.id);
    const colors: TemplateColor[] = [];
    const sides: TemplateSide[] = [];
    const images = [];

    // Import colors
    // Each template has all colors
    for (const color of variants) {
      const dtoColor: TemplateColorDto = {
        name: color.name,
        hex: color.color,
      };
      const templateColor = await templateColorService.create(
        dtoColor,
        template.id,
      );
      colors.push(templateColor);
    }

    // Import sides
    for (const sideName in templateRaw.printableAreas) {
      const area = templateRaw.printableAreas[sideName];
      const dtoSide: TemplateSideDto = {
        name: sideName,
        hasArea: true,
        top: area.top,
        left: area.left,
        heightCm: area.height,
        widthCm: area.width,
      };
      const templateSide = await templateSideService.create(
        dtoSide,
        template.id,
      );
      sides.push(templateSide);
    }

    // Import images
    for (const templateSide of sides) {
      for (const templateColor of colors) {
        const url = `${templateRaw.urlPrefix}_${
          templateColor.name
        }_${templateSide.name.toUpperCase()}.webp`;
        const templateImage = {
          url,
          templateColorId: templateColor.id,
          templateSideId: templateSide.id,
        };
        images.push(templateImage);
      }
      await templateImageRepo.save(images);
    }

    templates.push(template);
  }
  console.log(`Import finished. (${templates.length} templates)`);
};

importTemplates();
