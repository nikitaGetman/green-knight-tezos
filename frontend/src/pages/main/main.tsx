import React, { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/button/button';

import './main.scss';
import { RandomEmoji } from '@/components/random-emoji/random-emoji';

export const MainPage: FC = () => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate('/create');
  }, [navigate]);

  return (
    <div className="main">
      <h1 className="main__title">
        Grant access to special resources
        <br /> to your loyal users
        <RandomEmoji />
      </h1>
      {/*  */}

      <Button type="primary" onClick={handleClick}>
        Create secure resource link
      </Button>

      <div className="main__list">
        <div className="main__sublist">
          <div className="main__item" onClick={handleClick}>
            <div className="main__number main__number--1">1.</div>
            <div className="main__text">Offer additional content to the owners of your NFT</div>
          </div>
          <div className="main__item" onClick={handleClick}>
            <div className="main__number main__number--2">2.</div>
            <div className="main__text">Grant special access to your dedicated users</div>
          </div>
          <div className="main__item" onClick={handleClick}>
            <div className="main__number main__number--3">3.</div>
            <div className="main__text">Unite your users in Telegram and Discord communities</div>
          </div>
        </div>
        <div className="main__sublist">
          <div className="main__item" onClick={handleClick}>
            <div className="main__number main__number--4">4.</div>
            <div className="main__text">Develop a community around your product</div>
          </div>
          <div className="main__item" onClick={handleClick}>
            <div className="main__number main__number--5">5.</div>
            <div className="main__text">Communicate with your loyal audience</div>
          </div>
        </div>
      </div>
    </div>
  );
};
