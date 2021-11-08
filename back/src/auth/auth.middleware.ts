import { Request, Response, NextFunction } from 'express';

export function addUserIdToRequests(req: Request, res: Response, next: NextFunction) {
    if (req.session.userId !== undefined) {
        req.userId = req.session.userId;
    }
    next();
}
