import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { WsGateway } from './socketio.gateway';

@Module({
    providers: [WsGateway, EventsService],
    exports: [EventsService]
})
export class WebsocketsModule {}
