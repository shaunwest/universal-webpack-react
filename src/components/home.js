import React from 'react';

export default class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>
          <a href="/whoami">Server-only route</a>
        </p>
      </div>
    );
  }
}
