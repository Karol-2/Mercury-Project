export default (userId: string) => {
  return {
    type: "CREATE_SOCKET_CONNECTION",
    payload: { userId },
  };
};
