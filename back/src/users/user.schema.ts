import passportLocalMongoose from 'passport-local-mongoose';
import { mongoose, plugin, Prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { GenericPoll } from '../models/core.schema';
import { PassportLocalOptions } from 'mongoose';

const INVALID_LOGIN = 'Incorrect username or password';

@plugin(passportLocalMongoose, { usernameField: 'email', errorMessages: {
    IncorrectPasswordError: INVALID_LOGIN,
    IncorrectUsernameError: INVALID_LOGIN,
    UserExistsError: 'An account with that email already exists'
}} as PassportLocalOptions )
export class User implements Base {

    _id: mongoose.Types.ObjectId;
    id: string;

    @Prop({ required: true, unique: true })
    public email!: string;

    @Prop({ required: true })
    public firstName!: string;

    @Prop({ ref: () => GenericPoll })
    public activePoll?: Ref<GenericPoll>;

    @Prop({ required: true, unique: true, lowercase: true })
    public token?: string;

}
