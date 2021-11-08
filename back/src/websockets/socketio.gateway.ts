import { ForbiddenException, NotFoundException, UseFilters } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { isDocument, mongoose } from '@typegoose/typegoose';
import { Server, Socket } from 'socket.io';
import { WsExceptionFilter } from '../filters/ws.filter';
import { PollDocument, UserModel } from '../models/export.model';
import { Poll } from '../pipes/document.pipe';
import { User } from '../users/user.schema';

@WebSocketGateway({
    transports: ['websocket']
})
@UseFilters(new WsExceptionFilter())
export class WsGateway {

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('joinResultsRoom')
    handleJoinResultsRoom(@Poll() poll: PollDocument, @ConnectedSocket() client: Socket) {
        if (!poll.private || this.isOwner(poll, client.request.session.userId)) {
            this.joinRoom(client, this.getResultsRoom(poll));
        } else {
            throw new ForbiddenException('The results of this poll are private');
        }
    }

    @SubscribeMessage('joinEventsRoom')
    handleJoinEventsRoom(@Poll() poll: PollDocument, @ConnectedSocket() client: Socket) {
        this.joinRoom(client, this.getEventsRoom(poll));
    }

    @SubscribeMessage('joinTokenRoom')
    async handleJoinTokenRoom(@MessageBody() token: string, @ConnectedSocket() client: Socket) {
        const count = await UserModel.countDocuments({ token });
        if (count) {
            this.joinRoom(client, this.getTokenRoom(token.toLowerCase()));
        } else {
            throw new NotFoundException('Token not found');
        }
    }

    @SubscribeMessage('leaveRoom')
    async handleLeaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
        this.leaveRoom(client, room);
    }

    getRoomType(room: string) {
        return room.split(':')[0];
    }

    getResultsRoom(poll: PollDocument) {
        return `results:${poll.id}`;
    }

    getEventsRoom(poll: PollDocument) {
        return `events:${poll.id}`;
    }

    getTokenRoom(token: string) {
        return `token:${token.toLowerCase()}`;
    }

    private async joinRoom(client: Socket, newRoom: string) {
        const roomType = this.getRoomType(newRoom);
        for (const currentRoom of client.rooms) {
            if (this.getRoomType(currentRoom) === roomType) {
                await this.leaveRoom(client, currentRoom);
            }
        }
        client.join(newRoom);
        client.emit('joined', newRoom);
    }

    private async leaveRoom(client: Socket, room: string) {
        await client.leave(room);
        client.emit('left', room);
    }

    async isOwner(poll: PollDocument, user: User | string | mongoose.Types.ObjectId) {
        if (!user) return false;
        let userId: string;
        if (user instanceof User) {
            userId = user.id;
        }
        else {
            userId = user.toString();
        }
        let ownerId: mongoose.Types.ObjectId;
        if (isDocument(poll.owner)) {
            ownerId = poll.owner._id;
        } else {
            ownerId = poll.owner as mongoose.Types.ObjectId;
        }
        return ownerId.equals(userId);
    }

}
