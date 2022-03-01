import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/button/button';
import { Form, Input, Checkbox } from 'antd';
import { Link } from 'react-router-dom';

import './create-link.scss';
import { TokenAutoComplete } from '@/components/token-auto-complete/token-auto-complete';
import { SecureLinkType, TokenType } from '@/types/links';
import { isFA12Token, isFA2Token } from '@/utils/tokens';
import { CreateLinkTokenBalance } from '@/components/create-link-token-balance/create-link-token-balance';
import useFetch from '@/hooks/useFetch';
import { createSecureLink } from '@/api/api';

const BASE_LINK = process.env.REACT_APP_BASE_FRONT_URL;

export const CreateLinkPage: FC = () => {
  const [form] = Form.useForm();
  const [token, setToken] = useState<TokenType[]>();
  const [isSeparateLink, setIsSeparateLink] = useState(false);

  const selectToken = useCallback(
    (token: TokenType[] | null) => {
      const sortedTokens = token?.sort((a, b) => parseInt(a.tokenId) - parseInt(b.tokenId));
      setToken(sortedTokens);
    },
    [setToken]
  );

  const isTokenFA12 = useMemo(() => isFA12Token(token), [token]);
  const isTokenFA2 = useMemo(() => isFA2Token(token), [token]);

  const handleSeparateLinkChange = useCallback((e: any) => setIsSeparateLink(e.target.checked), [setIsSeparateLink]);

  const trySubmitForm = useCallback(() => form.submit(), [form]);

  const createLinkRequest = useFetch<SecureLinkType>(createSecureLink);

  const handleSubmit = useCallback(
    (data: any) => {
      if (!token) return;

      const { title, linkType, link, minBalance } = data;

      const links = Object.entries(linkType).reduce(
        (acc: any[], [id, type]) => [
          ...acc,
          {
            linkType: type,
            tokenId: id,
            link: link[id],
            minBalance: minBalance[id] || 0,
          },
        ],
        []
      );

      const requestParams = { title, token, links, isSeparateLink };

      createLinkRequest.fetch(requestParams);
    },
    [token, isSeparateLink, createLinkRequest]
  );

  // scroll to top on link created
  useEffect(
    () => () => {
      try {
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    },
    [createLinkRequest.isDone]
  );

  return (
    <div className="create-link">
      <h2 className="create-link__title">Create secure link to resource to grant access for you loyal audience</h2>

      {createLinkRequest.isDone && (
        <div className="create-link__result">
          <div>Link is protected, for authorization use:</div>
          <div>
            <a href={`${BASE_LINK}/${createLinkRequest.data?.id}`} target="_blank" rel="noreferrer">
              {BASE_LINK}/<b>{createLinkRequest.data?.id}</b>
            </a>
          </div>
        </div>
      )}

      <div className={`create-link__form create-link__form--submitted-${createLinkRequest.isDone}`}>
        <Form
          layout="horizontal"
          labelCol={{ span: 7 }}
          form={form}
          onFinish={handleSubmit}
          requiredMark={false}
          size="large"
          scrollToFirstError={true}
        >
          <Form.Item
            name="title"
            label="Title"
            tooltip="Title that users will see when authorizing"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Some secret resource" />
          </Form.Item>

          <Form.Item
            label="Token"
            tooltip="Name, symbol or contract address of FA1.2 or FA2 token"
            rules={[
              { validator: () => (token ? Promise.resolve() : Promise.reject(new Error('Please choose token'))) },
            ]}
          >
            <TokenAutoComplete onSelect={selectToken} />
          </Form.Item>

          {token ? (
            <>
              <Form.Item wrapperCol={{ offset: 7 }}>
                <div className="create-link__token-description">
                  {isTokenFA12 && (
                    <>
                      <div>FA1.2 token</div>
                      <div>You can specify minimal balance of tokens for access</div>
                    </>
                  )}
                  {isTokenFA2 && (
                    <>
                      <div>FA2 token</div>
                      <div className="create-link__separate-text">
                        You can specify a separate link for each token ID or use one link for all
                      </div>
                      <Checkbox onChange={handleSeparateLinkChange} checked={isSeparateLink}>
                        Separate links (<b>{token.length}</b> tokenId found)
                      </Checkbox>
                    </>
                  )}
                </div>
              </Form.Item>

              {isSeparateLink ? (
                token.map((t) => <CreateLinkTokenBalance token={t} withHeader={true} key={t.tokenId} />)
              ) : (
                <CreateLinkTokenBalance token={token[0]} />
              )}

              {/* <Form.Item
                name="hasAddedTelegramBot"
                valuePropName="checked"
                wrapperCol={{ offset: 7 }}
                rules={[{ required: true, message: 'Add telegram bot, if you added telegram links' }]}
              >
                <Checkbox>
                  I have added GreenKnight telegram bot to the telegram channels.
                  <Link to="/telegram-bot" target="_blank">
                    Instruction
                  </Link>
                </Checkbox>
              </Form.Item> */}

              <Form.Item className="create-link__submit">
                <Button type="primary" onClick={trySubmitForm} loading={createLinkRequest.isLoading}>
                  Create secure link
                </Button>
              </Form.Item>
            </>
          ) : (
            <div className="create-link__tip">select token</div>
          )}
        </Form>
      </div>
    </div>
  );
};
