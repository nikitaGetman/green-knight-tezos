import React, { FC, useState } from 'react';
import { useEffect } from 'react';

import './random-emoji.scss';

type Props = {};

const EMOJIS = [
  'π¦ΈπΌ',
  'π§',
  'π»',
  'π€',
  'π',
  'π',
  'ππ»',
  'π¦Ύ',
  'π¦',
  'π¨',
  'π¦',
  'π¦',
  'π',
  'π’',
  'πΉ',
  'π²',
  'π',
  'π₯',
  'π₯¦',
  'π',
  'π',
  'π',
];

export const RandomEmoji: FC<Props> = () => {
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * EMOJIS.length);
      setEmoji(EMOJIS[index]);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [setEmoji]);

  return <span className="emoji">{emoji}</span>;
};
