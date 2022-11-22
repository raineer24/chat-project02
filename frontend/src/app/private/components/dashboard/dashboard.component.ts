import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ChatService } from '../../services/chat-service/chat.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

 rooms$ = this.chatService.getMyRooms();

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.createRoom();
  }

  onSelectRoom() {}

  onPaginateRooms(pageEvent: PageEvent) {
   this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

}
