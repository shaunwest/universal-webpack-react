import SimpleDb from 'simple-node-db';

let db;

export const populateDatabase = cb => {
  console.log('populating db!');  
  replaceUser({
    id: '123',
    name: 'John' 
  }, cb);
}

export const open = () => {
  db = new SimpleDb('.demodb');
}

export const close = () => db.close(() => console.log('closed db'));

export const addUser = (user, cb) => {
  const key = db.createDomainKey('user', user.id);
  db.insert(key, user, cb);
}

export const updateUser = (user, cb) => {
  const key = db.createDomainKey('user', user.id);
  db.update(key, user, cb);
}

// FIXME: what if the id changed?
export const replaceUser = (user, cb) => {
  console.log('looking for', user);
  getUser(user.id, (err, foundUser) => {
    console.log('found user', foundUser);
    if (foundUser) {
      updateUser(user, cb);
    } else {
      addUser(user, cb);
    }
  });
}

export const getUser = (id, cb) => {
  const key = db.createDomainKey('user', id);
  db.find(key, cb);
}
