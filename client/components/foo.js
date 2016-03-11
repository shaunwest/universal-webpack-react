import React from 'react';
import { connect } from 'react-redux';

class Foo extends React.Component {
  render() {
    const { count, dispatch } = this.props;

    return (
      <div>
        <h1>Foo!!</h1>
        <p>{ count.num }</p>
        <button className="box increment" onClick={() => dispatch({type: "INC"})}>
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
