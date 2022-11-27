import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { UserI } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss'],
})
export class SelectUsersComponent implements OnInit {

  @Input() users: UserI[] = [];
  @Output() addUser: EventEmitter<UserI> = new EventEmitter<UserI>();
  @Output() removeUser: EventEmitter<UserI> = new EventEmitter<UserI>();

  searchUsername = new FormControl();
  filteredUsers: UserI[] = [];
  selectedUser: UserI = null;
  
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.searchUsername.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((username: string) => this.userService.findByUsername(username).pipe(
        tap((users: UserI[]) => this.filteredUsers = users)
      ))
    ).subscribe();
  }

  displayFn(user: UserI) {
    if(user) {
      return user.username;
    } else {
      return '';
    }
  }
}
