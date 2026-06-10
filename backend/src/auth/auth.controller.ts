import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateNewUserDto } from './dto/create-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, JwtPayload } from './decorators/current-user.decorator';

const isProd = process.env.NODE_ENV === 'production';

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token', { path: '/auth' });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() newUserDto: CreateNewUserDto) {
    return this.authService.register(newUserDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: { email: string; passwordHash: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      loginDto.email,
      loginDto.passwordHash,
    );

    setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: 'Login successful',
      data: {
        user: user,
      },
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = req.cookies['refresh_token'] as string;
    if (!rawToken) {
      throw new UnauthorizedException('Refresh token tidak ditemukan');
    }

    // set auth token
    const { accessToken, refreshToken } =
      await this.authService.refresh(rawToken);

    setAuthCookies(res, accessToken, refreshToken);

    return {
      success: true,
      message: 'Token has been updated',
    };
  }

  @Post('logout')
  // @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawToken = req.cookies['refresh_token'] as string;
    if (rawToken) {
      await this.authService.logout(rawToken).catch(() => {});
    }

    clearAuthCookies(res);
    return { message: 'Successfully logout' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: JwtPayload) {
    const data = await this.authService.getProfile(user.sub);
    return { user: data };
  }
}
