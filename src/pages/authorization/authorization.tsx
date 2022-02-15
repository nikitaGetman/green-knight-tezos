import { NetworkType as BeaconNetworkType } from '@airgap/beacon-sdk';
import { Steps } from 'antd';
import React, { FC, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/button/button';
import { Loader } from '@/components/loader/loader';
import { WalletController } from '@/services/wallets';
import { hasMessage } from '@/utils/common';

import './authorize.scss';
import { useCallback } from 'react';
import { useEffect } from 'react';

const { Step } = Steps;
const walletController = new WalletController();

const STEPS = [
  { title: 'Connect wallet' },
  { title: 'Sign data' },
  { title: 'Check wallet balance' },
  { title: 'Success!' },
];

export const AuthorizePage: FC = () => {
  const { ruleId } = useParams();

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'wait' | 'process' | 'finish' | 'error'>('wait');
  const [error, setError] = useState('');

  // useEffect(() => {
  //   walletController
  //     .loadActiveAccount()
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }, []);

  const redirect = useCallback(() => {
    setStep(4);
    setStatus('finish');
    const link = 'https://google.com';

    setTimeout(() => {
      // window.open(link)?.focus();
    }, 2000);
  }, [setStep, setStatus]);

  const checkWalletBalance = useCallback(() => {
    setStep(2);
    setStatus('process');
    setTimeout(() => {
      redirect();
    }, 3000);
  }, [setStep, setStatus, redirect]);

  const signTransaction = useCallback(() => {
    setStep(1);
    setStatus('process');
    setTimeout(() => {
      checkWalletBalance();
    }, 3000);
  }, [setStep, setStatus, checkWalletBalance]);

  const connectWallet = useCallback(async () => {
    try {
      setStep(0);
      setStatus('process');
      await walletController.connectWallet(true);
      signTransaction();
    } catch (e) {
      const outputArg = hasMessage(e) ? e.description : e;
      console.error(e);

      setStatus('error');
      setError(outputArg as string);
    }
  }, [setStep, setStatus, signTransaction]);

  const steps = useMemo(() => {
    return STEPS.map(({ title }, index) => ({
      title,
      className: 'authorize__step',
      subTitle: index === step && status === 'process' && <Loader />,
      description: index === step && status === 'error' && error,
    }));
  }, [step, status, error]);

  return (
    <div className="authorize">
      <h2 className="authorize__title">Authorize to get access</h2>

      <Steps current={step} status={status} direction="vertical" className="authorize__steps">
        {steps.map((step) => (
          <Step {...step} key={step.title} />
        ))}
      </Steps>

      <Button onClick={connectWallet}>Connect wallet</Button>
    </div>
  );
};
