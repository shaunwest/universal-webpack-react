
export const ping = (msg, callback) => {
  console.log('MSG: ' + msg);
  setTimeout(() => callback(msg), 500);
}
