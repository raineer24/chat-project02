import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { RoomService } from './service/room-service/room/room.service';

@Module({
  imports: [AuthModule, UserModule],
  providers: [ChatGateway, RoomService],
})
export class ChatModule {}
