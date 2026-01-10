import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @IsNotEmpty()
    scheduleId: string;

    @IsInt()
    @IsNotEmpty()
    seatNumber: number;
}
