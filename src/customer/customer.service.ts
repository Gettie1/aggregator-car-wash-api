import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Profile, Role } from 'src/profile/entities/profile.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Service } from 'src/services/entities/service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.profileRepository.findOne({
      where: { customer: { phone_number: createCustomerDto.phone } },
      select: ['id'],
      relations: ['customer'],
    });
    if (existingCustomer) {
      throw new BadRequestException(
        `Customer with ${createCustomerDto.phone} already exists`,
      );
    }
    const profileEntity = await this.profileRepository.findOne({
      where: {
        id: Number(createCustomerDto.profileId),
        role: Role.CUSTOMER,
      },
      select: ['id', 'firstName', 'lastName', 'email'],
      relations: ['customer'],
    });
    if (!profileEntity) {
      throw new BadRequestException('Profile not found for the given ID');
    }
    const newCustomer = this.customerRepository.create({
      phone_number: createCustomerDto.phone,
      address: createCustomerDto.address,
      profile: profileEntity,
    });
    return this.customerRepository.save(newCustomer);
  }

  async findAll(search?: string) {
    let customers: Profile[];
    if (search) {
      customers = await this.profileRepository.find({
        where: {
          role: Role.CUSTOMER,
        },
        relations: ['customer'],
      });
    } else {
      customers = await this.profileRepository.find({
        where: {
          role: Role.CUSTOMER,
        },
        relations: ['customer'],
      });
    }
    // Return only specific profile data and customer data
    return customers.map((customer) => {
      const {
        id,
        firstName,
        lastName,
        email,
        customer: customerData,
      } = customer;
      return {
        id,
        firstName,
        lastName,
        email,
        customer: customerData
          ? {
              id: customerData.id,
              phone_number: customerData.phone_number,
              address: customerData.address,
              created_at: customerData.created_at,
              updated_at: customerData.updated_at,
            }
          : null,
      };
    });
  }

  async findOne(profileId: string) {
    const customer = await this.customerRepository.findOne({
      where: { profile: { id: Number(profileId) } },
      relations: [
        'profile',
        // 'customer.bookings',
        // 'customer.services',
        // 'customer.ratings',
      ],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${profileId} not found`);
    }

    return {
      ...customer,
      profile: customer.profile,
    };
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!customer) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    // Update the customer's profile
    Object.assign(customer, updateCustomerDto);
    const updateCustomer = await this.customerRepository.save(customer);
    return updateCustomer;
  }

  async remove(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Remove the vendor's profile and associated vendor data
    await this.customerRepository.remove(customer);
    return { message: `Customer with ID ${id} removed successfully` };
  }
}
