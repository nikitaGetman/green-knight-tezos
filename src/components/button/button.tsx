import React, { FC } from "react";
import "./button.styl";

export const Button: FC = ({ children }) => {
  return <button className="button">{children}</button>;
};
