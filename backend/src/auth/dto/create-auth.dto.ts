import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export enum RoleUser {
  Customer = 'Customer',
  Admin = 'Admin',
}

export class CreateNewUserDto {
  @IsString()
  @MinLength(2, { message: 'Name at least have 2 characters' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must have 6 characters' })
  passwordHash: string;

  @IsString()
  @MinLength(6, { message: 'Confirm password must have 6 characters' })
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
  //   message: 'Password too weak',
  // })
  confirmPassword: string;

  @IsEnum(RoleUser)
  role: RoleUser;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must have 6 characters' })
  passwordHash: string;
}

export class CreateAuthDto {}
