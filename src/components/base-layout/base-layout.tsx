import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

import './base-layout.scss';

export const BaseLayout: FC = () => {
  return (
    <div className="base-layout">
      <Outlet />
    </div>
  );
};
