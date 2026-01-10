import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(private prisma: PrismaService) { }

    create(createScheduleDto: CreateScheduleDto) {
        return this.prisma.schedule.create({ data: createScheduleDto });
    }

    findAll(routeId?: string) {
        if (routeId) {
            return this.prisma.schedule.findMany({
                where: { routeId },
                include: { bus: true, route: true },
            });
        }
        return this.prisma.schedule.findMany({
            include: { bus: true, route: true },
        });
    }

    findOne(id: string) {
        return this.prisma.schedule.findUnique({
            where: { id },
            include: { bus: true, route: true },
        });
    }
}
