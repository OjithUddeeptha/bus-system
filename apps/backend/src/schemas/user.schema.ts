import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
    PASSENGER = 'PASSENGER',
    OPERATOR = 'OPERATOR',
    ADMIN = 'ADMIN',
}

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: String, enum: Role, default: Role.PASSENGER })
    role: Role;

    @Prop()
    phoneNumber: string;

    @Prop({ default: 0.0 })
    walletBalance: number;

    @Prop({ default: 0 })
    loyaltyPoints: number;

    @Prop()
    profileImage: string;

    @Prop({ type: Object })
    preferences: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
