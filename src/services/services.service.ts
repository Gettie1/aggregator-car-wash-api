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
    const existingService = await this.vendorRepository.findOne({
      where: { services: { name: createServiceDto.name } },
      select: ['id'],
      // relations: ['services'],
    });
    if (existingService) {
      throw new BadRequestException(
        `Service with name ${createServiceDto.name} already exists`,
      );
    }
    // You need to fetch the Vendor entity by vendorId (assuming createServiceDto has vendorId)
    const vendorEntity = await this.vendorRepository.findOne({
      where: {
        id: createServiceDto.vendorId,
      },
      select: ['id', 'business_name'],
      // relations: ['services'],
    });
    if (!vendorEntity) {
      throw new BadRequestException(
        `Vendor with id ${createServiceDto.vendorId} does not exist`,
      );
    }
    const newService = this.serviceRepository.create({
      name: createServiceDto.name,
      description: createServiceDto.description,
      price: createServiceDto.price,
      duration: createServiceDto.duration,
      vendor: vendorEntity,
    });
    return this.serviceRepository.save(newService);
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

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({
      where: { id: id.toString() },
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
      where: { id: id.toString() },
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
      where: { id: id.toString() },
      relations: ['vendor', 'bookings', 'reviews'],
    });
    if (!service) {
      throw new BadRequestException(`Service with id ${id} not found`);
    }
    await this.serviceRepository.remove(service);
    return `Service with id ${id} has been removed successfully`;
  }
}
