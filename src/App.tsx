import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import { BaseLayout } from './components/base-layout/base-layout';
import { AuthorizePage } from './pages/authorization/authorization';
import { CreatePage } from './pages/create/create';
import { MainPage } from './pages/main/main';
import { PluginPage } from './pages/plugin/plugin';

export const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<MainPage />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="plugin" element={<PluginPage />} />
        <Route path=":ruleId" element={<AuthorizePage />} />
      </Route>
    </Routes>
  );
};
