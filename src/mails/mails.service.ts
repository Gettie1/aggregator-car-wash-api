import { sendEmailDto } from './dto/sendEmail.dto';

import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailer: MailerService) {}

  async sendEmail({ recipients, subject, template, context }: sendEmailDto) {
    try {
      await this.mailer.sendMail({
        to: recipients,
        subject,
        template,
        context,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }
}
