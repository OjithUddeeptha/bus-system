import { IsString, IsInt, IsNotEmpty, Min, IsEnum } from 'class-validator';

// Manually defining Enum to avoid Prisma Client dependency issues during linting if generation lags
export enum BusStatus {
    ACTIVE = 'ACTIVE',
    MAINTENANCE = 'MAINTENANCE',
    RETIRED = 'RETIRED'
}

export class CreateBusDto {
    @IsString()
    @IsNotEmpty()
    number: string;

    @IsInt()
    @Min(1)
    capacity: number;

    @IsEnum(BusStatus)
    status: BusStatus;
}
