import React from 'react';
import style from './style.css';
import { Spin, } from 'antd';
export default () => (
  <div className={style.container}>
    <Spin size="large" />
  </div>
);