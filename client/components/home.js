import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>
          <Link to="foo">Go to foo</Link>
        </p>
        <p>
          <a href="/whoami">Server-only route</a>
        </p>
      </div>
    );
  }
}
