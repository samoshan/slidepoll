import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { mongoose, Prop } from '@typegoose/typegoose';
import { GenericPoll, GenericResponse, IdSchema } from '../../models/core.schema';
import { Doc } from '../../models/export.model';
import { VariantDef } from '../variant.manager';

class RankedChoiceOption extends IdSchema {

    @Prop({ required: true })
    public name!: string;

}

class RankedChoiceResponse extends GenericResponse {

    @Prop({ required: true, type: mongoose.Types.ObjectId })
    public order!: mongoose.Types.ObjectId[];

}

class RankedChoicePoll extends GenericPoll {

    @Prop({ required: true, type: () => RankedChoiceOption, validate: {
        validator: (x) => {
            return x.length > 0;
        },
        message: 'length must be greater than 0'
    } })
    public options!: RankedChoiceOption[];

    @Prop({ required: true })
    public randomiseOrder!: boolean;

}

export default class RankedChoiceDef extends VariantDef {

    constructor() {
        super('RankedChoice', RankedChoicePoll, RankedChoiceResponse);
    }

    validateResponse(poll: Doc<RankedChoicePoll>, data: any, previousResponses: Doc<RankedChoiceResponse>[]): boolean {
        const order = data.order as string[];

        // multiple responses not permitted for this poll type
        if (previousResponses.length > 0) throw new ForbiddenException('Only one response allowed');

        // ensure order is an array of expected length
        if (!order) throw new BadRequestException('Order is required');
        if (!Array.isArray(order)) throw new BadRequestException('Invalid order format');
        if (order.length !== poll.options.length) throw new BadRequestException('Unexpected number of items in order');
        
        // ensure that every poll option is in the array
        for (const option of poll.options) {
            if (!order.includes(option.id)) {
                throw new BadRequestException(`Order is missing option id ${option.id}`);
            }
        }

        return true;
    }

    getResultsOutput(poll: Doc<RankedChoicePoll>, responses: Doc<RankedChoiceResponse>[]): object[] {
        
        const weights = new Map<string, number>();
        poll.options.forEach((option) => weights.set(option.id, 0));
        for (const response of responses) {
            response.order.forEach((optionId, index) => {
                const strOptionId = optionId.toHexString();
                weights.set(strOptionId, weights.get(strOptionId) + index + 1);
            })
        }
        const results = poll.options.map((option) => ({
            _id: option._id,
            name: option.name,
            weight: weights.get(option.id),
            avg: (weights.get(option.id) / responses.length).toFixed(1)
        }))
        return results.sort((a, b) => a.weight - b.weight);
    }
    
}
