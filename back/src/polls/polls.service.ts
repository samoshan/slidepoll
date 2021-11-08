import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { isDocument, mongoose } from '@typegoose/typegoose';
import { GenericPoll } from '../models/core.schema';
import { PollDocument, PollModel, UserModel } from '../models/export.model';
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { EventsService } from '../websockets/events.service';
import { ResponsesService } from './responses.service';
import { VariantManager } from './variant.manager';

@Injectable()
export class PollsService {

    constructor (
        private readonly responsesService: ResponsesService,
        private readonly usersService: UsersService,
        private readonly eventsService: EventsService
    ) {}

    async create(ownerId: string, data: any) {
        data.owner = ownerId;
        const variant = VariantManager.get(data.variant);
        delete data.variant;
        
        if (variant === undefined) {
            throw new BadRequestException('Variant does not exist');
        }
        
        return await variant.pollModel.create(data) as PollDocument;
    }

    async getAllForOwner(owner: string, includeResponsesCount: boolean = false) {
        const polls = await PollModel.find({ owner }) as any[];
        if (!includeResponsesCount) return polls;

        const promises = [];
        for (let i = 0; i < polls.length; i++) {
            let poll = polls[i];
            promises.push(this.responsesService.countForPoll(poll).then((count) => {
                poll = poll.toObject();
                poll.responsesCount = count;
                polls[i] = poll;
            }))
        }
        await Promise.all(promises);
        return polls;
    }

    async getActiveForToken(token: string) {
        const user = await UserModel.findOne({ token }).populate('activePoll');
        if (!user) {
            throw new NotFoundException('Token not found');
        }
        const poll = user.activePoll as PollDocument;
        if (!poll) {
            return null;
        }
        return poll;
    }

    toPublic(poll: PollDocument) {
        const variant = VariantManager.get(poll.variant);
        return variant.toPublic(poll);
    }

    async update(poll: PollDocument, data: any) {
        delete data.variant; // don't allow variant to be changed
        
        const updated = Object.assign(poll, data);
        await updated.save();

        this.eventsService.dispatchPollEvent('reloadPoll', poll);
        return updated;
    }

    async delete(poll: PollDocument) {
        await poll.deleteOne();
        await this.responsesService.deleteAllForPoll(poll);
    }

    async toggleLocked(poll: PollDocument, save = true) {
        poll.locked = !poll.locked;
        if (save) {
            await poll.save();
        }
        this.eventsService.dispatchPollEvent('lockedChange', poll, poll.locked);
    }

    async setIsLocked(poll: PollDocument, locked: boolean) {
        poll.locked = locked;
        await poll.save();
        this.eventsService.dispatchPollEvent('lockedChange', poll, poll.locked);
    }

    async setActive(poll: PollDocument) {
        await poll.populate('owner').execPopulate();
        await this.usersService.setActivePoll(poll.owner as User, poll._id);
    }

    isOwner(poll: GenericPoll, user: User | string | mongoose.Types.ObjectId) {
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

    async getOffset(poll: PollDocument, offset: number) {
        const polls = await PollModel.find({ owner: poll.owner });

        const index = polls.findIndex((searchPoll) => poll._id.equals(searchPoll._id));
        let offsetIndex = index + offset;
        if (offsetIndex >= polls.length) offsetIndex = 0;
        if (offsetIndex < 0) offsetIndex = polls.length - 1;

        return polls[offsetIndex];
    }

    async getTokenInfo(poll: PollDocument) {
        const user = await this.usersService.getUser(poll.owner as unknown as any);
        const ownerToken = user.token;
        const isActive = (user.activePoll as mongoose.Types.ObjectId)?.equals(poll._id) || false;
        return { ownerToken, isActive };
    }

}
