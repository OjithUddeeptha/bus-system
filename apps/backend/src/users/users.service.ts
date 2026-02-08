import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, Role } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        return newUser.save();
    }

    async findOne(email: string) {
        return this.userModel.findOne({ email });
    }

    async findById(id: string) {
        return this.userModel.findById(id);
    }

    async update(id: string, data: any) {
        return this.userModel.findByIdAndUpdate(id, data, { new: true });
    }

    async updateProfileImage(id: string, url: string) {
        return this.userModel.findByIdAndUpdate(id, { profileImage: url }, { new: true });
    }

    async approveOperator(id: string) {
        return this.userModel.findByIdAndUpdate(id, { role: Role.OPERATOR }, { new: true });
    }
}
