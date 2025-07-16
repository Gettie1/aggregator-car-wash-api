import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Service } from 'src/services/entities/service.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Customer } from 'src/customer/entities/customer.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  async create(createRatingDto: CreateReviewDto) {
    // Validate and fetch related entities if necessary
    const { customer_id, booking_id, vehicle_id, service_id, vendor_id } =
      createRatingDto;

    const customer = await this.customerRepository.findOne({
      where: { id: customer_id },
      select: ['id'],
      relations: ['profile'],
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${customer_id} does not exist`,
      );
    }

    // Fetch the booking to ensure it exists
    const booking = await this.bookingRepository.findOne({
      where: { id: booking_id },
      select: ['id'],
    });
    if (!booking) {
      throw new NotFoundException(
        `Booking with ID ${booking_id} does not exist`,
      );
    }

    // Optionally fetch vehicle, service, and vendor if provided
    let vehicle;
    if (vehicle_id) {
      vehicle = await this.vehicleRepository.findOne({
        where: { id: vehicle_id },
        select: ['id'],
      });
      if (!vehicle) {
        throw new NotFoundException(
          `Vehicle with ID ${vehicle_id} does not exist`,
        );
      }
    }

    let service;
    if (service_id) {
      service = await this.serviceRepository.findOne({
        where: { id: service_id },
        select: ['id'],
      });
      if (!service) {
        throw new NotFoundException(
          `Service with ID ${service_id} does not exist`,
        );
      }
    }

    let vendor;
    if (vendor_id) {
      vendor = await this.vendorRepository.findOne({
        where: { id: vendor_id },
        select: ['id'],
      });
      if (!vendor) {
        throw new NotFoundException(
          `Vendor with ID ${vendor_id} does not exist`,
        );
      }
    }

    // Create the review entity
    const review = this.reviewRepository.create({
      ...createRatingDto,
    });

    return this.reviewRepository.save(review);
  }

  async findAll() {
    const reviews = await this.reviewRepository.find({
      relations: ['vehicle', 'service', 'vendor', 'customer'],
    });

    return reviews.map((review) => {
      const { vehicle, service, vendor, ...reviewWithoutRelations } = review;
      return {
        ...reviewWithoutRelations,
        // customer: customer && typeof customer === 'object' && 'profile' in customer && customer.profile && typeof customer.profile === 'object' && 'email' in customer.profile
        //   ? { id: customer.id, email: (customer.profile as { email?: string }).email }
        //   : null,
        vehicle: vehicle
          ? { id: vehicle.id, license_plate: vehicle.license_plate }
          : null,
        service: service ? { id: service.id, name: service.name } : null,
        vendor: vendor
          ? { id: vendor.id, business_name: vendor.business_name }
          : null,
      };
    });
  }

  async findOne(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['vehicle', 'service', 'vendor'],
    });

    if (!review) {
      throw new NotFoundException(`review with ID ${id} not found`);
    }

    const { vehicle, service, vendor, ...reviewWithoutRelations } = review;
    return {
      ...reviewWithoutRelations,
      vehicle: vehicle
        ? { id: vehicle.id, license_plate: vehicle.license_plate }
        : null,
      service: service ? { id: service.id, name: service.name } : null,
      vendor: vendor
        ? { id: vendor.id, business_name: vendor.business_name }
        : null,
    };
  }
  async findByCustomerId(customerId: string) {
    const reviews = await this.reviewRepository.find({
      where: { id: customerId },
      relations: ['customer', 'vehicle', 'service', 'vendor', 'booking'], // adjust as needed
      order: { created_at: 'DESC' },
    });

    if (!reviews.length) {
      throw new NotFoundException(
        `No reviews found for customer ID ${customerId}`,
      );
    }

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      created_at: review.created_at,
      vehicle: review.vehicle ? review.vehicle.license_plate : null,
      service: review.service?.name || null,
      vendor: review.vendor?.business_name || null,
    }));
  }
  async findByVehicleId(vehicleId: string) {
    const reviews = await this.reviewRepository.find({
      where: { vehicle: { id: vehicleId } },
      relations: ['vehicle', 'service', 'vendor'],
    });
    if (reviews.length === 0) {
      throw new NotFoundException(
        `No reviews found for vehicle ID ${vehicleId}`,
      );
    }
    return reviews.map((review) => {
      const { vehicle, service, vendor, ...reviewWithoutRelations } = review;
      return {
        ...reviewWithoutRelations,
        vehicle: vehicle
          ? { id: vehicle.id, license_plate: vehicle.license_plate }
          : null,
        service: service ? { id: service.id, name: service.name } : null,
        vendor: vendor
          ? { id: vendor.id, business_name: vendor.business_name }
          : null,
      };
    });
  }
  async findByVendorId(vendorId: string) {
    const reviews = await this.reviewRepository.find({
      where: { vendor: { id: vendorId } },
      relations: ['vehicle', 'service', 'vendor', 'customer.profile'],
    });
    if (reviews.length === 0) {
      throw new NotFoundException(`No reviews found for vendor ID ${vendorId}`);
    }
    return reviews.map((review) => {
      const { vehicle, service, vendor, customer, ...reviewWithoutRelations } =
        review;
      return {
        ...reviewWithoutRelations,
        customer: customer?.profile
          ? {
              id: customer.id,
              firstName: customer.profile.firstName,
              lastName: customer.profile.lastName,
              email: customer.profile.email,
            }
          : null,
        vehicle: vehicle
          ? { id: vehicle.id, license_plate: vehicle.license_plate }
          : null,
        service: service ? { id: service.id, name: service.name } : null,
        vendor: vendor
          ? { id: vendor.id, business_name: vendor.business_name }
          : null,
      };
    });
  }
  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['vehicle', 'service', 'vendor'],
    });

    if (!review) {
      throw new NotFoundException(`review with ID ${id} not found`);
    }

    // Update the rating with the new data
    Object.assign(review, updateReviewDto);

    // Save the updated review
    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['vehicle', 'service', 'vendor'],
    });

    if (!review) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    // Remove the review
    await this.reviewRepository.remove(review);
    return { message: `Rating with ID ${id} removed successfully` };
  }
}
