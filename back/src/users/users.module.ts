import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { WebsocketsModule } from '../websockets/websockets.module';
import { PollsModule } from '../polls/polls.module';

@Module({
  imports: [forwardRef(() => PollsModule), WebsocketsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
