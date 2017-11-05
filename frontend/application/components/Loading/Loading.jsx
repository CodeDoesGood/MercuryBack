import React from 'react';

import style from './loading.less';

export default function Loading() {
  return (
    <div className={style.spinner}>
      <div className={style.rect1} />
      <div className={style.rect2} />
      <div className={style.rect3} />
      <div className={style.rect4} />
      <div className={style.rect5} />
    </div>
  );
}
