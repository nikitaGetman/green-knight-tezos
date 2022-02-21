import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/button/button';
import { WalletController } from '@/services/wallets';

import { useCallback } from 'react';
import { checkUser } from '@/api/api';
import { AuthorizationSteps } from '@/components/authorization-steps/authorization-steps';
import { useSteps } from '@/hooks/useSteps';
import useFetch from '@/hooks/useFetch';
import { Loader } from '@/components/loader/loader';
import { RuleDataView } from '@/components/rule-data/rule-data';

import './authorize.scss';

const walletController = new WalletController();

const STEPS = [
  { title: 'Connect wallet' },
  { title: 'Sign data' },
  { title: 'Check wallet balance' },
  { title: 'Success!' },
];

export const AuthorizePage: FC = () => {
  const { ruleId } = useParams();
  const { steps, current, status, setCurrent, error, setStatus, setError, nextStep } = useSteps(STEPS);
  // Load rule data
  const ruleFetching = useFetch('/rule', { rule: ruleId || '' });

  // Restore connected wallet
  // useEffect(() => {
  //   walletController
  //     .loadActiveAccount()
  //     .then((account) => {
  //       setStatus()
  //     })
  //     .catch((e) => {
  //       console.error(e);
  //     });
  // }, []);

  const handleSuccess = useCallback(
    (payload) => {
      setStatus('process');
      const { href } = payload;

      setTimeout(() => {
        setStatus('finish');
        window.open(href);
      }, 2000);
    },
    [setStatus]
  );

  const checkWalletBalance = useCallback(() => {
    setStatus('process');
    const account = walletController.getAccountAddress();
    const signature = walletController.getSignature();
    const rule = ruleId || '';

    checkUser(account, signature, rule)
      .then((res) => {
        nextStep();
        handleSuccess(res);
      })
      .catch((e) => {
        setError(e);
      });
  }, [nextStep, setStatus, setError, handleSuccess, ruleId]);

  const signData = useCallback(() => {
    setStatus('process');
    walletController
      .requestSign()
      .then(() => {
        nextStep();
        checkWalletBalance();
      })
      .catch((e) => {
        setError(e);
      });
  }, [nextStep, setStatus, setError, checkWalletBalance]);

  const connectWallet = useCallback(() => {
    setStatus('process');
    walletController
      .connectWallet(true)
      .then(() => {
        nextStep();
        signData();
      })
      .catch((e) => {
        setError(e);
      });
  }, [nextStep, setStatus, setError, signData]);

  return (
    <div className="authorize">
      <h2 className="authorize__title">Authorize to get access</h2>

      {ruleFetching.isLoading && <Loader />}

      {ruleFetching.hasError && <span className="authorize__error">Incorrect URL</span>}

      {ruleFetching.data && (
        <>
          <RuleDataView {...ruleFetching.data} />
          <div className="authorize__steps">
            <AuthorizationSteps steps={steps} current={current} error={error} status={status} />
          </div>
          <Button onClick={connectWallet}>Connect wallet</Button>
        </>
      )}
    </div>
  );
};
