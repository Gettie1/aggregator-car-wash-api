import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Review)
    private ratingRepository: Repository<Review>,
  ) {}
  async create(createVehicleDto: CreateVehicleDto) {
    // Check if a vehicle with the same license plate already exists
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { license_plate: createVehicleDto.license_plate },
      select: ['id'],
    });
    if (existingVehicle) {
      throw new BadRequestException(
        `Vehicle with license plate ${createVehicleDto.license_plate} already exists`,
      );
    }

    // You need to fetch or create a Customer entity before assigning it to the vehicle
    const customerEntity = await this.customerRepository.findOne({
      where: { id: createVehicleDto.customer_id },
      select: ['id', 'phone_number', 'address'],
      // relations: ['vehicles'],
    });
    if (!customerEntity) {
      throw new NotFoundException('Customer not found for the given ID');
    }

    const newVehicle = this.vehicleRepository.create({
      license_plate: createVehicleDto.license_plate,
      make: createVehicleDto.make,
      model: createVehicleDto.model,
      year: createVehicleDto.year,
      color: createVehicleDto.color,
      customer: customerEntity,
    });

    return this.vehicleRepository.save(newVehicle);
  }

  async findAll() {
    const vehicles = await this.vehicleRepository.find({
      relations: ['customer', 'bookings', 'reviews'],
    });
    return vehicles.map((vehicle) => {
      const { customer, bookings, reviews, ...vehicleWithoutRelations } =
        vehicle;

      return {
        ...vehicleWithoutRelations,
        customer: customer
          ? { id: customer.id, phone_number: customer.phone_number }
          : null,
        bookings: bookings.map((booking) => ({ id: booking.id })),
        reviews: reviews.map((review) => ({ id: review.id })),
      };
    });
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['customer', 'bookings', 'reviews'],
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }
    const { customer, bookings, reviews, ...vehicleWithoutRelations } = vehicle;

    return {
      ...vehicleWithoutRelations,
      customer: customer
        ? { id: customer.id, phone_number: customer.phone_number }
        : null,
      bookings: bookings.map((booking) => ({ id: booking.id })),
      reviews: reviews.map((review) => ({ id: review.id })),
    };
  }
  async findByCustomerId(customerId: string) {
    const vehicles = await this.vehicleRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer', 'bookings', 'reviews'],
    });
    if (vehicles.length === 0) {
      throw new NotFoundException(
        `No vehicles found for customer ID ${customerId}`,
      );
    }
    return vehicles.map((vehicle) => {
      const { customer, bookings, reviews, ...vehicleWithoutRelations } =
        vehicle;
      return {
        ...vehicleWithoutRelations,
        customer: customer
          ? { id: customer.id, phone_number: customer.phone_number }
          : null,
        bookings: bookings.map((booking) => ({ id: booking.id })),
        reviews: reviews.map((review) => ({ id: review.id })),
      };
    });
  }
  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['customer', 'bookings', 'reviews'],
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    // Update the vehicle properties
    Object.assign(vehicle, updateVehicleDto);

    // Save the updated vehicle
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['customer', 'bookings', 'reviews'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    // Soft delete (just mark it as deleted)
    await this.vehicleRepository.update(id, { is_deleted: true });

    return `Vehicle with ID ${id} has been soft deleted successfully`;
  }
}
