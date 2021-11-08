import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { mongoose } from '@typegoose/typegoose';
import { Response } from 'express';
import { MongoError } from 'mongoose/node_modules/mongodb';
import MongooseError = mongoose.Error;

@Catch(MongooseError, MongoError)
export class MongooseExceptionFilter implements ExceptionFilter {

    catch (exception: Error, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        
        let status = HttpStatus.BAD_REQUEST;
        let name = exception.name;
        let message = exception.message;

        switch (exception.constructor) {
            case MongooseError.CastError:
                message = 'Invalid object ID';
                break;

            case MongoError:
                switch ((exception as MongoError).code) {
                    case 11000:
                        status = HttpStatus.CONFLICT;
                        name = 'Conflict';
                        message = 'Value must be unique';
                }
                break;
        }
        
        response.status(status).json({
            statusCode: status,
            message,
            error: name
        })
    }
    
}
