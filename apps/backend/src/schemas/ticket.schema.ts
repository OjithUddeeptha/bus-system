import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Booking } from './booking.schema';

export type TicketDocument = Ticket & Document;

@Schema({ timestamps: true })
export class Ticket {
    @Prop()
    qrCode: string;

    @Prop({ type: Types.ObjectId, ref: 'Booking', required: true, unique: true })
    bookingId: Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
