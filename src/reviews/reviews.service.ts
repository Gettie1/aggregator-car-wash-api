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
  async create(createReviewDto: CreateReviewDto) {
    // Validate and fetch related entities if necessary

    const customer = await this.customerRepository.findOne({
      where: { id: createReviewDto.customer_id },
      select: ['id'],
      relations: ['profile'],
    });
    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createReviewDto.customer_id} does not exist`,
      );
    }

    // Fetch the booking to ensure it exists
    const booking = await this.bookingRepository.findOne({
      where: { id: createReviewDto.booking_id },
      select: ['id'],
    });
    if (!booking) {
      throw new NotFoundException(
        `Booking with ID ${createReviewDto.booking_id} does not exist`,
      );
    }

    // Optionally fetch vehicle, service, and vendor if provided
    let vehicle: Vehicle | null = null;
    if (createReviewDto.vehicle_id) {
      vehicle = await this.vehicleRepository.findOne({
        where: { id: createReviewDto.vehicle_id },
        select: ['id'],
      });
      if (!vehicle) {
        throw new NotFoundException(
          `Vehicle with ID ${createReviewDto.vehicle_id} does not exist`,
        );
      }
    }

    let service: Service | null = null;
    if (createReviewDto.service_id) {
      service = await this.serviceRepository.findOne({
        where: { id: createReviewDto.service_id },
        select: ['id'],
      });
      if (!service) {
        throw new NotFoundException(
          `Service with ID ${createReviewDto.service_id} does not exist`,
        );
      }
    }

    const vendor = await this.vendorRepository.findOne({
      where: { id: createReviewDto.vendor_id },
      select: ['id'],
    });
    if (!vendor) {
      throw new NotFoundException(
        `Vendor with ID ${createReviewDto.vendor_id} does not exist`,
      );
    }

    // Create the review entity

    const review = this.reviewRepository.create({
      booking_id: createReviewDto.booking_id,
      customer_id: createReviewDto.customer_id,
      vehicle_id: createReviewDto.vehicle_id,
      service_id: createReviewDto.service_id,
      vendor_id: createReviewDto.vendor_id,
      rating: createReviewDto.rating,
    });

    const savedReview = await this.reviewRepository.save(review);
    return savedReview;
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

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['vehicle', 'service', 'vendor', 'customer'],
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
      customer: review.customer
        ? {
            id: review.customer.id,
            firstName: review.customer.profile?.firstName,
            lastName: review.customer.profile?.lastName,
            email: review.customer.profile?.email,
          }
        : null,
    };
  }
  async findByCustomerId(customerId: number) {
    const reviews = await this.reviewRepository.find({
      where: { customer: { id: customerId } },
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
  async findByVehicleId(vehicleId: number) {
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
  async findByVendorId(vendorId: number) {
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
  async update(id: number, updateReviewDto: UpdateReviewDto) {
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

  async remove(id: number) {
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
