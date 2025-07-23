import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/profile/entities/profile.entity';
import * as multer from 'multer';

@Controller('images')
export class ImagesController {
  constructor(private readonly cloudinaryService: ImagesService) {}
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(), // Store file in memory
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const imageUrl = await this.cloudinaryService.uploadImage(file.buffer);
    return { imageUrl };
  }
}
