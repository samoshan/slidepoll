import MUUID from 'uuid-mongodb';
import { Body, Controller, Delete, ForbiddenException, HttpCode, HttpStatus, NotFoundException, Param, Post, Req } from '@nestjs/common';
import { Respondent } from '../decorators/respondent.decorator';
import { Poll } from '../pipes/document.pipe';
import { ResponsesService } from './responses.service';
import { PollDocument, ResponseModel } from '../models/export.model';
import { PollsService } from './polls.service';
import { Request } from 'express';

@Controller('response')
export class ResponsesController {

    constructor(
        private readonly responsesService: ResponsesService,
        private readonly pollsService: PollsService
    ) {}

    @Post('')
    async castResponse(
        @Poll('poll') poll: PollDocument,
        @Respondent() respondent: MUUID.MUUID,
        @Body() data: any
    ) {
        delete data['poll'];
        const response = (await this.responsesService.create(poll, respondent, data)).toObject();
        delete response.respondent;
        return response;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async retractResponse(@Param('id') id: string, @Respondent() respondent: MUUID.MUUID, @Req() req: Request) {
        const response = await ResponseModel.findById(id).populate('poll');
        if (response) {
            const poll = response.poll as PollDocument;

            // owner can always delete
            if (this.pollsService.isOwner(poll, req.userId)) {
                await this.responsesService.delete(response);
                return;
            }

            if (poll.allowRetractions) {
                if (!poll.locked) {
                    const originalRespondent = MUUID.from(response.respondent.toObject());
                    if (originalRespondent.buffer.equals(respondent.buffer)) {
                        await this.responsesService.delete(response);
                    } else {
                        throw new ForbiddenException();
                    }
                } else {
                    throw new ForbiddenException('Responses cannot be retracted whilst poll is locked');
                }
            } else {
                throw new ForbiddenException('This poll does not allow retraction of responses');
            }
        } else {
            throw new NotFoundException();
        }
    }
    
}
