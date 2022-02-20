import client from '@/api/client';
import { useState, useEffect, useCallback } from 'react';

import data from '@/api/mocks/data.json';

const MOCK_DATA: any = data;

const useFetch = (initialUrl: string, initialParams: Record<string, string> = {}, skip = false) => {
  const [url, updateUrl] = useState(initialUrl);
  const [params, updateParams] = useState(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () => setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      // const response = await client.get(url, { params });
      const response = { status: 200, data: MOCK_DATA[url] };
      console.log(url, params, response);

      if (response.status === 200) {
        setData(response.data);
      } else {
        setHasError(true);
        setErrorMessage(response.data);
      }
    } catch (err: any) {
      setHasError(true);
      setErrorMessage(err?.message);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, url, params, setData, setHasError, setErrorMessage]);

  useEffect(() => {
    if (skip) {
      return;
    }

    fetch();
  }, [fetch, skip, refetchIndex]);

  return { fetch, data, isLoading, hasError, errorMessage, updateUrl, updateParams, refetch };
};

export default useFetch;
