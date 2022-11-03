import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Observable, of, switchMap, from } from 'rxjs';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserI } from '../model/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user-service/user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  // @Post()
  // create(@Body() createUserDto: CreateUserDto): Observable<UserI> {
  //   return this.userHelperService
  //     .createUserDtoEntity(createUserDto)
  //     .pipe(switchMap((user: UserI) => this.userService.create(user)));
  // }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserI> {
    const userEntity: UserI =
      this.userHelperService.createUserDtoToEntity(createUserDto);
    return this.userService.create(userEntity);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto): Observable<UserI> {
  //   return this.userHelperService
  //     .createUserDtoEntity(createUserDto)
  //     .pipe(switchMap((user: UserI) => this.userService.create(user)));
  // }

  // return from(this.userRepository.findOne({ email })).pipe(
  //   map((user: UserI) => {
  //     if (user) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }),
  // );

  // @Get()
  // findAll() {}

  // @Post()
  // login() {}
}
