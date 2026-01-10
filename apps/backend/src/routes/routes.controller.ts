import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.OPERATOR as any, Role.ADMIN as any)
    create(@Body() createRouteDto: CreateRouteDto) {
        return this.routesService.create(createRouteDto);
    }

    @Get('search')
    search(@Query('start') start: string, @Query('end') end: string) {
        return this.routesService.findAll(start, end);
    }

    @Get()
    findAll() {
        return this.routesService.findAll();
    }
}
