import React from 'react';
import { Link } from 'react-router-dom';

const style = require('./header.less');

export default function Header() {
  return (
    <header className="Header">
      <div className={style.headerBox}>
        <span className={style.headerText}><Link href to="/">&lt; Code Does Good /&gt;</Link></span>
      </div>
    </header>
  );
}
