import React, { FC } from 'react';
import { AuthorizePage } from '../authorization/authorization';

import './plugin.scss';

export const PluginPage: FC = () => {
  return (
    <div className="plugin">
      <div className="plugin__container">
        <div className="plugin__logo"></div>
        <AuthorizePage />
      </div>
    </div>
  );
};
