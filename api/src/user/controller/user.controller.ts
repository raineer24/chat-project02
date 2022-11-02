import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserService } from '../service/user-service/user.service';

@Controller('users')
export class UserController {

  constructor(private userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<boolean> {
    return of(true);
  }

  // @Get()
  // findAll() {}

  // @Post()
  // login() {}
}
