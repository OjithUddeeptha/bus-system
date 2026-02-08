import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule, ScheduleDocument } from '../schemas/schedule.schema';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class SchedulesService {
    constructor(@InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>) { }

    create(createScheduleDto: CreateScheduleDto) {
        const newSchedule = new this.scheduleModel(createScheduleDto);
        return newSchedule.save();
    }

    findAll(routeId?: string) {
        if (routeId) {
            return this.scheduleModel.find({ routeId })
                .populate('bus')
                .populate('route')
                .exec();
        }
        return this.scheduleModel.find()
            .populate('bus')
            .populate('route')
            .exec();
    }

    findOne(id: string) {
        return this.scheduleModel.findById(id)
            .populate('bus')
            .populate('route')
            .exec();
    }
}
