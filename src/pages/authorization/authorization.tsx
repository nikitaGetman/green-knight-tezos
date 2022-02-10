import React, { FC } from 'react';
import { useParams } from 'react-router-dom';

export const AuthorizePage: FC = () => {
  const { ruleId } = useParams();

  // TODO connect tezos wallet and

  return <div className="authorize">Authorize by token: {ruleId}</div>;
};
