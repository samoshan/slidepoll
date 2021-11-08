import { ArgumentMetadata, createParamDecorator, ExecutionContext, ForbiddenException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { mongoose } from '@typegoose/typegoose';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { LoggedInGuard } from '../guards/logged-in.guard';
import { PollModel, UserModel } from '../models/export.model';

@Injectable()
export class GetPollPipe implements PipeTransform {

    async transform(value: any, metadata: ArgumentMetadata) {
        const poll = await PollModel.findById(value);
        if (!poll) {
            throw new NotFoundException('Poll not found');
        }
        return poll;
    }
    
}

@Injectable()
export class GetUserPipe implements PipeTransform {

    async transform(value: any, metadata: ArgumentMetadata) {
        const user = await UserModel.findById(value);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

}

export const Poll = (paramName: string = null, mustBeOwner: boolean = false): ParameterDecorator => {

    return createParamDecorator(
        async (data: unknown, context: ExecutionContext) => {

            if (mustBeOwner) {
                new LoggedInGuard().canActivate(context);
            }

            let id: string;
            const isHttp = context.getType() === 'http';
            const req = isHttp ? context.switchToHttp().getRequest<Request>() : context.switchToWs().getClient<Socket>().request;

            if (isHttp) {
                id = (req as Request).params[paramName];
                if (!id) {
                    id = (req as Request).body[paramName];
                }
            } else {
                const wsData = context.switchToWs().getData();
                id = paramName ? wsData[paramName] : wsData;
            }

            const poll = await (new GetPollPipe()).transform(id, null);
            const owner = poll.owner as mongoose.Types.ObjectId;

            if (mustBeOwner && !owner.equals(req.session.userId)) {
                throw new ForbiddenException('Not poll owner');
            }
            
            return poll;
        }
    )();
}

export const CurrentUser = createParamDecorator(
    async (data: unknown, context: ExecutionContext) => {

        new LoggedInGuard().canActivate(context);
        const req = context.switchToHttp().getRequest<Request>();

        return await (new GetUserPipe()).transform(req.userId, null);
    }
)

export const CurrentUserId = createParamDecorator(
    async (data: unknown, context: ExecutionContext) => {

        new LoggedInGuard().canActivate(context);
        const req = context.switchToHttp().getRequest<Request>();
        return req.userId;
    }
)
