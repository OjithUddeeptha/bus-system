import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument, BookingStatus, PaymentStatus, PaymentMethod } from '../schemas/booking.schema';
import { Ticket, TicketDocument } from '../schemas/ticket.schema';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>
    ) { }

    async create(createBookingDto: CreateBookingDto, userId: string) {
        const method = createBookingDto.paymentMethod || PaymentMethod.ONLINE;
        const isCash = method === PaymentMethod.CASH;

        // Check if seat is taken
        const existing = await this.bookingModel.findOne({
            scheduleId: createBookingDto.scheduleId,
            seatNumber: createBookingDto.seatNumber,
            status: { $ne: BookingStatus.CANCELLED },
        });

        if (existing) {
            throw new BadRequestException('Seat already booked');
        }

        const bookingStatus = isCash ? BookingStatus.PENDING : BookingStatus.CONFIRMED;
        const paymentStatus = isCash ? PaymentStatus.PENDING : PaymentStatus.PAID;

        // Create booking
        const booking = new this.bookingModel({
            scheduleId: createBookingDto.scheduleId,
            seatNumber: createBookingDto.seatNumber,
            paymentMethod: method,
            userId,
            status: bookingStatus,
            paymentStatus: paymentStatus,
        });
        await booking.save();

        // Create Ticket
        const ticket = new this.ticketModel({
            qrCode: `TICKET-${Date.now()}-${userId.substring(0, 4)}`,
            bookingId: booking._id,
        });
        await ticket.save();

        return this.bookingModel.findById(booking._id).populate('ticket');
    }

    async findByUser(userId: string) {
        return this.bookingModel.find({ userId })
            .populate({
                path: 'schedule',
                populate: [
                    { path: 'route' },
                    { path: 'bus' } // Virtual 'bus' on Schedule
                ]
            })
            .populate('ticket')
            .sort({ createdAt: -1 })
            .exec();
    }

    async findAll() {
        return this.bookingModel.find()
            .populate('user')
            .populate('schedule')
            .exec();
    }

    async findOne(id: string) {
        return this.bookingModel.findById(id)
            .populate({
                path: 'schedule',
                populate: [
                    { path: 'route' },
                    { path: 'bus' }
                ]
            })
            .populate('ticket')
            .exec();
    }
}
