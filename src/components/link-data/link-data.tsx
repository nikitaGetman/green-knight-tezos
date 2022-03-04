import { SecureLinkType } from '@/types/links';
import React, { FC } from 'react';

import './link-data.scss';

export const LinkDataView: FC<SecureLinkType> = ({ title, links, token, isSeparateLink }) => {
  return (
    <div className="rule">
      {title && <div className="rule__title">{title}</div>}
      <div className="rule__description">
        You need to have
        {!isSeparateLink && <span className="rule__balance">{links[0].minBalance || 'any'}</span>}
        <span className="rule__token">{token.metadata?.name || token.contract}</span>
        to access
      </div>
    </div>
  );
};
