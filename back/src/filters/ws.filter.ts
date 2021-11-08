import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {

        const data = (exception instanceof HttpException) ? exception.getResponse() : exception;
        
        host.switchToWs().getClient<Socket>().emit('exception', data);
    }

}
