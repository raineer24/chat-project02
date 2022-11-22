import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CreateRoomComponent } from './components/create-room/create-room.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CreateRoomComponent
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,MatListModule, MatPaginatorModule, MatButtonModule, MatCardModule
  ]
})
export class PrivateModule { }
