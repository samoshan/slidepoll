import { ModelOptions, mongoose, Prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from '../users/user.schema';


export abstract class IdSchema {
    _id: mongoose.Types.ObjectId;
    id: string;
}


// Generic poll
@ModelOptions({ schemaOptions: { discriminatorKey: 'variant', collection: 'polls', timestamps: true } })
export class GenericPoll implements Base {

    _id: mongoose.Types.ObjectId;
    id: string;

    @Prop({ required: true })
    public title!: string;

    @Prop({ required: true, ref: () => User })
    public owner!: Ref<User>;

    @Prop({ required: true, default: false })
    public locked!: boolean;

    @Prop({ required: true })
    public allowMultipleResponses!: boolean;

    @Prop({ required: true })
    public allowRetractions!: boolean;

    @Prop({ required: true })
    public private!: boolean;

    public variant: string;
    public createdAt?: Date;
    public updatedAt?: Date;

}


// Generic poll response
@ModelOptions({ schemaOptions: { collection: 'responses' } })
export class GenericResponse {

    _id: mongoose.Types.ObjectId;
    id: string;

    @Prop({ default: Date.now })
    public createdAt?: Date;

    @Prop({ required: true, ref: () => GenericPoll })
    public poll!: Ref<GenericPoll>;

    @Prop({ required: true })
    public respondent!: mongoose.Types.Buffer;

}
