import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

@Module({
  providers: [
    {
      provide: MailService,
      useFactory: () => new MailService()
    }
  ],
  exports: [MailService]
})
export class MailModule {}
