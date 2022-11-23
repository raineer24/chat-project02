import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { CustomSocket } from '../../sockets/custom-socket';
import { RoomI, RoomPaginateI } from 'src/app/model/room.interface';
import { UserI } from 'src/app/model/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThisReceiver } from '@angular/compiler';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket, private snackbar: MatSnackBar) {}

  sendMessage() {}

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getMyRooms() {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  emitPaginateRooms(limit: number, page: number) {
    this.socket.emit('paginateRooms', { limit, page });
  }

  createRoom(room: RoomI) {
    this.socket.emit('createRoom', room);
    this.snackbar.open(`Room ${room.name} created successfully`, 'Close', {
      duration: 2000, horizontalPosition: 'right', verticalPosition: 'top'
    });
  }
}
