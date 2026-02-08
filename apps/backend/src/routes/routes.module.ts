import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from '../schemas/route.schema';
import { Schedule, ScheduleSchema } from '../schemas/schedule.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Route.name, schema: RouteSchema },
            { name: Schedule.name, schema: ScheduleSchema }
        ])
    ],
    controllers: [RoutesController],
    providers: [RoutesService],
    exports: [RoutesService],
})
export class RoutesModule { }
