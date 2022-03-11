import React, { FC, useCallback, useEffect } from 'react';

export const PluginInfoPage: FC = () => {
  useEffect(() => {
    window.location.href = 'https://github.com/nikitaGetman/tezos-flame-defi/blob/master/plugin/readme.md';
  }, []);

  return (
    <div className="plugin-info">
      <p>How to use plugin</p>
    </div>
  );
};
