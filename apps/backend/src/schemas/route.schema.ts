import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RouteDocument = Route & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Route {
    @Prop({ required: true, unique: true })
    routeNumber: string;

    @Prop({ required: true })
    routePath: string;

    @Prop({ required: true })
    startCity: string;

    @Prop({ required: true })
    endCity: string;

    @Prop()
    distance: number;

    @Prop()
    price: number;

    @Prop([String])
    stops: string[];
}

export const RouteSchema = SchemaFactory.createForClass(Route);

RouteSchema.virtual('schedules', {
    ref: 'Schedule',
    localField: '_id',
    foreignField: 'routeId',
});
