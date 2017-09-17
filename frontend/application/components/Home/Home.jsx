import React from 'react';

const style = require('./home.less');

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      error: false,
    };
  }

  render() {
    return (
      <div>
        <div className={style.homeTitle}>Volunteer Home</div>
      </div>
    );
  }
}
