import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { NotLoggedInException } from '../exceptions';

@Injectable()
export class LoggedInGuard implements CanActivate {

    canActivate(context: ExecutionContext) {

        const req = context.getType() === 'http' ? context.switchToHttp().getRequest<Request>() : context.switchToWs().getClient<Socket>().request;
        if (req.session.userId) {
            return true;
        }
        throw new NotLoggedInException();

    }

}
