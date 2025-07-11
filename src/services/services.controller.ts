import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
// import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/profile/entities/profile.entity';
// import { UseGuards } from '@nestjs/common';
// import { AtGuard } from 'src/auth/guards/at.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

// @UseGuards(AtGuard, RolesGuard)
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Services')
@ApiBearerAuth('Access Token')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Roles(Role.ADMIN, Role.VENDOR)
  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }
  @Roles(Role.ADMIN, Role.VENDOR)
  @Get()
  findAll() {
    return this.servicesService.findAll();
  }
  @Roles(Role.ADMIN, Role.VENDOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }
  @Roles(Role.ADMIN, Role.VENDOR)
  @Get('profile/:profileId')
  getServicesByVendorId(@Param('profileId') profileId: string) {
    return this.servicesService.getServicesByProfileId(+profileId);
  }
  @Roles(Role.ADMIN, Role.VENDOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
