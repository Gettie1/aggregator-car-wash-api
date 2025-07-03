import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { Customer } from 'src/customer/entities/customer.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { Service } from 'src/services/entities/service.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private BookingRepository: Repository<Booking>,
    @InjectRepository(Customer)
    private CustomerRepository: Repository<Customer>,
    @InjectRepository(Vendor)
    private VendorRepository: Repository<Vendor>,
    // service, reviews and vehicles
    @InjectRepository(Service)
    private ServiceRepository: Repository<Service>,
    @InjectRepository(Review)
    private ReviewRepository: Repository<Review>,
    @InjectRepository(Vehicle)
    private VehicleRepository: Repository<Vehicle>,
  ) {}
  async create(createBookingDto: CreateBookingDto) {
    const { customerId, vendorId, serviceId, vehicleId } = createBookingDto;

    const customer = await this.CustomerRepository.findOneBy({
      id: customerId,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const vendor = await this.VendorRepository.findOneBy({ id: vendorId });
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    const service = await this.ServiceRepository.findOneBy({ id: serviceId });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const vehicle = await this.VehicleRepository.findOneBy({ id: vehicleId });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const booking = this.BookingRepository.create({
      ...createBookingDto,
      customer,
      vendor,
      service,
      vehicle,
    });

    return this.BookingRepository.save(booking);
  }

  async findAll(search?: string) {
    if (search) {
      return this.BookingRepository.createQueryBuilder('booking')
        .leftJoinAndSelect('booking.customer', 'customer')
        .leftJoinAndSelect('booking.vendor', 'vendor')
        .leftJoinAndSelect('booking.service', 'service')
        .leftJoinAndSelect('booking.vehicle', 'vehicle')
        .where('booking.id = :search', { search })
        .orWhere('customer.firstname = :search', { search })
        .orWhere('vendor.name = :search', { search })
        .orWhere('service.name = :search', { search })
        .getMany();
    }
    return this.BookingRepository.find({
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
  }

  async findOne(id: number) {
    const booking = await this.BookingRepository.findOne({
      where: { id: id.toString() },
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return {
      ...booking,
      customer: booking.customer.id,
      vendor: booking.vendor.id,
      service: booking.service.id,
      vehicle: booking.vehicle.id,
    };
  }

  async update(id: number, updateBookingDto: UpdateBookingDto) {
    const booking = await this.BookingRepository.findOne({
      where: { id: id.toString() },
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    const updatedBooking = Object.assign(booking, updateBookingDto);
    return this.BookingRepository.save(updatedBooking);
  }

  async remove(id: number) {
    const booking = await this.BookingRepository.findOne({
      where: { id: id.toString() },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return this.BookingRepository.remove(booking);
  }
}
