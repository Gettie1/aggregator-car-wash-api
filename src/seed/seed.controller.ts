import { Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);
  constructor(private readonly seedService: SeedService) {}
  @ApiBearerAuth('Access Token')
  @ApiTags('Seed')
  @Post()
  @HttpCode(HttpStatus.OK)
  async seed() {
    this.logger.log('Seeding database...');
    return this.seedService.seed();
  }
}
