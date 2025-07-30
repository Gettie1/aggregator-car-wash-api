import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { VendorsModule } from './vendors/vendors.module';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './profile/profile.module';
import { CustomerModule } from './customer/customer.module';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './app.logs/logs.module';
import { LoggerMiddleware } from './logger.middleware';
// import { AtGuard } from './auth/guards/at.guard';
// import { RolesGuard } from './auth/guards/roles.guard';
import { Profile } from './profile/entities/profile.entity';
// import { APP_GUARD } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgresql://neondb_owner:npg_tLC2sHF5mkpG@ep-withered-shadow-aejmah9y-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',

      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
      logging: process.env.NODE_ENV === 'development',
    }),
    // Add Profile entity for global RolesGuard
    TypeOrmModule.forFeature([Profile]),
    ServicesModule,
    BookingsModule,
    ReviewsModule,
    VehiclesModule,
    AdminModule,
    ReportsModule,
    VendorsModule,
    DatabaseModule,
    ProfileModule,
    CustomerModule,
    AuthModule,
    LogsModule,
    SeedModule,
    ChatModule,
    PaymentsModule,
    ImagesModule,
  ],
  providers: [
    // { provide: APP_GUARD, useClass: AtGuard },
    // { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
