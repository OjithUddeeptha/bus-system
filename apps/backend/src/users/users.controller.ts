import { Body, Controller, Get, Patch, UseGuards, Request, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

// Manually defining Role to ensure safety
export enum Role {
    PASSENGER = 'PASSENGER',
    OPERATOR = 'OPERATOR',
    ADMIN = 'ADMIN'
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        const user = await this.usersService.findById(req.user.userId);
        // Exclude password
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
        // If phone number is empty string, set it to undefined or null to avoid validation issues if any strictness returns
        if (updateProfileDto.phoneNumber === '') {
            updateProfileDto.phoneNumber = undefined;
        }
        const user = await this.usersService.update(req.user.userId, updateProfileDto);
        const { password, ...result } = user;
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Post('profile/upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = join(process.cwd(), 'uploads', 'profiles');
                if (!existsSync(uploadPath)) {
                    mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }))
    async uploadProfileImage(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const url = `http://localhost:3002/uploads/profiles/${file.filename}`;
        await this.usersService.updateProfileImage(req.user.userId, url);
        return { url };
    }

    @Patch(':id/approve')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN as any)
    approveOperator(@Param('id') id: string) {
        return this.usersService.approveOperator(id);
    }
}
