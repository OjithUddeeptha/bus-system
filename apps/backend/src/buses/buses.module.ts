import { Module } from '@nestjs/common';
import { BusesService } from './buses.service';
import { BusesController } from './buses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bus, BusSchema } from '../schemas/bus.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Bus.name, schema: BusSchema }])
    ],
    controllers: [BusesController],
    providers: [BusesService],
})
export class BusesModule { }
