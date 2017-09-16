import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Navigation from './Navigation';

export default function Header(props) {
  Header.propTypes = {
    logo: PropTypes.string.isRequired,
  };

  return (
    <header className="Header">
      <center>
        <Link to={'/'}><img src={props.logo} alt="LOGO" style={{ width: '100px', height: '100px' }} /></Link>
        <br />
      </center>
      <Navigation />
    </header>
  );
}
