import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import { BaseLayout } from './components/base-layout/base-layout';
import { AuthorizePage } from './pages/authorization/authorization';
import { CreateLinkPage } from './pages/create-link/create-link';
import { MainPage } from './pages/main/main';
import { PluginPage } from './pages/plugin/plugin';
import { TelegramBot } from './pages/telegram-bot/telegram-bot';

export const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<MainPage />} />
        <Route path="create" element={<CreateLinkPage />} />
        <Route path="plugin" element={<PluginPage />} />
        <Route path=":linkId" element={<AuthorizePage />} />
        <Route path="telegram-bot" element={<TelegramBot />} />
      </Route>
    </Routes>
  );
};
