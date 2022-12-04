import { ConnectedUserEntity } from 'src/chat/model/connected-user/connected-user.entity';
import { JoinedRoomEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { MessageEntity } from 'src/chat/model/message/message.entity';
import { RoomEntity } from 'src/chat/model/room/room.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  // eslint-disable-next-line prettier/prettier
  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  // eslint-disable-next-line prettier/prettier
  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLocaleLowerCase();
    this.username = this.username.toLowerCase();
  }
}
