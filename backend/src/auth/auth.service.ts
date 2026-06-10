import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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

  private generateRefreshToken() {
    const raw = crypto.randomBytes(64).toString('hex');
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    return { raw, hash };
  }

  private hashToken(raw: string) {
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  private refreshTokenExpiresAt() {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  private signAccessToken(payload: {
    sub: string;
    email: string;
    name: string;
    role: 'Customer' | 'Admin';
  }) {
    const expiresIn = (process.env.ACCESS_TOKEN_EXPIRES_IN ??
      '15m') as jwt.SignOptions['expiresIn'];

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn,
    });
  }

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
      const accessToken = this.signAccessToken({
        sub: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
      });

      const { raw, hash } = this.generateRefreshToken();

      // create refresh token
      await this.prisma.refreshToken.create({
        data: {
          tokenHash: hash,
          userId: existingUser.id,
          expiresAt: this.refreshTokenExpiresAt(),
        },
      });

      // return
      return {
        accessToken,
        refreshToken: raw,
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

  async refresh(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException("Refresh token isn't valid");
    }

    const { raw: newRaw, hash: newHash } = this.generateRefreshToken();

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: stored.id },
        data: { revokedAt: new Date() },
      }),
      this.prisma.refreshToken.create({
        data: {
          tokenHash: newHash,
          userId: stored.userId,
          expiresAt: this.refreshTokenExpiresAt(),
        },
      }),
    ]);

    const accessToken = this.signAccessToken({
      sub: stored.user.id,
      email: stored.user.email,
      name: stored.user.name,
      role: stored.user.role,
    });

    return { accessToken, refreshToken: newRaw };
  }

  async updateRefreshToken() {}

  async logout(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }
}
