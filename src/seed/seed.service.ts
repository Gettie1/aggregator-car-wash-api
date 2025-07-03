import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Customer } from 'src/customer/entities/customer.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Service } from 'src/services/entities/service.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Vendor } from 'src/vendors/entities/vendor.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
// Import Role enum or constant
import { Role } from 'src/profile/entities/profile.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    // profile,vendor,customer,vehicle,service,booking,review
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    this.logger.log('Started seeding database...');
    try {
      // Clear all the tables in correct order to avoid foreign key constraints
      this.logger.log('Clearing existing data...');
      //using queryRunner for transactional operations
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.query('DELETE FROM reviews');
        await queryRunner.query('DELETE FROM booking');
        await queryRunner.query('DELETE FROM service');
        await queryRunner.query('DELETE FROM vehicles');
        await queryRunner.query('DELETE FROM vendors');
        await queryRunner.query('DELETE FROM customer');
        await queryRunner.query('DELETE FROM profile');

        this.logger.log('Data seeded successfully.');

        // Commit the transaction
        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error('Error during transaction', error);
        throw error;
      } finally {
        await queryRunner.release();
      }

      //seeding data
      //seeding profiles
      this.logger.log('Seeding profiles...');
      const profiles: Profile[] = Array.from({ length: 10 }).map(() => {
        const profile = new Profile();
        profile.firstName = faker.person.firstName();
        profile.lastName = faker.person.lastName();
        profile.email = faker.internet.email();
        profile.password = faker.internet.password({ length: 8 });
        profile.phone = faker.phone.number();
        profile.role = faker.helpers.arrayElement([
          Role.CUSTOMER,
          Role.VENDOR,
          Role.ADMIN,
        ]);
        profile.created_at = faker.date.past();
        profile.updated_at = faker.date.recent();

        return profile;
      });
      await this.profileRepository.save(profiles);
      this.logger.log('Profiles seeded successfully.');
      this.logger.log('Seeding customers...');

      const customers: Customer[] = profiles.slice(0, 10).map((profile) => {
        const customer = new Customer();
        customer.phone_number = faker.phone.number();
        customer.address = faker.location.streetAddress();
        customer.profile = profile; // 🔥 Unique per customer
        return customer;
      });

      await this.customerRepository.save(customers);
      this.logger.log('Customers seeded successfully.');

      //seeding services
      this.logger.log('Seeding services...');
      const services: Service[] = Array.from({ length: 10 }).map(() => {
        const service = new Service();
        service.name = faker.commerce.productName();
        service.description = faker.commerce.productDescription();
        service.price = Number(faker.commerce.price({ min: 10, max: 100 }));
        service.duration = faker.number.int({ min: 15, max: 120 });
        // service.reviews = faker.helpers.arrayElements(reviews, {
        //   min: 1,
        //   max: 3,
        // });
        return service;
      });
      await this.serviceRepository.save(services);
      this.logger.log('Services seeded successfully.');

      //seeding bookings
      this.logger.log('Seeding bookings...');
      const bookings: Booking[] = Array.from({ length: 10 }).map(() => {
        const booking = new Booking();
        booking.date = faker.date.future();
        booking.status = faker.helpers.arrayElement([
          'pending',
          'confirmed',
          'cancelled',
        ]);
        booking.duration = faker.number.int({ min: 30, max: 120 });
        booking.location = faker.location.streetAddress();
        booking.payment_status = faker.helpers.arrayElement(['paid', 'unpaid']);
        booking.service = faker.helpers.arrayElement(services);
        booking.customer = faker.helpers.arrayElement(customers);
        return booking;
      });
      await this.bookingRepository.save(bookings);
      this.logger.log('Bookings seeded successfully.');

      //seeding vehicles
      this.logger.log('Seeding vehicles...');
      const vehicles: Vehicle[] = Array.from({ length: 10 }).map(() => {
        const vehicle = new Vehicle();
        vehicle.make = faker.vehicle.manufacturer();
        vehicle.model = faker.vehicle.model();
        vehicle.year = faker.date.past({ years: 20 }).getFullYear();
        vehicle.license_plate = faker.vehicle.vrm();
        vehicle.color = faker.color.human();
        vehicle.customer = faker.helpers.arrayElement(customers);
        return vehicle;
      });
      await this.vehicleRepository.save(vehicles);
      this.logger.log('Vehicles seeded successfully.');

      //seeding vendors
      this.logger.log('Seeding vendors...');
      const vendors: Vendor[] = Array.from({ length: 10 }).map(() => {
        const vendor = new Vendor();
        vendor.business_name = faker.company.name();
        vendor.tax_id = faker.string.alphanumeric(10);
        vendor.status = faker.helpers.arrayElement([
          'active',
          'inactive',
          'suspended',
        ]);
        vendor.profile = new Profile();
        vendor.profile.firstName = faker.person.firstName();
        vendor.profile.lastName = faker.person.lastName();
        vendor.profile.email = faker.internet.email();
        vendor.profile.phone = faker.phone.number();
        vendor.business_address = faker.location.streetAddress();
        vendor.services = faker.helpers.arrayElements(services, {
          min: 1,
          max: 3,
        });
        vendor.bookings = faker.helpers.arrayElements(bookings, {
          min: 1,
          max: 3,
        });
        return vendor;
      });
      await this.vendorRepository.save(vendors);
      this.logger.log('Vendors seeded successfully.');

      //seeding reviews
      this.logger.log('Seeding reviews...');

      // 1. Fetch existing entity IDs
      const bookingIds = (
        await this.bookingRepository.find({ select: ['id'] })
      ).map((b) => b.id);
      const vehicleIds = (
        await this.vehicleRepository.find({ select: ['id'] })
      ).map((v) => v.id);
      const serviceIds = (
        await this.serviceRepository.find({ select: ['id'] })
      ).map((s) => s.id);
      const vendorIds = (
        await this.vendorRepository.find({ select: ['id'] })
      ).map((v) => v.id);

      // 2. Check if any are missing
      if (
        bookingIds.length === 0 ||
        vehicleIds.length === 0 ||
        serviceIds.length === 0 ||
        vendorIds.length === 0
      ) {
        throw new Error(
          'Cannot seed reviews: Missing related data (bookings, vehicles, services, vendors)',
        );
      }

      // 3. Create and assign real IDs
      const reviews: Review[] = Array.from({ length: 10 }).map(() => {
        const review = new Review();
        review.booking_id = faker.helpers.arrayElement(bookingIds);
        review.vehicle_id = faker.helpers.arrayElement(vehicleIds);
        review.service_id = faker.helpers.arrayElement(serviceIds);
        review.vendor_id = faker.helpers.arrayElement(vendorIds);
        review.rating = faker.number.int({ min: 1, max: 5 });
        review.comment = faker.lorem.sentence();
        return review;
      });

      await this.reviewRepository.save(reviews);

      this.logger.log('Reviews seeded successfully.');
      this.logger.log('Database seeding completed successfully.');
    } catch (error) {
      this.logger.error('Error seeding database', error);
      throw error;
    }
  }
}
