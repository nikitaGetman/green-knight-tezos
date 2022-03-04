import React, { FC, useMemo, useState } from 'react';
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

import { LinkType, SecureLinkType } from '@/types/links';
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
  const [links, setLinks] = useState<LinkType[]>([]);

  const fetchLinkRequest = useFetch<SecureLinkType>(fetchLinkData, { link: linkId || '' }, true);
  const isUrlIncorrect = useMemo(
    () => fetchLinkRequest.hasError || (fetchLinkRequest.data && !fetchLinkRequest.data.title),
    [fetchLinkRequest]
  );

  const tokenName =
    fetchLinkRequest?.data?.token?.metadata?.name || fetchLinkRequest?.data?.token?.metadata?.symbol || '';

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
    (links) => {
      setStatus('process');
      setLinks(links);
      if (links.length === 1) {
        const { link } = links[0];

        setTimeout(() => {
          setStatus('finish');
          window.open(link);
        }, 2000);
      }
    },
    [setStatus, setLinks]
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
          handleSuccess(res.data.links);
        } else {
          setError(res.data.message);
        }
      })
      .catch((e) => {
        setError(e?.response?.data || e?.message);
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

      {links.length > 0 && (
        <div className="authorize__links">
          <h4 className="authorize__link-title">You can access to:</h4>
          {links.map((link, index) => (
            <span>
              {`${index + 1}. `}
              <a className="authorize__link" href={link.link} target="_blank" rel="noreferrer" key={index}>
                {link.link}
              </a>
              {!!link.minBalance && `- ${link.minBalance} ${tokenName}`}
            </span>
          ))}
        </div>
      )}

      {fetchLinkRequest.data && (
        <div className={`authorize__data authorize__data--hidden-${links.length > 0}`}>
          <LinkDataView {...fetchLinkRequest.data} />
          <div className="authorize__steps">
            <AuthorizationSteps steps={steps} current={current} error={error} status={status} />
          </div>
          <Button onClick={connectWallet}>Connect wallet</Button>
        </div>
      )}
    </div>
  );
};
