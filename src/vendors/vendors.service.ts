import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Profile } from 'src/profile/entities/profile.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/reviews/entities/review.entity';
import { Repository } from 'typeorm';
import { Vendor } from './entities/vendor.entity';
import { Role } from 'src/profile/entities/profile.entity';
// import { profile } from 'console';

@Injectable()
export class VendorsService {
  // profile, bookings, services, reviews
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Review)
    private ratingRepository: Repository<Review>,
  ) {}
  async create(createVendorDto: CreateVendorDto) {
    // Check if a vendor with the same business name already exists
    const existingVendor = await this.profileRepository.findOne({
      where: { vendor: { business_name: createVendorDto.business_name } },
      select: ['id'],
      relations: ['vendor'],
    });
    if (existingVendor) {
      throw new BadRequestException(
        `Vendor with business name ${createVendorDto.business_name} already exists`,
      );
    }

    // You need to fetch or create a Profile entity before assigning it to the vendor
    // For example, if you have a profileId in the DTO:
    const profileEntity = await this.profileRepository.findOne({
      where: {
        id: Number(createVendorDto.profileId),
        role: Role.VENDOR,
      },
      select: ['id', 'firstName', 'lastName', 'email', 'phone'],
      relations: ['vendor'],
    });
    if (!profileEntity) {
      throw new BadRequestException('Profile not found for the given ID');
    }

    // Create a new Vendor entity
    const newVendor = this.vendorRepository.create({
      business_name: createVendorDto.business_name,
      tax_id: createVendorDto.tax_id,
      business_address: createVendorDto.business_address,
      status: createVendorDto.status || 'active', // Default status to 'active'
      profile: profileEntity,
    });
    return this.vendorRepository.save(newVendor);
  }

  async findAll(search?: string) {
    let vendors: Profile[];
    if (search) {
      vendors = await this.profileRepository.find({
        where: {
          // vendor: { business_name: search },
          role: Role.VENDOR,
        },
        relations: ['vendor'],
      });
    } else {
      vendors = await this.profileRepository.find({
        where: {
          role: Role.VENDOR,
        },
        relations: ['vendor'],
      });
    }

    return vendors.map((vendor) => ({
      ...vendor,
      vendor: vendor.vendor,
    }));
  }

  async findOne(id: string) {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: [
        'profile',
        // 'vendor.bookings',
        // 'vendor.services',
        // 'vendor.reviews',
      ],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return {
      ...vendor,
      profile: vendor.profile,
    };
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    // Update the vendor's profile
    const updatedVendor = Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(updatedVendor);
  }

  async remove(id: string) {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    // Remove the vendor's profile and associated vendor data
    await this.vendorRepository.remove(vendor);
    return { message: `Vendor with ID ${id} removed successfully` };
  }
}
