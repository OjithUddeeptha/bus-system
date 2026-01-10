import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { BusesService } from './buses.service';
import { CreateBusDto } from './dto/create-bus.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('buses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusesController {
    constructor(private readonly busesService: BusesService) { }

    @Post()
    @Roles(Role.OPERATOR as any)
    create(@Body() createBusDto: CreateBusDto, @Request() req: any) {
        return this.busesService.create(createBusDto, req.user.userId);
    }

    @Get()
    @Roles(Role.OPERATOR as any, Role.ADMIN as any)
    findAll(@Request() req: any) {
        if (req.user.role === Role.OPERATOR) {
            return this.busesService.findAll(req.user.userId);
        }
        return this.busesService.findAll();
    }
}
