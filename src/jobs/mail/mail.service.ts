import { SentMessageInfo } from 'nodemailer';
import { HttpStatus } from '@nestjs/common';
import { AppError } from 'src/shared/error/AppError';
import { env } from 'src/shared/env';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

export class MailService {
  private mailer: Mail<SentMessageInfo>;

  async onModuleInit() {
    this.mailer = nodemailer.createTransport({
      host: env.mailer.host,
      port: Number(env.mailer.port),
      auth: {
        user: env.mailer.user,
        pass: env.mailer.pass
      }
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    try {
      await this.mailer.sendMail({
        to: to,
        from: `Focvs APP <focvs@gmail.com>`,
        subject,
        text
      });
    } catch (error) {
      throw new AppError('Serviço de email', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
