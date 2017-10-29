import React from 'react';

export default class SignOut extends React.Component {
  constructor(props) {
    super(props);
    this.props.history.push('/');
    location.reload();
  }

  render() {
    return (<div>Sign out</div>)
  }
}
