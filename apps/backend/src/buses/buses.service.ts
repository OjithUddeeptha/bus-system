import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { BusStatus } from '@prisma/client';

@Injectable()
export class BusesService {
    constructor(private prisma: PrismaService) { }

    async create(createBusDto: CreateBusDto, operatorId: string) {
        const existingBus = await this.prisma.bus.findUnique({
            where: { number: createBusDto.number },
        });
        if (existingBus) {
            throw new ConflictException('Bus number already exists');
        }

        return this.prisma.bus.create({
            data: {
                ...createBusDto,
                operatorId,
            },
        });
    }

    async findAll(operatorId?: string) {
        if (operatorId) {
            return this.prisma.bus.findMany({ where: { operatorId } });
        }
        return this.prisma.bus.findMany();
    }

    async findOne(id: string) {
        return this.prisma.bus.findUnique({ where: { id } });
    }
}
