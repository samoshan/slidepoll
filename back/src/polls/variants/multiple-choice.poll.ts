import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { mongoose, Prop, Ref } from '@typegoose/typegoose';
import { GenericPoll, GenericResponse, IdSchema } from '../../models/core.schema';
import { Doc } from '../../models/export.model';
import { VariantDef } from '../variant.manager';

class MultipleChoiceOption extends IdSchema {

    @Prop({ required: true })
    public name!: string;

    @Prop()
    public correct?: boolean;

}

class MultipleChoiceResponse extends GenericResponse {

    @Prop({ required: true, ref: () => MultipleChoiceOption })
    public option!: Ref<MultipleChoiceOption>;

}

class MultipleChoicePoll extends GenericPoll {

    @Prop({ required: true, type: () => MultipleChoiceOption, validate: {
        validator: (x) => {
            return x.length > 0;
        },
        message: 'length must be greater than 0'
    } })
    public options!: MultipleChoiceOption[];

    @Prop({ required: true })
    public maxResponses!: number;

    @Prop({ required: true })
    public allowMultipleResponsesPerOption!: boolean;

}

export default class MultipleChoiceDef extends VariantDef {
    
    constructor() {
        super('MultipleChoice', MultipleChoicePoll, MultipleChoiceResponse);
    }

    modifyPublicOutput(data: MultipleChoicePoll) {
        for (const option of data.options) {
            delete option.correct;
        }
        return data;
    }

    validateResponse(poll: Doc<MultipleChoicePoll>, data: MultipleChoiceResponse, previousResponses: Doc<MultipleChoiceResponse>[]): boolean {
        if (!data.option) throw new BadRequestException('Option is required');
        const option = data.option as unknown as string;

        let found = false;
        for (const validOption of poll.options) {
            if (validOption._id.equals(option)) {
                found = true;
                break;
            }
        }
        if (!found) {
            throw new BadRequestException('Option does not exist');
        }

        if (poll.allowMultipleResponses) {
            if (previousResponses.length >= poll.maxResponses) {
                throw new ForbiddenException('Cannot exceed max responses limit');
            }
            if (!poll.allowMultipleResponsesPerOption) {
                for (const prevResponse of previousResponses) {
                    if ((prevResponse.option as mongoose.Types.ObjectId).equals(option)) {
                        throw new ForbiddenException('Cannot respond to option multiple times');
                    }
                }
            }
        }

        return true;
    }

    getResultsOutput(poll: Doc<MultipleChoicePoll>, responses: Doc<MultipleChoiceResponse>[]): object[] {
        
        const counts = new Map<string, number>();
        poll.options.forEach((x) => counts.set(x.id, 0));
        for (const response of responses) {
            const id = response.option.toString();
            counts.set(id, counts.get(id) + 1);
        }
        
        return poll.options.map((option) => ({
            _id: option.id,
            name: option.name,
            correct: option.correct,
            count: counts.get(option.id)
        }))
    }
    
}
