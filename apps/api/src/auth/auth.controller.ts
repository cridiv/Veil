import { Controller, Req, UseGuards, Get, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import * as jwt from 'jsonwebtoken'
import { JwtModule } from '@nestjs/jwt'

@Controller('auth')
export class AuthController{
@Get('google')
@UseGuards(AuthGuard('google'))
  async googleAuth(){}

@Get('google/redirect')
@UseGuards(AuthGuard('google'))
googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.redirect(`http://localhost:3000/client-handler?token=${token}`)
}
};
