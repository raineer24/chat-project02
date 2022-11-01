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

@Controller('user')
export class UserController {
  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<boolean> {
    return of(true);
  }

  @Get()
  findAll() {}

  @Post()
  login() {}
}
