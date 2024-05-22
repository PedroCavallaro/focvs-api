import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export class MailService {
  private mailer: Mail<SentMessageInfo>;

  async onModuleInit() {
    this.mailer = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'jessy.lind75@ethereal.email',
        pass: 't7D2k2TrW5pedhwhvQ'
      }
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    await this.mailer.sendMail({
      to: to,
      from: `Focvs APP <focvs@gmail.com>`,
      subject,
      text
    });
  }
}
