import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateScheduleDto {
    @IsDateString()
    @IsNotEmpty()
    departureTime: string;

    @IsDateString()
    @IsNotEmpty()
    arrivalTime: string;

    @IsString()
    @IsNotEmpty()
    busId: string;

    @IsString()
    @IsNotEmpty()
    routeId: string;
}
