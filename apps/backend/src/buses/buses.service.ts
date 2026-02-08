import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bus, BusDocument } from '../schemas/bus.schema';
import { CreateBusDto } from './dto/create-bus.dto';

@Injectable()
export class BusesService {
    constructor(@InjectModel(Bus.name) private busModel: Model<BusDocument>) { }

    async create(createBusDto: CreateBusDto, operatorId: string) {
        const existingBus = await this.busModel.findOne({ number: createBusDto.number });
        if (existingBus) {
            throw new ConflictException('Bus number already exists');
        }

        const newBus = new this.busModel({
            ...createBusDto,
            operatorId,
        });

        return newBus.save();
    }

    async findAll(operatorId?: string) {
        if (operatorId) {
            return this.busModel.find({ operatorId });
        }
        return this.busModel.find();
    }

    async findOne(id: string) {
        return this.busModel.findById(id);
    }
}
