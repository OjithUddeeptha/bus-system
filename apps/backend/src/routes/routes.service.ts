import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RoutesService {
    constructor(private prisma: PrismaService) { }

    create(createRouteDto: CreateRouteDto) {
        return this.prisma.route.create({ data: createRouteDto });
    }

    findAll(startCity?: string, endCity?: string) {
        if (startCity && endCity) {
            return this.prisma.route.findMany({
                where: {
                    OR: [
                        {
                            startCity: { contains: startCity, mode: 'insensitive' },
                            endCity: { contains: endCity, mode: 'insensitive' },
                        },
                        {
                            startCity: { contains: endCity, mode: 'insensitive' },
                            endCity: { contains: startCity, mode: 'insensitive' },
                        }
                    ]
                },
            });
        }
        return this.prisma.route.findMany();
    }

    findOne(id: string) {
        return this.prisma.route.findUnique({ where: { id } });
    }
}
