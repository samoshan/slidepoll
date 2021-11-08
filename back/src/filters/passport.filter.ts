import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
// @ts-ignore
import { errors as PlmErrors } from 'passport-local-mongoose';

@Catch(PlmErrors.AuthenticationError)
export class PassportExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.BAD_REQUEST;

        response.status(status).json({
            statusCode: status,
            message: exception.message,
            error: 'AuthenticationError'
        })
    }

}