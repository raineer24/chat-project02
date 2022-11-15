import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { CustomSocket } from '../../sockets/custom-socket';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket) { }

  sendMessage() {

  }

  getMessage(){
    return this.socket.fromEvent('message');
  }
}
