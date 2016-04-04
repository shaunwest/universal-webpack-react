import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { saveUser } from '../actions/user.js';

const handleSubmit = e => {
  e.preventDefault();
  // do something...
};

class Form extends React.Component {
  render() {
    const { user, dispatch } = this.props;

    const handleNameChange = e => {
      dispatch(saveUser(e.target.value));
    };

    return (
      <div>
        <h1>Form</h1>
        <form action="/form" method="post" encType="multipart/form-data" onSubmit={ handleSubmit }>
          Name <input type="text" name="name" onChange={ handleNameChange } value={ user.name } />
          <input type="submit" value="Save" />
        </form>
      </div>
    );
  }
}

const select = state => ({ 
  user: state.user
});

export default connect(select)(Form);

/*
export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.name !== '')
      console.log('valid!');
    else
      console.log('not valid!');

    //saveUser(this.state.name);
  }

  render() {
    return (
      <div>
        <h1>Form</h1>
        <form action="/form" method="post" encType="multipart/form-data" onSubmit={ this.handleSubmit.bind(this) }>
          Name <input type="text" name="name" onChange={ this.handleNameChange.bind(this) } value={this.state.name } />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
*/
