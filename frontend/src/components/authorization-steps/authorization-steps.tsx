import { Steps } from 'antd';
import React, { FC } from 'react';

import { Loader } from '@/components/loader/loader';

import './authorization-steps.scss';
import { StepStatusType, StepType } from '@/types/steps';

const { Step } = Steps;

type Props = {
  steps: StepType[];
  current: number;
  error?: string;
  status: StepStatusType;
};

export const AuthorizationSteps: FC<Props> = ({ steps, current, status, error, ...rest }) => {
  return (
    <Steps {...rest} current={current} status={status} direction="vertical" className="authorization-steps">
      {steps.map(({ title, description }, index) => (
        <Step
          title={title}
          description={index === current ? error : description}
          key={title}
          className="authorization-steps__step"
          subTitle={index === current && status === 'process' && <Loader />}
        />
      ))}
    </Steps>
  );
};
