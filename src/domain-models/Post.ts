import {User} from './User';

export interface Post {
  id: number;
  user_id: User['id'];
  title: string;
  body: string;
}
