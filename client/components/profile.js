import React from 'react';
import { connect } from 'react-redux';

import UserForm from './user-form';
import { saveUser } from '../actions/user';

class Profile extends React.Component {
  render() {
    const { user, dispatch } = this.props;

    const handleNameChange = name => {
      dispatch(saveUser(name));
    };

    const handleSave = (e) => {
      e.preventDefault();
    };

    return (
      <UserForm user={ user } onUpdate={ handleNameChange } onSave={ handleSave } />
    );
  }
}

const select = state => ({ 
  user: state.user
});

export default connect(select)(Profile);
