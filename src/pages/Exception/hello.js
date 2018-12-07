import React from 'react';
import Link from 'umi/link';
import style from './style.less';
import welcome from '@/assets/welcome.png';

const ExceptionWelcom = () => (
  <div className={style.welcome}>
    <p className={style.welTitle}>欢迎访问盾泰云平台</p>
    <div className={style.animated}>
      <div className={style.cloudGroup}>
        <span className={style.cloud + ' ' + style.cloud_1} />
        {/* <span className={style.cloud + " " + style.cloud_2}></span> */}
      </div>
      <div className={style.carGroup}>
        <span className={style.car + ' ' + style.car_1} />
        <span className={style.car + ' ' + style.car_2} />
        <span className={style.car + ' ' + style.car_3} />
        <span className={style.car + ' ' + style.car_4} />
      </div>
    </div>
    {/* <p style={{textAlign:"center"}}>
      <img src={welcome} style={{maxWidth:"80%"}}></img>
    </p> */}
  </div>
);

export default ExceptionWelcom;
