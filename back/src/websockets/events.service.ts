import { Injectable } from '@nestjs/common';
import { PollDocument } from '../models/export.model';
import { WsGateway } from './socketio.gateway';

@Injectable()
export class EventsService {

    constructor(private readonly wsGateway: WsGateway) {}

    dispatchPollChangeEvent(token: string, newPollId: string | null) {
        if (token) {
            this.wsGateway.server.to(this.wsGateway.getTokenRoom(token)).emit('pollChanged', newPollId);
        }
    }

    dispatchPollEvent(name: string, poll: PollDocument, data: any = undefined) {
        this.wsGateway.server.to(this.wsGateway.getEventsRoom(poll)).emit(name, data);
    }

    dispatchPollResponses(poll: PollDocument, data: any) {
        this.wsGateway.server.to(this.wsGateway.getResultsRoom(poll)).emit('results', data);
    }

    async resultsRoomHasClients(poll: PollDocument) {
        const roomClients = (await this.wsGateway.server.in(this.wsGateway.getResultsRoom(poll)).allSockets()).size;
        return roomClients;
    }

}
