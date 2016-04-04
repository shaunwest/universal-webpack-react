import React from 'react';
import { connect } from 'react-redux';
import { increment } from '../actions/count.js';

class Foo extends React.Component {
  render() {
    const { count, dispatch } = this.props;

    return (
      <div>
        <h1>Foobar!!</h1>
        <p>{ count.num }</p>
        <button className="box increment" onClick={ () => dispatch(increment) }>
          +1
        </button>
      </div>
    );
  }
}

const select = state => ({ 
  count: state.count
});

export default connect(select)(Foo);
