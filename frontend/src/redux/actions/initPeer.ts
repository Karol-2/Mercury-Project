export default (userId: string) => {
    return {
      type: "INIT_PEER",
      payload: { userId },
    };
};