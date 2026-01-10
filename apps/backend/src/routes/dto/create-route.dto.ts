import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRouteDto {
    @IsString()
    @IsNotEmpty()
    @IsString()
    @IsNotEmpty()
    routeNumber: string;

    @IsString()
    @IsNotEmpty()
    routePath: string;

    @IsString()
    @IsNotEmpty()
    startCity: string;

    @IsString()
    @IsNotEmpty()
    endCity: string;

    @IsNumber()
    @IsOptional()
    distance?: number;

    @IsNumber()
    @IsOptional()
    price?: number;
}
