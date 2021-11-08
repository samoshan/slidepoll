import { DocumentType, getModelForClass } from '@typegoose/typegoose';
import { Document, PassportLocalDocument, PassportLocalModel } from 'mongoose';
import { User } from '../users/user.schema';
import { GenericPoll, GenericResponse } from './core.schema';

export type Doc<T> = T & Omit<Document, '_id'|'id'>;

export const PollModel = getModelForClass(GenericPoll);
export type PollDocument = Doc<GenericPoll>;

export const ResponseModel = getModelForClass(GenericResponse);
export type ResponseDocument = Doc<GenericResponse>;

export const UserModel = getModelForClass(User) as PassportLocalModel<DocumentType<User>>;
export type UserDocument = User & Omit<PassportLocalDocument, '_id'|'id'>;
