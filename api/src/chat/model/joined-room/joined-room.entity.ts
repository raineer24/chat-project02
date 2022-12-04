import { UserEntity } from 'src/user/model/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomEntity } from '../room/room.entity';

@Entity()
export class JoinedRoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  // eslint-disable-next-line prettier/prettier
  @ManyToOne(() => UserEntity, (user) => user.joinedRooms)
  @JoinColumn()
  user: UserEntity;

  // eslint-disable-next-line prettier/prettier
  @ManyToOne(() => RoomEntity, (room) => room.joinedUsers)
  @JoinColumn()
  room: RoomEntity;
}
