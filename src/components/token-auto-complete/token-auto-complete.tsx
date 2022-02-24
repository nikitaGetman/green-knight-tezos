import React, { FC, useCallback, useMemo, useState } from 'react';
import { AutoComplete, Input } from 'antd';
import { useDebounce } from '@/hooks/useDebounce';
import { searchToken, searchTokens } from '@/api/api';
import { formatIpfsUrl } from '@/utils/common';

import './token-auto-complete.scss';
import useFetch from '@/hooks/useFetch';

const renderToken = (token: TokenData) => {
  const { metadata } = token;
  const icon = formatIpfsUrl(metadata.image || metadata.thumbnailUri || metadata.displayUri || '');
  const title = metadata.name || '';
  const symbol = metadata.symbol || '';

  return (
    <div className="link-option">
      {icon && <span className="link-option__icon" style={{ backgroundImage: `url(${icon})` }}></span>}
      {symbol && <span className="link-option__symbol">{symbol}</span>}
      {title && <span className="link-option__title">{title}</span>}
    </div>
  );
};

const renderSearchOptions = (options: TokenData[]) => {
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
type TokenData = {
  id: number;
  metadata?: any;
  contract: { address: string };
};

export const TokenAutoComplete: FC<Props> = ({ onSelect }) => {
  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<TokenData[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenData>();
  const searchTokensRequest = useFetch(searchTokens);
  const debouncedTokenSearch = useDebounce(searchTokensRequest.fetch, 300);

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

  const handleSelect = (id: any) => {
    const token = options.find((op) => String(op.id) === id);
    const contract = token?.contract.address || '';
    setSelectedToken(token);

    if (contract) {
      searchToken({ contract }).then((response) => {
        onSelect(response.data);
      });
    }
  };
  const handleClear = () => {
    setSearch('');
    setOptions([]);
    setSelectedToken(undefined);
  };

  return (
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
  );
};
