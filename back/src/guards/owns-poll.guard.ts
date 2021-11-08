import { CanActivate, ExecutionContext, mixin } from '@nestjs/common';
import { mongoose } from '@typegoose/typegoose';
import { Request } from 'express';
import { GetPollPipe } from '../pipes/document.pipe';
import { LoggedInGuard } from './logged-in.guard';

export const OwnsPollGuard = (pollId: string): any => {

    class OwnsPollGuardMixin implements CanActivate {

        async canActivate(context: ExecutionContext) {
            
            new LoggedInGuard().canActivate(context);
            const req = context.switchToHttp().getRequest<Request>();
            
            const poll = await (new GetPollPipe()).transform(pollId, null);
            const owner = poll.owner as mongoose.Types.ObjectId;
            return owner.equals(req.userId);
        }
        
    }

    const guard = mixin(OwnsPollGuardMixin);
    return guard;
}
