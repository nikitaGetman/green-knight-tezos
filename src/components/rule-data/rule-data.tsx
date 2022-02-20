import { RuleType } from '@/types/rules';
import React, { FC } from 'react';

import './rule-data.scss';

export const RuleDataView: FC<RuleType> = ({ title, balance, token }) => {
  return (
    <div className="rule">
      {title && <div className="rule__title">{title}</div>}
      <div className="rule__description">
        You need to have
        <span className="rule__balance">{balance}</span>
        <span className="rule__token">{token?.name}</span>
        to access
      </div>
    </div>
  );
};
