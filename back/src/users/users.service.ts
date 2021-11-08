import { Injectable } from '@nestjs/common';
import { isDocument, mongoose } from '@typegoose/typegoose';
import { User } from '../users/user.schema';
import { UserDocument, UserModel } from '../models/export.model';
import { EventsService } from '../websockets/events.service';

@Injectable()
export class UsersService {

    constructor(private readonly eventsService: EventsService) {}

    async setActivePoll(user: User, pollId: mongoose.Types.ObjectId | string) {

        const activePollId = (isDocument(user.activePoll)) ? user.activePoll._id : user.activePoll as mongoose.Types.ObjectId;
        
        if (!activePollId || !activePollId.equals(pollId)) {
            
            await UserModel.findByIdAndUpdate(user._id, { activePoll: pollId });
            this.eventsService.dispatchPollChangeEvent(user.token, pollId as string);
        }
    }

    async setToken(user: UserDocument, token: string) {
        user.token = token;
        await user.save();
    }

    async getUser(userId: string | mongoose.Types.ObjectId) {
        return await UserModel.findById(userId);
    }

}
