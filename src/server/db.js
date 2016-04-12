//import SimpleDb from 'simple-node-db';
const SimpleDb = (__SERVER__) ? require('simple-node-db') : null;

const db = (SimpleDb) ? new SimpleDb() : {};

export const addUser = (user, cb) => {
  const key = db.createDomainKey('user', user.id);
  db.insert(key, user, cb);
}

export const updateUser = (user, cb) => {
  const key = db.createDomainKey('user', user.id);
  db.update(key, user, cb);
}

export const replaceUser = (user, cb) => {
  getUser(user.id, (err, foundUser) => {
    if (foundUser) {
      updateUser(foundUser, cb);
    } else {
      addUser(user, cb);
    }
  });
}

export const getUser = (id, cb) => {
  const key = db.createDomainKey('user', id);
  db.find(key, cb);
}
