import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payement.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
