import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { Bus, BusSchema } from '../schemas/bus.schema';
import { Route, RouteSchema } from '../schemas/route.schema';
import { Schedule, ScheduleSchema } from '../schemas/schedule.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Bus.name, schema: BusSchema },
            { name: Route.name, schema: RouteSchema },
            { name: Schedule.name, schema: ScheduleSchema },
        ]),
    ],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeedModule { }
