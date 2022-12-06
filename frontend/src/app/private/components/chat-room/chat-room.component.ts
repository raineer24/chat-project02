import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { MessagePaginateI } from 'src/app/model/message.interface';
import { RoomI } from 'src/app/model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
})
export class ChatRoomComponent implements OnChanges, OnDestroy, AfterViewInit {
  @Input() chatRoom: RoomI;

  messages$: Observable<MessagePaginateI> = this.chatService.getMessages();
  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}
}
