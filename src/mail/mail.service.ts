import { Injectable } from '@nestjs/common';
import SendGridMail = require('@sendgrid/mail');
import { ConfigService } from '@nestjs/config';
import { EmailTemplate } from './templates.enum';

const DEFAULT_FROM = 'info@spacerunners.com';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {
    SendGridMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendVerificationEmail(email: string, firstName: string, url: string) {
    await this.send(email, EmailTemplate.GENERIC, {
      subject: 'Verify your Ablo email address',
      title: `Hey ${firstName}, please verify your Ablo email address`,
      buttonText: 'Verify email address',
      buttonUrl: url,
    });
  }

  async sendWelcomeEmail(email: string, firstName: string) {
    await this.send(email, EmailTemplate.GENERIC, {
      subject: 'Welcome to Ablo',
      title: `Hey ${firstName}, welcome to Ablo`,
      buttonText: 'Start using Ablo',
      buttonUrl: process.env.CLIENT_DASHBOARD_URL,
    });
  }

  async send(
    receiver: string,
    templateId: string,
    substitutions: { [key: string]: string | number | boolean },
  ) {
    const msg = {
      to: receiver,
      from: {
        email: DEFAULT_FROM,
        name: 'Space Runners',
      },
      templateId,
      dynamic_template_data: substitutions,
      mailSettings: {
        sandboxMode: {
          enable:
            this.configService.get<string>('SENDGRID_SANDBOX_MODE') === 'true',
        },
      },
    };

    try {
      await SendGridMail.send(msg);
    } catch (error) {
      console.log('Error sending Email', error.response.body);
    }
  }
}
