import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { FC } from 'react';

export const Loader: FC = (props) => {
  const icon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return <Spin indicator={icon} {...props} />;
};
