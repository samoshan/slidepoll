import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserModel } from '../models/export.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor() {
        super({ usernameField: 'email' });
    }

    async validate(email: string, password: string) {
        const auth = UserModel.authenticate();
        const result = await auth(email, password);
        if (!result.user) {
            throw result.error;
        }
        return result.user;
    }

}
