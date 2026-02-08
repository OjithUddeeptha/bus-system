import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { Schedule } from './schedule.schema';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
    ONLINE = 'ONLINE',
    CASH = 'CASH',
}

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Booking {
    @Prop({ required: true })
    seatNumber: number;

    @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
    status: BookingStatus;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.ONLINE })
    paymentMethod: PaymentMethod;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Schedule', required: true })
    scheduleId: Types.ObjectId;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.index({ userId: 1 });
BookingSchema.index({ scheduleId: 1 });
BookingSchema.index({ status: 1 });

BookingSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

BookingSchema.virtual('schedule', {
    ref: 'Schedule',
    localField: 'scheduleId',
    foreignField: '_id',
    justOne: true
});

BookingSchema.virtual('ticket', {
    ref: 'Ticket',
    localField: '_id',
    foreignField: 'bookingId',
    justOne: true
});
