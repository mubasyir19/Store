import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateNewUserDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateNewUserDto) {
    try {
      const existingUser = await this.userService.findByEmail(dto.email);

      // if exists, throw error conflict
      if (existingUser !== null) {
        throw new ConflictException({
          message: 'User already exists',
        });
      }

      if (dto.passwordHash !== dto.confirmPassword) {
        throw new BadRequestException({
          message: "confirm password doesn't match with password",
        });
      }

      // hashing password
      const hashedPass = await bcrypt.hash(dto.passwordHash, 10);

      // create new user
      const newPayload = {
        name: dto.name,
        email: dto.email,
        passwordHash: hashedPass,
        role: dto.role,
        avatarUrl: dto.avatarUrl,
      };
      const newUser = await this.prisma.user.create({
        data: newPayload,
      });

      const { passwordHash, ...user } = newUser;
      void passwordHash;

      return {
        message: 'Create new user successfully',
        data: user,
      };
    } catch (error) {
      console.log('error register - ', error);
      throw error;
    }
  }

  async login(email: string, passwordHash: string) {
    try {
      const existingUser = await this.userService.findByEmail(email);

      if (existingUser === null) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          data: null,
        });
      }

      // check password valid or not? compare with bcrypt
      const checkPassword = await bcrypt.compare(
        passwordHash,
        existingUser.passwordHash,
      );
      console.log('check password = ', checkPassword);

      if (!checkPassword) {
        throw new BadRequestException({
          code: 'BAD_REQUEST',
          message: 'Invalid password',
          data: null,
        });
      }

      // create token
      const { accessToken, refreshToken } = await this.generateTokens(
        existingUser.id,
        existingUser.name,
        existingUser.email,
        existingUser.role,
      );

      // update refresh token
      await this.prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          refreshToken: refreshToken,
        },
      });

      // return
      return {
        accessToken,
        refreshToken,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      console.log('error login', error);

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async generateTokens(
    userId: string,
    name: string,
    email: string,
    role: 'Customer' | 'Admin',
  ) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          id: userId,
          name,
          email,
          role,
          type: 'access',
        },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          id: userId,
          name,
          email,
          role,
          type: 'refresh',
        },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async refreshToken(token: string | undefined) {
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as unknown as {
        sub: string;
        id: string;
        type?: string;
      };
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Verify stored refresh token hash (token rotation) [citation:3]
      const isValid = await bcrypt.compare(token, user.refreshToken as string);
      if (!isValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { accessToken, refreshToken } = await this.generateTokens(
        user.id,
        user.name,
        user.email,
        user.role,
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async updateRefreshToken() {}

  async logout() {}
}
