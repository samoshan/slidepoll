import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
    (data: unknown, context: ExecutionContext): string => {
        const req = context.switchToHttp().getRequest<Request>();
        return req.userId;
    }
)
