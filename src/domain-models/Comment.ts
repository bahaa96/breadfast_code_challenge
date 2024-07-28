import {Post} from './Post';

export interface Comment {
  id: number;
  post_id: Post['id'];
  name: string;
  email: string;
  body: string;
}
