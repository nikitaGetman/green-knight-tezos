import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
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

export const AuthorizePage: FC<{ linkIdProp?: string }> = ({ linkIdProp }) => {
  const { linkId: linkIdParam } = useParams();
  const search = window.location.search;
  const linkIdQuery = new URLSearchParams(search).get('linkId');
  const linkId = linkIdParam || linkIdProp || linkIdQuery;
  const { steps, current, status, error, setCurrent, setStatus, setError, nextStep } = useSteps(STEPS);
  const [links, setLinks] = useState<LinkType[]>([]);
  const isLoadingActiveAccount = useRef(false);

  const fetchLinkRequest = useFetch<SecureLinkType>(fetchLinkData, { link: linkId || '' }, true);
  const isUrlIncorrect = useMemo(
    () => fetchLinkRequest.hasError || (fetchLinkRequest.data && !fetchLinkRequest.data.title),
    [fetchLinkRequest]
  );

  const tokenName =
    fetchLinkRequest?.data?.token?.metadata?.name || fetchLinkRequest?.data?.token?.metadata?.symbol || '';

  const handleSuccess = useCallback(
    (links) => {
      setStatus('process');
      setLinks(links);

      setTimeout(() => {
        if (links.length === 1) {
          const { link } = links[0];
          setStatus('finish');
          if (!linkIdQuery) {
            // if not plugin usage, then redirect
            window.open(link);
          }
        }
      }, 2000);
    },
    [setStatus, setLinks, linkIdQuery]
  );

  const checkWalletBalance = useCallback(() => {
    setStatus('process');
    const account = walletController.getAccountAddress() || '';
    const signature = walletController.getSignature() || '';
    const link = linkId || '';

    checkUser({ account, signature, link })
      .then((res) => {
        if (res.data.status === 'ok') {
          window.top?.postMessage('Green Knight plugin: check success', '*');
          nextStep();
          handleSuccess(res.data.links);
        } else {
          window.top?.postMessage('Green Knight plugin: error - Insufficient balance', '*');
          setError(res.data.message);
        }
      })
      .catch((e) => {
        window.top?.postMessage('Green Knight plugin: error', '*');
        setError(e?.response?.data || e?.message);
      });
  }, [nextStep, setStatus, setError, handleSuccess, linkId]);

  const signData = useCallback(() => {
    setStatus('process');
    walletController
      .requestSign()
      .then(() => {
        window.top?.postMessage('Green Knight plugin: data signed', '*');
        nextStep();
        checkWalletBalance();
      })
      .catch((e) => {
        window.top?.postMessage('Green Knight plugin: error', '*');
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
        window.top?.postMessage('Green Knight plugin: wallet connected', '*');
        nextStep();
        signData();
      })
      .catch((e) => {
        window.top?.postMessage('Green Knight plugin: error', '*');
        setError(e);
      });
  }, [nextStep, setStatus, setError, setCurrent, signData]);

  // Restore connected wallet
  // useEffect(() => {
  //   if (!isLoadingActiveAccount.current) {
  //     isLoadingActiveAccount.current = true;

  //     walletController
  //       .loadActiveAccount()
  //       .then((account) => {
  //         if (account) {
  //           nextStep();
  //           nextStep();
  //           checkWalletBalance();
  //           console.log('try to sign data');
  //         }
  //       })
  //       .catch((e) => {
  //         console.error(e);
  //       });
  //   }
  // }, [checkWalletBalance, nextStep]);

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
            <span key={index}>
              {`${index + 1}. `}
              <a className="authorize__link" href={link.link} target="_blank" rel="noreferrer" key={index}>
                {link.link}
              </a>
              {!!link.minBalance && ` - ${link.minBalance} ${tokenName} tokens`}
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
          <Button type="primary" onClick={connectWallet}>
            Connect wallet
          </Button>
        </div>
      )}
    </div>
  );
};
