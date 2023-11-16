interface User {
    id: number,
    nick: string,
    password: string,
    first_name: string,
    last_name: string,
    country: string,
    profile_picture: string,
    mail: string,
    friend_ids: number[],
    chats: number[],
}

export default User;