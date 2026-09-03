import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { MessageStatus } from '@prisma/client';

export class CreateContactMessageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}

export class UpdateContactMessageStatusDto {
  @IsEnum(MessageStatus)
  @IsNotEmpty()
  status: MessageStatus;
}

export class ReplyContactMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
