import { useState, useEffect, useCallback } from 'react';

const useFetch = <T>(
  fetchMethod: (params: any) => Promise<any>,
  initialParams: Record<string, any> = {},
  forceStart = false
) => {
  const [params, updateParams] = useState(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();
  const [hasError, setHasError] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [refetchIndex, setRefetchIndex] = useState(0);

  const refetch = () => setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1);

  const fetch = useCallback(
    async (...restParams) => {
      setIsLoading(true);
      try {
        const response = await fetchMethod({ ...params, ...restParams });

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
        setIsDone(true);
      }
    },
    [setIsLoading, fetchMethod, params, setData, setHasError, setErrorMessage]
  );

  useEffect(() => {
    if (!forceStart) {
      return;
    }

    fetch();
  }, [fetch, forceStart, refetchIndex]);

  return { fetch, data, isLoading, isDone, hasError, errorMessage, updateParams, refetch };
};

export default useFetch;
