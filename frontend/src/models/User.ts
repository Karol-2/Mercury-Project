interface User {
  id: number;
  first_name: string;
  last_name: string;
  country: string;
  profile_picture: string;
  mail: string;
  password: string;
  friend_ids: number[];
  chats: number[];
}

export default User;
