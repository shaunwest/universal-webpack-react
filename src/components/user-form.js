import React from 'react';

export default (props) => (
  <div>
    <h1>User Info</h1>
    <form action="/profile" method="post" onSubmit={ props.onSave }>
      Name <input type="text" name="name" onChange={ e => props.onUpdate(e.target.value) } value={ props.user.name } />
      <input type="submit" value="Save" />
    </form>
  </div>
);
