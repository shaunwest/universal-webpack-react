import React from 'react';
import { Link } from 'react-router';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Demo!</h1>
        <ul>
          <li><Link to="/">Go to home</Link></li>
          <li><Link to="counter">Go to counter</Link></li>
          <li><Link to="profile">Go to profile</Link></li>
        </ul>
        <div>{ this.props.children }</div>
      </div>
    );
  }
}
