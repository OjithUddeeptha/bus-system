import { IsString, IsOptional, IsPhoneNumber, IsObject, IsNumber } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    // Preferences can be any JSON object, for simplicity allowing object or any-like structure validation could be complex
    // For now, let's allow it as a flexible object or pass it as specific fields if needed.
    // Given the schema says 'Json?', we can accept an object.
    @IsOptional()
    preferences?: any;
}
