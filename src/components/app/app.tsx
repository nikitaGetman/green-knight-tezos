import React, { FC } from 'react';

import { Button } from '@/components/button/button';

import './app.scss';

export const App: FC = () => {
  const handleClick = () => {
    console.log('hello');
  };

  return (
    <div className="app">
      <Button onClick={handleClick}>Create</Button>
    </div>
  );
};
