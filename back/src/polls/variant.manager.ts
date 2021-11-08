import glob from 'glob';
import path from 'path';
import { getDiscriminatorModelForClass, ReturnModelType } from '@typegoose/typegoose';
import { GenericPoll, GenericResponse } from '../models/core.schema';
import { PollDocument, PollModel, ResponseDocument, ResponseModel } from '../models/export.model';

export class VariantManager {

    static readonly map = new Map<string, VariantDef>();

    static register(def: VariantDef) {
        this.map.set(def.name, def);
    }

    static get(name: string) {
        return this.map.get(name);
    }

    static getFrom(poll: PollDocument) {
        return this.map.get(poll.variant);
    }

    static getAll() {
        return this.map.values();
    }

    static async loadAll() {

        glob.sync(path.join(__dirname, 'variants/**/*.js')).forEach((variantFile) => {
            this.register(new (require(variantFile).default)());
        })

        let variantNames = Array.from(this.getAll()).map(x => x.name);
        console.log(`Loaded ${variantNames.length} poll variant definitions: ${JSON.stringify(variantNames)}`);
    }

}

export abstract class VariantDef {

    name: string;
    pollClass: typeof GenericPoll;
    responseClass: typeof GenericResponse;
    pollModel: ReturnModelType<typeof GenericPoll>;
    responseModel: ReturnModelType<typeof GenericResponse>;

    constructor(name: string, pollClass: typeof GenericPoll, responseClass: typeof GenericResponse) {
        this.name = name;
        this.pollClass = pollClass;
        this.responseClass = responseClass;

        this.pollModel = getDiscriminatorModelForClass(PollModel, pollClass, name);
        this.responseModel = getDiscriminatorModelForClass(ResponseModel, responseClass, name);
    }

    toPublic(poll: PollDocument) {
        return this.modifyPublicOutput(poll.toObject());
    }

    modifyPublicOutput(data: any): GenericPoll {
        return data;
    }

    abstract validateResponse(poll: PollDocument, data: any, previousResponses: ResponseDocument[]): boolean;

    abstract getResultsOutput(poll: PollDocument, responses: ResponseDocument[]): object[];

}
