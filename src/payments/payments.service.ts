import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payement.dto';
import { Booking, BookingStatus } from 'src/bookings/entities/booking.entity';
import { PaymentStatus } from 'src/bookings/dto/create-booking.dto';
import { createResponse } from 'src/utils/apiResponse';
import { Response } from 'express';

interface PaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}
interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string;
    channel: string;
    gateway_response: string;
    metadata: {
      booking_id: string;
      full_name: string;
      phone_number: string;
    };
  };
}

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly configService: ConfigService,
  ) {}

  async initializePayment(createPaymentDto: CreatePaymentDto): Promise<any> {
    const booking = await this.bookingRepository.findOne({
      where: { id: createPaymentDto.booking_id },
      relations: ['customer'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    const paystackSecretKey = this.configService.get<string>(
      'PAYSTACK_SECRET_KEY',
    );
    if (!paystackSecretKey) {
      throw new InternalServerErrorException(
        'Paystack secret key is not configured',
      );
    }
    const reference = `pay_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    // const accessCode = `access_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const payload = JSON.stringify({
      email: createPaymentDto.email,
      amount: createPaymentDto.amount * 100, // Convert to kobo
      currency: 'KES',
      reference: reference,
      callback_url: this.configService.get<string>('PAYSTACK_CALLBACK_URL'),
      metadata: {
        booking_id: createPaymentDto.booking_id,
        first_name: createPaymentDto.first_name,
        last_name: createPaymentDto.last_name,
        phone_number: createPaymentDto.phone_number,
      },
    });
    let response: { data: PaystackInitResponse };
    try {
      response = await axios.post<PaystackInitResponse>(
        'https://api.paystack.co/transaction/initialize',
        payload,
        {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.response?.data?.message || 'Failed to initialize payment',
      );
    }
    const result = response.data;
    const data = result.data;
    if (result.status === true) {
      const payment = this.paymentRepository.create({
        booking: booking,
        paystack_reference: data.reference,
        authorization_url: data.authorization_url,
        paystack_access_code: data.access_code,
        payment_status: PaymentStatus.PENDING as PaymentStatus,
        payment_date: new Date(),
      });
      const savedPayment = await this.paymentRepository.save(payment);
      const paymentData = {
        ...savedPayment,
        email: createPaymentDto.email,
        amount: createPaymentDto.amount,
        currency: 'KES',
      };
      return createResponse(paymentData, 'Payment initialized successfully');
    } else {
      throw new BadRequestException('Failed to initialize payment');
    }
    // return null;
  }
  async verifyPayment(reference: string): Promise<Payment> {
    try {
      const paystackSecretKey = this.configService.get<string>(
        'PAYSTACK_SECRET_KEY',
      );
      if (!paystackSecretKey) {
        throw new InternalServerErrorException(
          'Paystack secret key is not configured',
        );
      }
      const response = await axios.get<PaystackVerifyResponse>(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const result = response.data;
      if (result.status !== true) {
        throw new BadRequestException('Payment verification failed');
      }
      const payment = await this.paymentRepository.findOne({
        where: { paystack_reference: reference },
        relations: ['booking'],
      });
      if (!payment) {
        throw new NotFoundException('Payment not found');
      }
      payment.payment_status = PaymentStatus.PAID as PaymentStatus;
      await this.paymentRepository.save(payment);
      const booking = payment.booking;
      if (booking) {
        booking.status = BookingStatus.CONFIRMED as BookingStatus;
        await this.bookingRepository.save(booking);
      }
      return payment;
    } catch (error: any) {
      throw new InternalServerErrorException(
        error?.response?.data?.message || 'Failed to verify payment',
      );
    }
  }
  async getPaymentById(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { payment_id: id },
      relations: ['booking'],
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }
  async getAllPayments(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['booking'],
    });
  }
}
