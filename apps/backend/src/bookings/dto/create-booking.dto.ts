import { IsString, IsNotEmpty, IsInt, IsOptional, IsEnum } from 'class-validator';
import { PaymentMethod } from '../../schemas/booking.schema';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    scheduleId: string;

    @IsInt()
    @IsNotEmpty()
    seatNumber: number;

    @IsEnum(PaymentMethod)
    @IsOptional()
    paymentMethod?: PaymentMethod;
}
