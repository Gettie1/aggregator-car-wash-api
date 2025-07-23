import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Review)
    private ratingRepository: Repository<Review>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}
  async create(createServiceDto: CreateServiceDto) {
    // check if service name already exists for the same vendor
    const existingService = await this.serviceRepository.findOne({
      where: {
        vendor: { id: createServiceDto.vendorId },
        name: createServiceDto.name,
      },
      select: ['id'],
      relations: ['vendor'],
    });
    if (existingService) {
      throw new BadRequestException(
        `Service with name ${createServiceDto.name} already exists for this vendor`,
      );
    }
    // Find the vendor by ID
    const vendor = await this.vendorRepository.findOne({
      where: { id: createServiceDto.vendorId },
      select: ['id', 'business_name'],
    });
    if (!vendor) {
      throw new BadRequestException(
        `Vendor with id ${createServiceDto.vendorId} not found`,
      );
    }
    // Create a new service entity
    const newService = this.serviceRepository.create({
      name: createServiceDto.name,
      description: createServiceDto.description,
      price: Number(createServiceDto.price),
      duration: Number(createServiceDto.duration),
      vendor,
    });
    // Save the new service to the database
    const savedService = await this.serviceRepository.save(newService);
    const { vendor: savedVendor, ...serviceWithoutRelations } = savedService;
    return {
      ...serviceWithoutRelations,
      vendor: savedVendor
        ? { id: savedVendor.id, business_name: savedVendor.business_name }
        : null,
      bookings: [],
      reviews: [],
    };
  }
  async findAll() {
    const services = await this.serviceRepository.find({
      relations: ['vendor', 'bookings', 'reviews'],
    });
    return services.map((service) => {
      const { vendor, bookings, reviews, ...serviceWithoutRelations } = service;
      return {
        ...serviceWithoutRelations,
        vendor: vendor
          ? { id: vendor.id, business_name: vendor.business_name }
          : null,
        bookings: bookings.map((booking: Booking) => ({
          id: booking.id,
          // Replace 'date' with an existing property, e.g., 'createdAt' or remove if not needed
          // createdAt: booking.createdAt,
        })),
        reviews: reviews.map((review: Review) => ({
          id: review.id,
          rating: review.rating,
        })),
      };
    });
  }
  // return array of services belonging to a specific vendor
  // services.service.ts
  // get array of  services belonging to a vendor by profile id

  async getServicesByVendorId(vendorId: number) {
    const services = await this.serviceRepository.find({
      where: { vendor: { id: vendorId } },
      relations: ['vendor', 'bookings', 'reviews'],
    });
    if (services.length === 0) {
      throw new BadRequestException(
        `No services found for vendor with id ${vendorId}`,
      );
    }
    return services.map((service) => {
      const { vendor, bookings, reviews, ...serviceWithoutRelations } = service;
      return {
        ...serviceWithoutRelations,
        vendor: vendor
          ? { id: vendor.id, business_name: vendor.business_name }
          : null,
        bookings: bookings.map((booking: Booking) => ({
          id: booking.id,
          // Replace 'date' with an existing property, e.g., 'createdAt' or remove if not needed
          // createdAt: booking.createdAt,
        })),
        reviews: reviews.map((review: Review) => ({
          id: review.id,
          rating: review.rating,
        })),
      };
    });
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id: id },
      relations: ['vendor', 'bookings', 'reviews'],
    });
    if (!service) {
      throw new BadRequestException(`Service with id ${id} not found`);
    }
    const { vendor, bookings, reviews, ...serviceWithoutRelations } = service;
    return {
      ...serviceWithoutRelations,
      vendor: vendor
        ? { id: vendor.id, business_name: vendor.business_name }
        : null,
      bookings: bookings.map((booking: Booking) => ({
        id: booking.id,
        // Replace 'date' with an existing property, e.g., 'createdAt' or remove if not needed
        // createdAt: booking.createdAt,
      })),
      reviews: reviews.map((review: Review) => ({
        id: review.id,
        rating: review.rating,
      })),
    };
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne({
      where: { id: id },
      relations: ['vendor', 'bookings', 'reviews'],
    });
    if (!service) {
      throw new BadRequestException(`Service with id ${id} not found`);
    }
    // Update the service with the new data
    Object.assign(service, updateServiceDto);
    const updatedService = await this.serviceRepository.save(service);
    const { vendor, bookings, reviews, ...serviceWithoutRelations } =
      updatedService;
    return {
      ...serviceWithoutRelations,
      vendor: vendor
        ? { id: vendor.id, business_name: vendor.business_name }
        : null,
      bookings: bookings.map((booking: Booking) => ({
        id: booking.id,
        // Replace 'date' with an existing property, e.g., 'createdAt' or remove if not needed
        // createdAt: booking.createdAt,
      })),
      reviews: reviews.map((rating: Review) => ({
        id: rating.id,
        rating: rating.rating,
      })),
    };
  }

  async remove(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id: id },
      relations: ['vendor', 'bookings', 'reviews'],
    });
    if (!service) {
      throw new BadRequestException(`Service with id ${id} not found`);
    }
    await this.serviceRepository.remove(service);
    return `Service with id ${id} has been removed successfully`;
  }
}
