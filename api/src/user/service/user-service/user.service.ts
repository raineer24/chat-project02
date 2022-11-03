import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { UserEntity } from '../../model/user.entity';
import { UserI } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/model/dto/create-user.dto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  createUserDtoToEntity(createUserDto: CreateUserDto): UserI {
    return {
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
    };
  }

  async create(newUser: UserI): Promise<UserI> {
    try {
      const exists: boolean = await this.mailExists(newUser.email);
      if (!exists) {
        const passwordHash: string = await this.hashPassword(newUser.password);
        newUser.password = passwordHash;
        const user = await this.userRepository.save(
          this.userRepository.create(newUser),
        );
        return this.findOne(user.id);
      } else {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }
    } catch {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }
  }

  // create(newUser: UserI): Observable<UserI> {
  //   return this.mailExists(newUser.email).pipe(
  //     switchMap((exists: boolean) => {
  //       if (!exists) {
  //         return this.hashPassword(newUser.password).pipe(
  //           switchMap((passwordHash: string) => {
  //             //overwrite the user password with the hash, to store thash in the database
  //             newUser.password = passwordHash;
  //             return from(this.userRepository.save(newUser)).pipe(
  //               switchMap((user: UserI) => this.findOne(user.id)),
  //             );
  //           }),
  //         );
  //       }
  //     }),
  //   );
  // }

  // create(newUser: UserI): Observable<UserI> {
  //   return this.mailExists(newUser.email).pipe(
  //     switchMap((exists: boolean) => {
  //       if (exists === true) {
  //         return this.hashPassword(newUser.password).pipe(
  //           switchMap((passwordHash: string) => {
  //             //overwite the user password with the hash, to store the hash in the database
  //             newUser.password = passwordHash;
  //             return from(this.userRepository.save(newUser)).pipe(
  //               switchMap((user: UserI) => this.findOne(user.id)),
  //             );
  //           }),
  //         );
  //       } else {
  //         throw new HttpException(
  //           'Email is already in use',
  //           HttpStatus.CONFLICT,
  //         );
  //       }
  //     }),
  //   );
  // }

  private hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  private findOne(id: number): Observable<UserI> {
    return from(this.userRepository.findOne(id));
  }

  // private mailExists(email: string): Observable<boolean> {
  //   return from(this.userRepository.findOne({ email })).pipe(
  //     map((user: UserI) => {
  //       if (user) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }),
  //   );
  // }

  private async mailExists(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
