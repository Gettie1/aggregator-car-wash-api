import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
// import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/profile/entities/profile.entity';
// import { UseGuards } from '@nestjs/common';
// import { AtGuard } from 'src/auth/guards/at.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

// @UseGuards(AtGuard, RolesGuard)
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('Vendors')
@ApiBearerAuth('Access Token')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Get()
  findAll(@Query('search') search?: string) {
    return this.vendorsService.findAll(search);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(id, updateVendorDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }
}
