import React, { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/button/button';
import { WalletController } from '@/services/wallets';

import { useCallback } from 'react';
import { checkUser, fetchLinkData } from '@/api/api';
import { AuthorizationSteps } from '@/components/authorization-steps/authorization-steps';
import { useSteps } from '@/hooks/useSteps';
import useFetch from '@/hooks/useFetch';
import { Loader } from '@/components/loader/loader';
import { LinkDataView } from '@/components/link-data/link-data';

import { LinkType } from '@/types/links';
import './authorize.scss';

const walletController = new WalletController();

const STEPS = [
  { title: 'Connect wallet' },
  { title: 'Sign data' },
  { title: 'Check wallet balance' },
  { title: 'Success!' },
];

export const AuthorizePage: FC = () => {
  const { linkId } = useParams();
  const { steps, current, status, error, setCurrent, setStatus, setError, nextStep } = useSteps(STEPS);

  const fetchLinkRequest = useFetch<LinkType>(fetchLinkData, { link: linkId || '' }, true);
  const isUrlIncorrect = useMemo(
    () => fetchLinkRequest.hasError || (fetchLinkRequest.data && !fetchLinkRequest.data.title),
    [fetchLinkRequest]
  );

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
    const account = walletController.getAccountAddress() || '';
    const signature = walletController.getSignature() || '';
    const link = linkId || '';

    checkUser({ account, signature, link })
      .then((res) => {
        if (res.data.status === 'ok') {
          nextStep();
          handleSuccess(res.data);
        } else {
          setError(res.data.message);
        }
      })
      .catch((e) => {
        setError(e?.message);
      });
  }, [nextStep, setStatus, setError, handleSuccess, linkId]);

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
    setCurrent(0);
    setError('');
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
  }, [nextStep, setStatus, setError, setCurrent, signData]);

  return (
    <div className="authorize">
      <h2 className="authorize__title">Connect wallet to get access</h2>

      {fetchLinkRequest.isLoading && <Loader />}

      {isUrlIncorrect && (
        <span className="authorize__error">
          404 Link not found - <span className="authorize__error-link">/{linkId}</span>
        </span>
      )}

      {fetchLinkRequest.data && fetchLinkRequest.data.type && (
        <>
          <LinkDataView {...fetchLinkRequest.data} />
          <div className="authorize__steps">
            <AuthorizationSteps steps={steps} current={current} error={error} status={status} />
          </div>
          <Button onClick={connectWallet}>Connect wallet</Button>
        </>
      )}
    </div>
  );
};
