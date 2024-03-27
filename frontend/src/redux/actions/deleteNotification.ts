export default (id: string) => {
  return {
    type: "DELETE_NOTIFICATION",
    payload: { id },
  };
};
