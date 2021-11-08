import { UnauthorizedException } from '@nestjs/common';

export class NotLoggedInException extends UnauthorizedException {

    constructor() {
        super('Not logged in');
    }
}
