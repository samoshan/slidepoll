import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthService {

    login(req: Request, userId: string, persistent: boolean = false) {
        if (persistent) {
            req.session.cookie.maxAge = 2592000 * 1000;
        }
        req.session.userId = userId;
        req.userId = userId;
    }

    async logout(req: Request) {

        const destroy = function() {
            return new Promise<void>(resolve => {
                req.session.destroy((err) => {
                    if (err) throw err;
                    resolve();
                })
            })
        }

        await destroy();
        delete req.user;
        delete req.userId;
    }

}
