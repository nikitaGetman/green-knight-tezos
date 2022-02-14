import { NetworkType as BeaconNetworkType } from '@airgap/beacon-sdk';
import { Steps } from 'antd';
import React, { FC, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/button/button';
import { Loader } from '@/components/loader/loader';
import { connectWalletBeacon } from '@/services/wallets';
import { hasMessage } from '@/utils/common';

import './authorize.scss';

const { Step } = Steps;

const STEPS = [
  { title: 'Connect wallet' },
  { title: 'Sign transaction' },
  { title: 'Check wallet balance' },
  { title: 'Success!' },
];

export const AuthorizePage: FC = () => {
  const { ruleId } = useParams();

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'wait' | 'process' | 'finish' | 'error'>('wait');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      setStatus('process');
      await connectWalletBeacon(true, { type: BeaconNetworkType.HANGZHOUNET });
      setStep(1);
      setStatus('process');
    } catch (e) {
      if ((e as any)?.name === 'NotGrantedTempleWalletError') {
        return;
      }
      const outputArg = hasMessage(e) ? e.description : e;
      console.error(e);

      setStatus('error');
      setError(outputArg as string);
    }
  };

  const steps = useMemo(() => {
    return STEPS.map(({ title }, index) => ({
      title,
      className: 'authorize__step',
      subTitle: index === step && status === 'process' && <Loader />,
      description: index === step && status === 'error' && error,
    }));
  }, [step, status]);

  return (
    <div className="authorize">
      <h2 className="authorize__title">Authorize for: {ruleId}</h2>

      <Steps current={step} status={status} direction="vertical" className="authorize__steps">
        {steps.map((step) => (
          <Step {...step} key={step.title} />
        ))}
      </Steps>

      <Button onClick={connectWallet}>Connect wallet</Button>
    </div>
  );
};
