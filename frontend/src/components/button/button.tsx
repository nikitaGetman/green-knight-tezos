import { Button as AntButton, ButtonProps } from 'antd';
import React, { FC } from 'react';
import './button.scss';

export const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <AntButton shape="round" size="large" type="default" {...rest}>
      {children}
    </AntButton>
  );
};
