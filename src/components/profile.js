import React from 'react';
import { connect } from 'react-redux';

import UserForm from './user-form';
import { saveUser } from '../actions/user';

// This is a "Page-level" Component because it has access to the server request
// It's also a Container/Smart Component because it's connected to the store
class Profile extends React.Component {
  handleNameChange(name) {
    const { dispatch } = this.props;
    dispatch(saveUser(name));
  }

  handleSave(e) {
    e.preventDefault();
  }

  componentWillMount() {
    if (this.props.serverPost) {
      console.log('REQ body', this.props.serverPost);
    } else if (this.props.serverGet) {
      console.log('REQ Params', this.props.serverGet.query);
    }
  }

  render() {
    const { user, dispatch } = this.props;
    return (
      <UserForm user={ user } onUpdate={ this.handleNameChange.bind(this) } onSave={ this.handleSave.bind(this) } />
    );
  }
}

const select = state => ({ 
  user: state.user
});

export default connect(select)(Profile);
