import MUUID from 'uuid-mongodb';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

export const Respondent = createParamDecorator(
    (data: unknown, context: ExecutionContext): MUUID.MUUID => {
        const req = context.switchToHttp().getRequest<Request>();
        const res = context.switchToHttp().getResponse<Response>();

        const respondentCookie = req.cookies['rid'];
        let uuid: MUUID.MUUID;
        if (respondentCookie) {
            uuid = MUUID.from(respondentCookie);
        } else {
            uuid = MUUID.v4();
            res.cookie('rid', uuid.toString());
        }

        return uuid;
    }
)
