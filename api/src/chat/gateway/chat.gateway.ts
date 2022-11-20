import { UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import { PageI } from '../model/page.interface';
import { RoomI } from '../model/room/room.interface';
import { RoomService } from '../service/room-service/room/room.service';

@WebSocketGateway({
  cors: [
    'https://hoppscotch.io',
    'http://localhost:3000',
    'http://localhost:4200',
  ],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
  ) {}

  async handleConnection(socket: Socket) {
    try {
      // eslint-disable-next-line prettier/prettier
      const decodedToken = await this.authService.verifyJwt(socket.handshake.headers.authorization);
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        //only lemit rooms to the specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket) {
    console.log('On Disconnect');
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI): Promise<RoomI> {
    console.log(socket.data.user);
    console.log(room.users);
    return this.roomService.createRoom(room, socket.data.user);
  }

  @SubscribeMessage('paginateRoom')
  async onPaginateRoom(socket: Socket, page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      page,
    );
    return this.server.to(socket.id).emit('rooms', rooms);
  }
}
