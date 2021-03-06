import React, { FC } from 'react';
import { Link } from 'react-router-dom';

import './header.scss';

type Props = {};

export const Header: FC<Props> = () => {
  return (
    <div className="header">
      <div className="header__logo"></div>

      <div className="header__nav">
        <Link to="/">Home</Link>
        <Link to="/create">Create link</Link>
        <Link to="/plugin-info">Use our plugin</Link>
      </div>
    </div>
  );
};
