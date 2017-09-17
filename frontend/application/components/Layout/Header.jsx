import React from 'react';

import Navigation from './Navigation';

const style = require('./header.less');

export default function Header() {
  return (
    <header className="Header">
      <div className={style.headerBox}>
        <span className={style.headerText}>&lt; Code Does Good /&gt;</span>
      </div>
      {/*<Navigation />*/}
    </header>
  );
}
