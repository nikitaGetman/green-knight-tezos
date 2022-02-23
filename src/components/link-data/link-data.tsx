import { LinkType } from '@/types/links';
import React, { FC } from 'react';

import './link-data.scss';

export const LinkDataView: FC<LinkType> = ({ title, minBalance, token }) => {
  return (
    <div className="rule">
      {title && <div className="rule__title">{title}</div>}
      <div className="rule__description">
        You need to have
        <span className="rule__balance">{minBalance}</span>
        <span className="rule__token">{token?.name}</span>
        to access
      </div>
    </div>
  );
};
