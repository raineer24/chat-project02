import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Observable, of, switchMap } from 'rxjs';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user-service/user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<boolean> {
    return this.userHelperService.createUserDtoEntity(createUserDto).pipe(
      switchMap((user: UserI) => this.userService.create())
    )
  }

  // @Get()
  // findAll() {}

  // @Post()
  // login() {}
}
