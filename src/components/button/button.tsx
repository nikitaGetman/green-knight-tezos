import { Button as AntButton, ButtonProps } from 'antd';
import React, { FC } from 'react';
import './button.scss';

export const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    // <AntButton {...rest} shape="round" size="large" type="dashed" ghost>
    //   {children}
    // </AntButton>
    <AntButton {...rest} shape="round" size="large" type="default">
      {children}
    </AntButton>
  );
};
