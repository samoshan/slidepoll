import { Prop } from '@typegoose/typegoose';
import { GenericPoll, GenericResponse } from '../../models/core.schema';
import { Doc } from '../../models/export.model';
import { VariantDef } from '../variant.manager';

class OpenEndedResponse extends GenericResponse {

    @Prop({ required: true })
    public text!: string;

}

class OpenEndedPoll extends GenericPoll {}

export default class OpenEndedDef extends VariantDef {

    constructor() {
        super('OpenEnded', OpenEndedPoll, OpenEndedResponse);
    }

    validateResponse(poll: Doc<OpenEndedPoll>, data: any, previousResponses: Doc<OpenEndedResponse>[]): boolean {
        return true;
    }

    getResultsOutput(poll: Doc<OpenEndedPoll>, responses: Doc<OpenEndedResponse>[]): object[] {
        return responses.map((response) => ({
            id: response.id,
            text: response.text
        }))
    }
    
}
