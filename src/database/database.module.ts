import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        // host: configService.getOrThrow<string>('DB_HOST', 'localhost'),
        // port: configService.getOrThrow<number>('DB_PORT', 5432),
        // username: configService.getOrThrow<string>('DB_USERNAME', 'postgres'),
        // password: configService.getOrThrow<string>('DB_PASSWORD', 'password'),
        // database: configService.getOrThrow<string>('DB_NAME', 'mydatabase'),
        // autoLoadEntities: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.getOrThrow<boolean>('DB_SYNC', true),
        logging: configService.getOrThrow<boolean>('DB_LOGGING', false),
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
