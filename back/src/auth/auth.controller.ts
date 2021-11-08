import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { PassportExceptionFilter } from '../filters/passport.filter';
import { UserDocument, UserModel } from '../models/export.model';
import { AuthService } from './auth.service';
import { LoggedInGuard } from '../guards/logged-in.guard';

@Controller('auth')
@UseFilters(PassportExceptionFilter)
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @UseGuards(AuthGuard('local'))
    @HttpCode(200)
    async login(@Req() req: Request, @Body('remember') persistent: boolean) {
        this.authService.login(req, req.user.id, persistent);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Req() req: Request) {
        await this.authService.logout(req);
    }

    @Post('register')
    async register(@Req() req: Request, @Body() body: any) {
        const userData = new UserModel({
            email: body.email,
            firstName: body.first_name,
            token: body.token
        })

        const user = await UserModel.register(userData, body.password) as unknown as UserDocument;
        this.authService.login(req, user.id);
        return { _id: user._id };
    }

}
