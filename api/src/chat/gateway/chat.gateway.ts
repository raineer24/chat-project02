import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { emit } from 'process';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { UserI } from 'src/user/model/user.interface';
import { UserService } from 'src/user/service/user-service/user.service';
import { ConnectedUserI } from '../model/connected-user/connected-user.interface';
import { JoinedRoomI } from '../model/joined-room/joined-room.interface';
import { MessageI } from '../model/message/message.interface';
import { PageI } from '../model/page.interface';
import { RoomI } from '../model/room/room.interface';
import { ConnectedUserService } from '../service/connected-user/connected-user.service';
import { JoinedRoomService } from '../service/joined-room/joined-room.service';
import { MessageService } from '../service/message/message.service';
import { RoomService } from '../service/room-service/room.service';

@WebSocketGateway({
  cors: [
    'https://hoppscotch.io',
    'http://localhost:3000',
    'http://localhost:4200',
  ],
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  title: string[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private roomService: RoomService,
    private connectedUserService: ConnectedUserService,
    private joinedRoomService: JoinedRoomService,
    private messageService: MessageService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      // eslint-disable-next-line prettier/prettier
      const decodedToken = await this.authService.verifyJwt(
        socket.handshake.headers.authorization,
      );
      const user: UserI = await this.userService.getOne(decodedToken.user.id);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this.roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        // substract page -1 to match the angular material paginator
        // eslint-disable-next-line prettier/prettier
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        // Save connection to DB
        await this.connectedUserService.create({ socketId: socket.id, user });
        //only lemit rooms to the specific connected client
        return this.server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    console.log('On Disconnect');
    // remove connection from DB
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: RoomI) {
    const createRoom: RoomI = await this.roomService.createRoom(
      room,
      socket.data.user,
    );
    for (const user of createRoom.users) {
      const connections: ConnectedUserI[] =
        await this.connectedUserService.findByUser(user);
      const rooms = await this.roomService.getRoomsForUser(user.id, {
        page: 1,
        limit: 10,
      });
      // substract page -1 to match the angular material paginator
      rooms.meta.currentPage = rooms.meta.currentPage - 1;
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }

  @SubscribeMessage('paginateRooms')
  async onPaginateRoom(socket: Socket, page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    // eslint-disable-next-line prettier/prettier
    page.page = page.page + 1;
    const rooms = await this.roomService.getRoomsForUser(
      socket.data.user.id,
      page,
    );
    // substract page -1 to match the angular material paginator
    // eslint-disable-next-line prettier/prettier
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomI) {
    const messages = await this.messageService.findMessageForRoom(room, {
      limit: 10,
      page: 1,
    });
    messages.meta.currentPage = messages.meta.currentPage - 1;
    //save Connection to Room
    await this.joinedRoomService.create({
      socketId: socket.id,
      user: socket.data.user,
      room,
    });
    // send last messages from Room to User
    await this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    // remove connection from JoinedRooms
    await this.joinedRoomService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: MessageI) {
    const createdMessage: MessageI = await this.messageService.create({
      ...message,
      user: socket.data.user,
    });
    const room: RoomI = await this.roomService.getRoom(createdMessage.room.id);
    const joinedUsers: JoinedRoomI[] = await this.joinedRoomService.findByRoom(
      room,
    );
    // TODO:Send new message to all joined users of the room (currently online)
    for (const user of joinedUsers) {
      await this.server.to(user.socketId).emit('messageAdded', createdMessage);
    }
  }

  private handleIncomingPageRequest(page: PageI) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    // add page +1 to match angular material paginator
    page.page = page.page + 1;
    return page;
  }
}
