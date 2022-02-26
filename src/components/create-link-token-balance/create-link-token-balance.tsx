import React, { FC, useCallback, useMemo, useState } from 'react';

import { Form, Input, Radio } from 'antd';
import { formatIpfsUrl } from '@/utils/common';
import { validateLink } from '@/utils/validators';
import { TokenType } from '@/types/links';

import './create-link-token-balance.scss';

const PLACEHOLDERS: any = {
  http: { link: 'https://greenknight.com/secret' },
  telegram: { link: 'https://t.me/GreenKnight_secret' },
};

type CreateLinkTokenBalanceProps = {
  token: TokenType;
  withHeader?: boolean;
};

export const CreateLinkTokenBalance: FC<CreateLinkTokenBalanceProps> = ({ token, withHeader = false }) => {
  const [linkType, setLinkType] = useState('http');
  const { tokenId, metadata, totalSupply } = token;
  const decimals = useMemo(() => parseInt(metadata.decimals) || 0, [metadata]);
  const image = useMemo(
    () => formatIpfsUrl(metadata.image || metadata.thumbnailUri || metadata.displayUri || metadata.artifactUri || ''),
    [metadata]
  );
  const supplyNumber = useMemo(() => parseInt(totalSupply || '0') / 10 ** decimals, [totalSupply, decimals]);
  const hasMinBalance = useMemo(() => supplyNumber > 1 || decimals > 0, [supplyNumber, decimals]);

  const handleLinkTypeChange = useCallback(
    (e: any) => {
      setLinkType(e.target.value);
    },
    [setLinkType]
  );

  return (
    <>
      {withHeader && (
        <Form.Item wrapperCol={{ offset: 7 }}>
          <div className="link-token-balance__header">
            <div className="link-token-balance__icon" style={{ backgroundImage: `url(${image})` }} />
            <div className="link-token-balance__data">
              <div>
                Token ID: <b>{tokenId}</b>
              </div>
              <div>
                Supply: <b>{supplyNumber}</b>
              </div>
            </div>
          </div>
        </Form.Item>
      )}
      {hasMinBalance && (
        <Form.Item
          label="Min balance"
          name={['minBalance', tokenId]}
          tooltip={`Minimal balance of tokens, \
        if not specified then any quantity will be sufficient, decimals is ${decimals}`}
        >
          <Input placeholder="any" type="number" />
        </Form.Item>
      )}

      <Form.Item label="Link type" name={['linkType', tokenId]} initialValue={'http'}>
        <Radio.Group optionType="button" buttonStyle="outline" onChange={handleLinkTypeChange} value={linkType}>
          <Radio.Button value="http">HTTP</Radio.Button>
          <Radio.Button value="telegram">Telegram</Radio.Button>
          <Radio.Button value="discord" disabled>
            Discord
          </Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name={['link', tokenId]}
        label="Link"
        tooltip="Link to resource, which you want to protect"
        rules={[
          {
            validator: (_, value) => {
              if (!value) return Promise.reject(new Error('Link is required'));
              return validateLink(value, linkType) ? Promise.resolve() : Promise.reject(new Error('Incorrect link'));
            },
          },
        ]}
      >
        <Input placeholder={PLACEHOLDERS[linkType].link} />
      </Form.Item>
    </>
  );
};
