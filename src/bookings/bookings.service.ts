import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { BookingStatus } from './entities/booking.entity';

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
    const {
      customerId,
      vendorName,
      serviceName,
      vehiclePlateNo,
      scheduled_at,
    } = createBookingDto;

    const customer = await this.CustomerRepository.findOneBy({
      id: customerId,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const vendor = await this.VendorRepository.findOneBy({
      business_name: vendorName,
    });
    if (!vendor) {
      throw new NotFoundException(`Vendor with ${vendorName} not found`);
    }

    const service = await this.ServiceRepository.findOneBy({
      name: serviceName,
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const vehicle = await this.VehicleRepository.findOne({
      where: { license_plate: vehiclePlateNo },
      relations: ['customer'],
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Check if the scheduled time already exists for any booking
    // import { ConflictException } from '@nestjs/common'; // at the top if not already

    // Check if vendor already has a booking at the same time
    const existingTimeBooking = await this.BookingRepository.createQueryBuilder(
      'booking',
    )
      .innerJoin('booking.vendor', 'vendor')
      .where('booking.scheduled_at = :scheduledAt', {
        scheduledAt: scheduled_at,
      })
      .andWhere('vendor.business_name = :vendorName', { vendorName })
      .getOne();

    if (existingTimeBooking) {
      throw new ConflictException(
        `Vendor '${vendorName}' already has a booking at ${scheduled_at instanceof Date ? scheduled_at.toISOString() : scheduled_at}. Please choose a different time.`,
      );
    }

    // Ensure the vehicle is not already booked by another customer
    // const existingBooking = await this.BookingRepository.findOne({
    //   where: {
    //     vehicle: { license_plate: vehiclePlateNo },
    //     status: BookingStatus.PENDING, // or any other status you want to check against
    //   },
    //   relations: ['vehicle', 'customer'],
    // });

    // if (existingBooking) {
    //   throw new NotFoundException(
    //     'This vehicle is already linked to another booking.',
    //     '',
    //   );
    // }

    // // Ensure the vehicle belongs to the customer
    // if (vehicle.customer.id !== customer.id) {
    //   throw new NotFoundException(
    //     'This vehicle does not belong to the specified customer.',
    //     '',
    //   );
    // }

    const booking = this.BookingRepository.create({
      ...createBookingDto,
      price: service.price,
      customer: customer,
      vendor: vendor,
      service: service,
      vehicle: vehicle,
    });

    return this.BookingRepository.save(booking);
  }

  async findAll() {
    const bookings = await this.BookingRepository.find({
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
    return bookings.map((booking) => {
      return {
        ...booking,
        customer: booking.customer.id,
        vendor: booking.vendor.business_name,
        service: booking.service.name,
        servicePrice: booking.service.price,
        vehicle: booking.vehicle.license_plate,
      };
    });
  }

  async findByCustomerId(customerId: number) {
    const bookings = await this.BookingRepository.find({
      where: { customer: { id: customerId } },
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
    if (bookings.length === 0) {
      throw new NotFoundException(
        `No bookings found for customer ID ${customerId}`,
      );
    }
    return bookings.map((booking) => {
      return {
        ...booking,
        customer: booking.customer.id,
        vendor: booking.vendor.business_name,
        service: booking.service.name,
        servicePrice: booking.service.price,
        vehicle: booking.vehicle.license_plate,
      };
    });
  }
  // findbyvendorid or name
  async findByVendorId(vendorId: number) {
    const bookings = await this.BookingRepository.find({
      where: { vendor: { id: vendorId } },
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
    if (bookings.length === 0) {
      throw new NotFoundException(
        `No bookings found for vendor ID ${vendorId}`,
        '',
      );
    }
    return bookings.map((booking) => {
      return {
        ...booking,
        customer: booking.customer.id,
        vendor: booking.vendor.business_name,
        service: booking.service.name,
        vehicle: booking.vehicle.license_plate,
      };
    });
  }
  async findOne(id: number) {
    const booking = await this.BookingRepository.findOne({
      where: { id: id },
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
      where: { id: id },
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    const updatedBooking = Object.assign(booking, updateBookingDto);
    return this.BookingRepository.save(updatedBooking);
  }

  async updateBookingStatus(id: number, status: BookingStatus) {
    const booking = await this.BookingRepository.findOne({
      where: { id: id },
      relations: ['customer', 'vendor', 'service', 'vehicle'],
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }

    booking.status = status;
    return this.BookingRepository.save(booking);
  }
  async remove(id: number) {
    const booking = await this.BookingRepository.findOne({
      where: { id: id },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with id ${id} not found`);
    }
    return this.BookingRepository.remove(booking);
  }
}
