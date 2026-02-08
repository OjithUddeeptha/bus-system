import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export type BusDocument = Bus & Document;

export enum BusStatus {
    ACTIVE = 'ACTIVE',
    MAINTENANCE = 'MAINTENANCE',
    RETIRED = 'RETIRED',
}

@Schema({ timestamps: true })
export class Bus {
    @Prop({ required: true, unique: true })
    number: string;

    @Prop({ required: true })
    capacity: number;

    @Prop({ type: String, enum: BusStatus, default: BusStatus.ACTIVE })
    status: BusStatus;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    operatorId: Types.ObjectId;
}

export const BusSchema = SchemaFactory.createForClass(Bus);
