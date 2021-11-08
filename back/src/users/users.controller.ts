import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { UserDocument } from '../models/export.model';
import { CurrentUser, CurrentUserId } from '../pipes/document.pipe';
import { PollsService } from '../polls/polls.service';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {

    constructor (
        private readonly usersService: UsersService,
        private readonly pollsService: PollsService
    ) {}

    @Get('profile')
    async getUserProfile(@CurrentUser() user: UserDocument) {
        return {
            email: user.email,
            firstName: user.firstName,
            token: user.token
        }
    }

    @Get('polls')
    async getUserPolls(@CurrentUser() user: UserDocument, @Query('includeResponsesCount') includeResponsesCount: boolean) {
        return {
            polls: await this.pollsService.getAllForOwner(user.id, includeResponsesCount),
            active: user.activePoll
        }
    }

    @Post('clearactive')
    @HttpCode(HttpStatus.NO_CONTENT)
    async clearActivePoll(@CurrentUser() user: UserDocument) {
        await this.usersService.setActivePoll(user, null);
    }

    @Put('token')
    @HttpCode(HttpStatus.OK)
    async setToken(@CurrentUser() user: UserDocument, @Body('token') token: string) {
        await this.usersService.setToken(user, token);
    }

}
