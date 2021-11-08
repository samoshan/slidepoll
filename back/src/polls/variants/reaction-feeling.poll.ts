import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Prop } from '@typegoose/typegoose';
import { GenericPoll, GenericResponse } from '../../models/core.schema';
import { Doc } from '../../models/export.model';
import { VariantDef } from '../variant.manager';

const presets = {
    'thumbs-2': ['thumbs-up', 'thumbs-down'],
    'thumbs-3': ['thumbs-up', 'thumbs-side', 'thumbs-down'],
    'faces-3': ['happy', 'ok', 'sad'],
    'faces-5': ['very-happy', 'happy', 'ok', 'sad', 'very-sad']
}
const presetNames = Object.keys(presets);

class ReactionFeelingResponse extends GenericResponse {

    @Prop({ required: true })
    public reaction: string;

}

class ReactionFeelingPoll extends GenericPoll {

    @Prop({ required: true, enum: presetNames })
    public preset!: string;

}

export default class ReactionFeelingDef extends VariantDef {

    constructor() {
        super('ReactionFeeling', ReactionFeelingPoll, ReactionFeelingResponse);
    }

    private getPresetReactions(poll: ReactionFeelingPoll): string[] {
        return presets[poll.preset];
    }

    validateResponse(poll: Doc<ReactionFeelingPoll>, data: any, previousResponses: Doc<ReactionFeelingResponse>[]): boolean {
        const { reaction } = data;
        if (!reaction) throw new BadRequestException('Reaction is required');

        // multiple responses not permitted for this poll type
        if (previousResponses.length > 0) throw new ForbiddenException('Only one response allowed');

        // ensure reaction name exists for the preset
        const validReactions = this.getPresetReactions(poll);
        if (!validReactions.includes(reaction)) {
            throw new BadRequestException(`Reaction not valid for preset ${poll.preset}`);
        }

        return true;
    }

    getResultsOutput(poll: Doc<ReactionFeelingPoll>, responses: Doc<ReactionFeelingResponse>[]): object[] {

        const presetReactions = this.getPresetReactions(poll);
        
        const counts = new Map<string, number>();
        presetReactions.forEach((x) => counts.set(x, 0));
        for (const { reaction } of responses) {
            counts.set(reaction, counts.get(reaction) + 1);
        }

        return presetReactions.map((reaction) => ({
            reaction,
            count: counts.get(reaction)
        }))
    }
    
}
