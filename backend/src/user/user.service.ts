import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(userId: string) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!findUser) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: `User with ID ${userId} not found`,
          data: null,
        });
      }

      const { passwordHash, refreshToken, ...user } = findUser;
      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async findByEmail(emailUser: string) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          email: emailUser,
        },
      });

      // if (!findUser) {
      //   throw new NotFoundException({
      //     code: 'USER_NOT_FOUND',
      //     message: `User with email ${emailUser} not found`,
      //     data: null,
      //   });
      // }

      // const { passwordHash, refreshToken, ...user } = findUser;
      return findUser;
    } catch (error) {
      console.log('error find user by email', error);

      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  async findByEmailWithPassword(emailUser: string) {
    try {
      const findUser = await this.prisma.user.findFirst({
        where: {
          email: emailUser,
        },
      });

      if (!findUser) {
        throw new NotFoundException({
          code: 'USER_NOT_FOUND',
          message: `User with email ${emailUser} not found`,
          data: null,
        });
      }

      return findUser;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong',
        data: null,
      });
    }
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
