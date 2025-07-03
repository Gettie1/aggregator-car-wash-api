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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
// import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/profile/entities/profile.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// Removed UseGuards import and decorator since guards are applied globally
// import { UseGuards } from '@nestjs/common';
// import { AtGuard } from 'src/auth/guards/at.guard';
// import { RolesGuard } from 'src/auth/guards/roles.guard';

// Guards are now applied globally - no need for @UseGuards decorator
// @UseGuards(AtGuard, RolesGuard)
// @Public()
@ApiTags('Bookings')
@ApiBearerAuth('Access Token')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Get()
  findAll(@Query('search') search?: string) {
    return this.bookingsService.findAll(search);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
