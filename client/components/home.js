import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home!!</h1>
        <ul>
          <li><Link to="foo">Go to foo</Link></li>
          <li><Link to="form">Go to form</Link></li>
        </ul>
        <p>
          <a href="/whoami">Server-only route</a>
        </p>
      </div>
    );
  }
}
