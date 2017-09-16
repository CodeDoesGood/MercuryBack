import React from 'react';
import { Link } from 'react-router-dom';

const style = require('./navigation.less');

function Navigation() {
  return (
    <div className={style.nav}>
      <ul>
        <li><Link to={'/home'}>home</Link></li>
        <li><Link to={'/login'}>login</Link></li>
      </ul>
    </div>
  );
}

export default Navigation;
