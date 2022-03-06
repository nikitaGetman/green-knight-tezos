import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../header/header';

import './base-layout.scss';

export const BaseLayout: FC = () => {
  return (
    <div className="base-layout">
      <Header />
      <div className="base-layout__main">
        <Outlet />
      </div>

      <div className="base-layout__footer">
        {/* Powered by{' '}
        <a href="https://tzkt.io/" target="_blank" rel="noreferrer">
          TzKT API
        </a> */}
      </div>
    </div>
  );
};
