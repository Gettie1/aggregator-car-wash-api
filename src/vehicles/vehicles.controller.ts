import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
// import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/profile/entities/profile.entity';
// import { UseGuards } from '@nestjs/common';
// import { AtGuard } from 'src/auth/guards/at.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

// @UseGuards(AtGuard, RolesGuard)
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Vehicles')
@ApiBearerAuth('Access Token')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }
}
