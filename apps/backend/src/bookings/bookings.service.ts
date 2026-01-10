import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(createBookingDto: CreateBookingDto, userId: string) {
        // Check if seat is taken
        const existing = await this.prisma.booking.findFirst({
            where: {
                scheduleId: createBookingDto.scheduleId,
                seatNumber: createBookingDto.seatNumber,
                status: { not: 'CANCELLED' },
            },
        });

        if (existing) {
            throw new BadRequestException('Seat already booked');
        }

        // Create booking + Ticket (simple generation)
        return this.prisma.booking.create({
            data: {
                ...createBookingDto,
                userId,
                status: 'CONFIRMED',
                ticket: {
                    create: {
                        qrCode: `TICKET-${Date.now()}`,
                    }
                }
            },
            include: { ticket: true },
        });
    }

    async findByUser(userId: string) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { schedule: { include: { route: true, bus: true } }, ticket: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findAll() {
        return this.prisma.booking.findMany({
            include: { user: true, schedule: true }
        });
    }
}
