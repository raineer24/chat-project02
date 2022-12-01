import { UserI } from 'src/user/model/user.interface';
import { RoomI } from '../room/room.interface';

export interface JoinedRoomI {
  id?: number;
  sockedId: string;
  user: UserI;
  room: RoomI;
}
