import { Module } from '@nestjs/common';
import { MailService } from './mails.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('MAIL_HOST'),
          port: configService.getOrThrow<number>('MAIL_PORT'),
          secure: configService.getOrThrow<boolean>('MAIL_SECURE'),
          auth: {
            user: configService.getOrThrow<string>('MAIL_USERNAME'),
            pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
          },
          requireTLS: false,
          tls: {
            rejectUnauthorized: false, // This is not recommended for production
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('MAIL_USERNAME')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter({
            inlineCssEnabled: true,
          }),
          options: {
            strict: false, // Allow non-strict mode for templates
          },
        },
      }),
    }),
  ],

  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailsModule {}
