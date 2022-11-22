import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { PageEvent } from '@angular/material/paginator';
import { ChatService } from '../../services/chat-service/chat.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent{

 rooms$ = this.chatService.getMyRooms();
 selectedRoom = null

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.createRoom();
  }

  onSelectRoom(event: MatSelectionListChange) {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(pageEvent: PageEvent) {
   this.chatService.emitPaginateRooms(pageEvent.pageSize, pageEvent.pageIndex);
  }

}
