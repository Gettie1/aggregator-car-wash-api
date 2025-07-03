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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from './entities/profile.entity';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/at.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth('Access Token')
@UseGuards(AtGuard, RolesGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Public()
  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }
  @Roles(Role.ADMIN)
  @Get()
  findAll(@Query('search') search?: string) {
    return this.profileService.findAll(search);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }
  @Roles(Role.ADMIN, Role.CUSTOMER, Role.VENDOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }
}
