import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { MUUID } from 'uuid-mongodb';
import { PollDocument, ResponseDocument, ResponseModel } from '../models/export.model';
import { GetPollPipe } from '../pipes/document.pipe';
import { EventsService } from '../websockets/events.service';
import { VariantManager } from './variant.manager';
import * as csv from 'fast-csv';

@Injectable()
export class ResponsesService {

    private queue = new Map<string, boolean>();

    constructor(private readonly eventsService: EventsService) {}

    async create(poll: PollDocument, respondent: MUUID, data: any) {
        data.respondent = respondent;
        data.poll = poll._id;

        const variant = VariantManager.get(poll.variant);

        if (poll.locked) {
            throw new ForbiddenException('Cannot submit responses while poll is locked');
        }

        const previousResponses = await ResponseModel.find({ poll: poll._id, respondent: respondent as any });
        if (!poll.allowMultipleResponses && previousResponses.length > 0) {
            throw new ForbiddenException('Multiple responses not permitted');
        }

        if (!variant.validateResponse(poll, data, previousResponses)) {
            throw new BadRequestException();
        }

        const response = await variant.responseModel.create(data);
        this.queueResultsDispatch(poll);
        return response;
    }

    async queueResultsDispatch(poll: PollDocument) {
        
        const queueVal = this.queue.get(poll.id);
        if (queueVal !== undefined) {
            if (!queueVal) {
                this.queue.set(poll.id, true);
            }
            return;
        }

        this.queue.set(poll.id, false);
        await this.dispatchResults(poll);

        await new Promise(r => setTimeout(r, 1000));
        const hasPending = this.queue.get(poll.id);
        this.queue.delete(poll.id);
        if (hasPending) {
            await this.dispatchResults(poll);
        }
    }

    async dispatchResults(poll: PollDocument) {
        if (await this.eventsService.resultsRoomHasClients(poll)) {
            const results = await this.getResultsForPoll(poll);
            this.eventsService.dispatchPollResponses(poll, results);
        }
    }

    async delete(response: ResponseDocument) {
        const poll = await (new GetPollPipe()).transform(response.poll, null);
        await response.deleteOne();
        this.queueResultsDispatch(poll);
    }

    async getResultsForPoll(poll: PollDocument) {
        const responses = await this.getAllForPoll(poll);
        const results = VariantManager.getFrom(poll).getResultsOutput(poll, responses);
        return {
            responseCount: responses.length,
            results
        }
    }

    async getAllForPoll(poll: PollDocument) {
        return await ResponseModel.find({ poll: poll._id });
    }

    async getAllForRespondentForPoll(poll: PollDocument, respondent: MUUID) {
        return await ResponseModel.find({
            poll: poll._id,
            respondent: respondent as any
        })
    }

    async countForPoll(poll: PollDocument) {
        return await ResponseModel.countDocuments({ poll: poll._id });
    }

    async deleteAllForPoll(poll: PollDocument) {
        await ResponseModel.deleteMany({ poll: poll._id });
        this.queueResultsDispatch(poll);
        this.eventsService.dispatchPollEvent('responsesCleared', poll);
    }

    async getCsvStream(poll: PollDocument) {
        const results = await this.getResultsForPoll(poll);
        return csv.write(results.results, { headers: true });
    }

}
