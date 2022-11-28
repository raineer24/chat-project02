import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserEntity } from 'src/chat/model/connected-user/connected-user.entity';
import { ConnectedUserI } from 'src/chat/model/connected-user/connected-user.interface';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create() {
    return;
  }
  async findByUser() {
    return;
  }
  async deleteBySocketId() {
    return;
  }
  async deleteAll() {
    return;
  }
}
