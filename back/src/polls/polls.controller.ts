import { Body, Controller, DefaultValuePipe, Delete, ForbiddenException, Get, Header, Headers, HttpCode, HttpStatus, Param, ParseBoolPipe, Patch, Post, Query, Req, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { MUUID } from 'uuid-mongodb';
import { Respondent } from '../decorators/respondent.decorator';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { PollDocument, ResponseDocument } from '../models/export.model';
import { Poll } from '../pipes/document.pipe';
import { PollsService } from './polls.service';
import { ResponsesService } from './responses.service';

@Controller('poll')
export class PollsController {

    constructor(
        private readonly pollsService: PollsService,
        private readonly responsesService: ResponsesService
    ) {}

    @Post('')
    @UseGuards(LoggedInGuard)
    async create(@Body() data: any, @Req() req: Request) {
        return await this.pollsService.create(req.userId, data);
    }

    @Get('active/:token')
    async getPollForToken(
        @Param('token') token: string,
        @Query('includeMyResponses', new DefaultValuePipe(false), ParseBoolPipe) includeMyResponses: boolean,
        @Respondent() respondent: MUUID,
        @Req() req: Request,
        @Res() res: Response
        ) {
        const poll = await this.pollsService.getActiveForToken(token);
        if (!poll) {
            return res.status(204).send();
        }
        return res.send(await this.find(poll, includeMyResponses, false, respondent, req));
    }

    @Get(':id')
    async find(
        @Poll('id') poll: PollDocument,
        @Query('includeMyResponses', new DefaultValuePipe(false), ParseBoolPipe) includeMyResponses: boolean,
        @Query('includeTokenInfo', new DefaultValuePipe(false), ParseBoolPipe) includeTokenInfo: boolean,
        @Respondent() respondent: MUUID,
        @Req() req: Request
        ) {
        const publicPoll = this.pollsService.toPublic(poll);
        let myResponses: ResponseDocument[];
        if (includeMyResponses) {
            myResponses = await this.responsesService.getAllForRespondentForPoll(poll, respondent);
        }
        const tokenInfo = includeTokenInfo ? await this.pollsService.getTokenInfo(poll) : undefined;
        return {
            poll: publicPoll,
            myResponses,
            isOwner: this.pollsService.isOwner(poll, req.userId),
            ...tokenInfo
        }
    }

    @Patch(':id')
    async update(@Poll('id', true) poll: PollDocument, @Body() data: any) {
        return await this.pollsService.update(poll, data);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Poll('id', true) poll: PollDocument) {
        await this.pollsService.delete(poll);
    }

    @Post(':id/togglelocked')
    @HttpCode(HttpStatus.OK)
    async toggleLocked(@Poll('id', true) poll: PollDocument) {
        await this.pollsService.toggleLocked(poll);
        return { locked: poll.locked };
    }

    @Post(':id/lock')
    @HttpCode(HttpStatus.OK)
    async setLocked(@Poll('id', true) poll: PollDocument) {
        await this.pollsService.setIsLocked(poll, true);
        return { locked: true };
    }

    @Post(':id/unlock')
    @HttpCode(HttpStatus.OK)
    async setUnlocked(@Poll('id', true) poll: PollDocument) {
        await this.pollsService.setIsLocked(poll, false);
        return { locked: false };
    }

    @Post(':id/setactive')
    @HttpCode(HttpStatus.NO_CONTENT)
    async setActive(@Poll('id', true) poll: PollDocument) {
        await this.pollsService.setActive(poll);
    }

    @Delete(':id/responses')
    @HttpCode(HttpStatus.NO_CONTENT)
    async clearResponses(@Poll('id', true) poll: PollDocument) {
        await this.responsesService.deleteAllForPoll(poll);
    }

    @Get(':id/results')
    async getResults(@Poll('id') poll: PollDocument, @Req() req: Request) {
        if (poll.private && !this.pollsService.isOwner(poll, req.userId)) {
            throw new ForbiddenException('The results of this poll are private');
        }
        return this.responsesService.getResultsForPoll(poll);
    }

    @Get(':id/results.csv')
    @Header('content-type', 'text/csv')
    async getResultsCsv(@Poll('id') poll: PollDocument, @Req() req: Request, @Res() res: Response) {
        if (poll.private && !this.pollsService.isOwner(poll, req.userId)) {
            throw new ForbiddenException('The results of this poll are private');
        }
        const stream = await this.responsesService.getCsvStream(poll);
        stream.pipe(res);
    }

    @Get(':id/next')
    async getNext(@Poll('id') poll: PollDocument, @Req() req: Request) {
        const nextPoll = await this.pollsService.getOffset(poll, 1);
        const publicPoll = this.pollsService.toPublic(nextPoll);
        const tokenInfo = await this.pollsService.getTokenInfo(nextPoll);
        return {
            poll: publicPoll,
            isOwner: this.pollsService.isOwner(publicPoll, req.userId),
            ...tokenInfo
        }
    }

    @Get(':id/prev')
    async getPrevious(@Poll('id') poll: PollDocument, @Req() req: Request) {
        const prevPoll = await this.pollsService.getOffset(poll, -1);
        const publicPoll = this.pollsService.toPublic(prevPoll);
        const tokenInfo = await this.pollsService.getTokenInfo(prevPoll);
        return {
            poll: publicPoll,
            isOwner: this.pollsService.isOwner(publicPoll, req.userId),
            ...tokenInfo
        }
    }

}
