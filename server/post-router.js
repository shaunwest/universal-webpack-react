import { saveUser } from '../client/actions/user';

const postRouter = (store, req) => {
  store.dispatch(saveUser(req.body.name));
};

module.exports = postRouter;
