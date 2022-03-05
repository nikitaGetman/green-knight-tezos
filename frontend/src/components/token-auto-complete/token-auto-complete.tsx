import React, { FC, useCallback, useMemo, useState } from 'react';
import { AutoComplete } from 'antd';
import { useDebounce } from '@/hooks/useDebounce';
import { searchToken, searchTokens } from '@/api/api';
import { formatIpfsUrl } from '@/utils/common';

import './token-auto-complete.scss';
import useFetch from '@/hooks/useFetch';
import { Loader } from '../loader/loader';

type TokenDataType = {
  id: number;
  metadata?: any;
  contract: { address: string };
};

const renderToken = (token: TokenDataType) => {
  const { metadata } = token;
  const icon = metadata && formatIpfsUrl(metadata.image || metadata.thumbnailUri || metadata.displayUri || '');
  const title = metadata?.name || '';
  const symbol = metadata?.symbol || '';
  const contract = token.contract.address;
  const shouldShowContract = !symbol && !title;

  return (
    <div className="link-option">
      {icon && <span className="link-option__icon" style={{ backgroundImage: `url(${icon})` }}></span>}
      {symbol && <span className="link-option__symbol">{symbol}</span>}
      {title && <span className="link-option__title">{title}</span>}
      {shouldShowContract && <span className="link-option__contract">{contract}</span>}
    </div>
  );
};

const renderSearchOptions = (options: TokenDataType[]) => {
  return options.map((option: any) => {
    return {
      value: String(option.id),
      label: renderToken(option),
    };
  });
};

type Props = {
  onSelect: (val: any) => void;
};
export const TokenAutoComplete: FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<TokenDataType[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenDataType>();
  const searchTokensRequest = useFetch(searchTokens);
  const debouncedTokenSearch = useDebounce(searchTokensRequest.fetch, 300);
  const searchTokenRequest = useFetch(searchToken);

  const onSearch = useCallback(
    (searchText: string) => {
      setSearch(searchText);

      if (!searchText) {
        setOptions([]);
        return;
      }
      debouncedTokenSearch({ q: searchText }).then((res) => {
        setOptions(res.list || []);
      });
    },
    [debouncedTokenSearch, setOptions, setSearch]
  );

  const renderedOptions = useMemo(() => renderSearchOptions(options), [options]);

  const handleSelect = useCallback(
    (id: any) => {
      const token = options.find((op) => String(op.id) === id);
      const contract = token?.contract.address || '';
      setSelectedToken(token);

      if (contract) {
        searchTokenRequest.fetch({ contract }).then((response) => {
          onSelect(response);
        });
      }
    },
    [options, setSelectedToken, searchTokenRequest, onSelect]
  );
  const handleClear = useCallback(() => {
    setSearch('');
    setOptions([]);
    setSelectedToken(undefined);
    onSelect(null);
  }, [setSearch, setOptions, setSelectedToken, onSelect]);

  return (
    <div className="token-complete">
      <AutoComplete
        options={renderedOptions}
        placeholder="Token name or contract address"
        notFoundContent={
          (searchTokensRequest.isLoading && 'Loading...') || (search && 'Token not found') || 'Type something to search'
        }
        onSearch={onSearch}
        onSelect={handleSelect}
        allowClear={true}
        onClear={handleClear}
      >
        {selectedToken && <div className="token-complete__selection">{renderToken(selectedToken)}</div>}
      </AutoComplete>
      {searchTokenRequest.isLoading && <Loader />}
    </div>
  );
};
