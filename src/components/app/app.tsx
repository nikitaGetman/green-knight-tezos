import React, { FC } from "react";
import "./app.styl";
import { Button } from "../button/button";

export const App: FC = () => {
  return (
    <div className="app">
      <Button>Create</Button>
    </div>
  );
};
