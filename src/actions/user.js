//import { getUser } from '../server/db.js';

export const SAVE = 'SAVE';

export const saveUser = (id, name) => ({ type: SAVE, id, name });

/*
export const populateUserFromDb = id => dispatch =>
  getUser('123', (err, user) => 
    dispatch(saveUser(user.id, user.name)));
*/
