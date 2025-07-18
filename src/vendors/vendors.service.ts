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
// import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
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
    // Check if vendor with the business name already exists
    const existingVendor = await this.vendorRepository.findOne({
      where: { business_name: createVendorDto.business_name },
      relations: ['profile'],
    });

    if (existingVendor) {
      throw new BadRequestException(
        `Vendor with business name ${createVendorDto.business_name} already exists`,
      );
    }

    let profile: Profile | null = null;

    // 1. If profileId is provided, try to find it
    if (createVendorDto.profileId) {
      profile = await this.profileRepository.findOne({
        where: {
          id: +createVendorDto.profileId,
          role: Role.VENDOR,
        },
      });

      if (!profile) {
        throw new NotFoundException(
          `Profile with ID ${createVendorDto.profileId} not found`,
        );
      }
    }

    // 2. If no existing profile found, create one
    if (!profile) {
      const newProfile = this.profileRepository.create({
        firstName: createVendorDto.firstName,
        lastName: createVendorDto.lastName,
        email: createVendorDto.email,
        password: createVendorDto.password,
        phone: createVendorDto.phone,
        role: Role.VENDOR,
      });
      profile = await this.profileRepository.save(newProfile);
    }

    // 3. Create and link the vendor
    const vendor = this.vendorRepository.create({
      business_name: createVendorDto.business_name,
      taxId: createVendorDto.tax_id,
      address: createVendorDto.address,
      status: createVendorDto.status || 'active',
      profile: profile,
    });

    await this.vendorRepository.save(vendor);

    // 4. Return combined result
    return {
      ...vendor,
      profile,
    };
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
        'services',
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
