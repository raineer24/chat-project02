import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserI } from 'src/app/model/user.interface';
import { ChatService } from '../../services/chat-service/chat.service';
@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent{

  form: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    description: new FormControl(null),
    users: new FormArray([], Validators.required),
  });

  constructor(private chatService: ChatService, private router: Router, private activatedRoute: ActivatedRoute) { }

  create() {}

  get name(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get description(): FormControl {
    return this.form.get('description') as FormControl;
  }

  get users(): FormArray {
    return this.form.get('users') as FormArray;
  }

}
