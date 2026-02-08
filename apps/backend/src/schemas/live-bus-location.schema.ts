import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Bus } from './bus.schema';

export type LiveBusLocationDocument = LiveBusLocation & Document;

@Schema({ timestamps: true })
export class LiveBusLocation {
    @Prop({ type: Types.ObjectId, ref: 'Bus', required: true })
    busId: Types.ObjectId;

    @Prop({ required: true })
    lat: number;

    @Prop({ required: true })
    lng: number;

    @Prop()
    speed: number;

    @Prop()
    heading: number;
}

export const LiveBusLocationSchema = SchemaFactory.createForClass(LiveBusLocation);
