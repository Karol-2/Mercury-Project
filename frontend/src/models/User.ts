export interface FrontendUser {
  first_name: string;
  last_name: string;
  country: string;
  profile_picture: string;
  mail: string;
  password: string;
}

interface User extends FrontendUser {
  id: string;
  friend_ids: number[];
  chats: number[];
}

export default User;
