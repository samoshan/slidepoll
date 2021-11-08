import { Module } from '@nestjs/common';
import { PollsModule } from './polls/polls.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WebsocketsModule } from './websockets/websockets.module';

@Module({
    imports: [PollsModule, AuthModule, UsersModule, WebsocketsModule],
})
export class AppModule {}
