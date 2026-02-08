import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../schemas/user.schema';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Body() createBookingDto: CreateBookingDto, @Request() req: any) {
        return this.bookingsService.create(createBookingDto, req.user.userId);
    }

    @Get('my-bookings')
    findMyBookings(@Request() req: any) {
        return this.bookingsService.findByUser(req.user.userId);
    }

    @Get()
    @Roles(Role.ADMIN as any, Role.OPERATOR as any)
    @UseGuards(RolesGuard)
    findAll() {
        return this.bookingsService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }
}
