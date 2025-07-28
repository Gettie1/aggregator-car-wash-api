import { Controller, Post, Body, Get, Query, Res, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payement.dto';
import { Response } from 'express';
import { Payment } from './entities/payment.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('initialize')
  async initializePayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<ReturnType<typeof this.paymentsService.initializePayment>> {
    return this.paymentsService.initializePayment(createPaymentDto);
    console.log('Payment initialization request received:', createPaymentDto);
  }
  @Get('verify')
  async verifyPayment(
    @Query('reference') reference: string,
    @Res() res: Response,
  ) {
    await this.paymentsService.verifyPayment(reference);
    return res.redirect('http://localhost:3000/dashboard/dashboard/MyBookings');
  }
  @Get(':id')
  async getPaymentById(@Param('id') id: number): Promise<Payment> {
    return this.paymentsService.getPaymentById(id);
  }
  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.paymentsService.getAllPayments();
  }
}
