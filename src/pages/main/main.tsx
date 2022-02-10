import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/button/button';

export const MainPage: FC = () => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate('/create');
  }, [navigate]);

  return (
    <div className="main">
      <div className="app">
        <Button onClick={handleClick}>Create new rule</Button>
      </div>
    </div>
  );
};
