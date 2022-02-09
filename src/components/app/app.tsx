import React, { FC } from 'react';

import { Button } from '@/components/button/button';

import './app.module.styl';

export const App: FC = () => {
  return (
    <div className="app">
      <Button>Create</Button>
    </div>
  );
};
