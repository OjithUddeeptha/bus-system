import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const userObj = user.toObject();
            const { password, ...result } = userObj;
            return result;
        }
        return null;
    }

    async login(user: any) {
        // user object is already a plain object (from validateUser or otherwise)
        // With virtuals enabled, user.id should be the string version of _id
        const payload = { email: user.email, sub: user.id || user._id.toString(), role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id || user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
            }
        };
    }

    async register(createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
}
