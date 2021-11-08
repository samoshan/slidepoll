import { mongoose } from '@typegoose/typegoose';
import { UserDocument } from '../users/user.schema';
import { Session } from 'express-session';

declare module 'express-session' {
    interface Session {
        userId?: string;
    }
}

declare module 'http' {
    interface IncomingMessage {
        session: Session;
    }
}

declare module 'express' {
    interface Request {
        userId?: string;
        user?: UserDocument;
    }
}
