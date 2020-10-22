import instance from '../axios-users';

export const addBoard = (title, history) => {
  return async dispatch => {
    try {
      const res = await instance.post('/boards', { title });
      const { _id: boardId } = res.data.result;
      history.push(`/boards/${boardId}`);
    } catch (e) {
      console.log(e.response);
    }
  };
};
