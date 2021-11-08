import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { WebsocketsModule } from '../websockets/websockets.module';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';

@Module({
  imports: [forwardRef(() => UsersModule), WebsocketsModule],
  controllers: [PollsController, ResponsesController],
  providers: [PollsService, ResponsesService],
  exports: [PollsService]
})
export class PollsModule {}
