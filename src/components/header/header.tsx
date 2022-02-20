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
        <Link to="/create">Create new rule</Link>
        <Link to="/plugin">Use plugin</Link>
      </div>
    </div>
  );
};
