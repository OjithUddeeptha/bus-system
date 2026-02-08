import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { Ticket, TicketSchema } from '../schemas/ticket.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Booking.name, schema: BookingSchema },
            { name: Ticket.name, schema: TicketSchema }
        ])
    ],
    controllers: [BookingsController],
    providers: [BookingsService],
})
export class BookingsModule { }
