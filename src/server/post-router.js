// Maybe we don't need this

//import { saveUser } from '../client/actions/user';
import { saveUser } from '../actions/user';

const postRouter = (store, req) => {
  store.dispatch(saveUser(req.body.name));
};

module.exports = postRouter;
