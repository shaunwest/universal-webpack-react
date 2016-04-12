import xhr from 'xhr';

export const SYNCING_REMOTE = 'SYNC_REMOTE';

export const syncingRemote = () => ({ type: SYNCING_REMOTE });

export const syncRemote = () => (dispatch, getState) => {
  const user = getState().user;
  const headers = {
    'Content-Type': 'application/json'
  };

  xhr.post('/sync', { headers, body: JSON.stringify(user) }, (err, res) => {
    if (err) throw err;
  });

  dispatch(syncingRemote());
}
