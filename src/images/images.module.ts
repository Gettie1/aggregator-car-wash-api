import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService], // Exporting ImagesService if needed in other modules
  imports: [ConfigModule], // Add any necessary imports here, such as TypeOrmModule for database entities
})
export class ImagesModule {}
