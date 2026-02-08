import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Bus } from './bus.schema';
import { Route } from './route.schema';

export type ScheduleDocument = Schedule & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Schedule {
    @Prop({ required: true })
    departureTime: Date;

    @Prop({ required: true })
    arrivalTime: Date;

    @Prop({ type: Types.ObjectId, ref: 'Bus', required: true })
    busId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Route', required: true })
    routeId: Types.ObjectId;
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);

ScheduleSchema.index({ busId: 1, routeId: 1 });
ScheduleSchema.index({ departureTime: 1 });

ScheduleSchema.virtual('bus', {
    ref: 'Bus',
    localField: 'busId',
    foreignField: '_id',
    justOne: true
});

ScheduleSchema.virtual('route', {
    ref: 'Route',
    localField: 'routeId',
    foreignField: '_id',
    justOne: true
});
