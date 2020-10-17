import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

export default function usePostCallback<T>(
  endpoint: string,
  {
    params: providedParams,
  }: {
    params?: { [key: string]: string | number | void | null };
  } = {},
): {
  post: (data: T) => void;
  isSuccess: boolean | null;
  isLoading: boolean;
  error: Error | null;
} {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [post, setPost] = useState<(data: T) => void>(() => () =>
    // eslint-disable-next-line no-console
    console.warn(new Error('Attempting to post before initialization')),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const params = useMemo(
    () => providedParams,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    providedParams
      ? ([] as (string | number | void | null)[]).concat(
          ...Object.keys(providedParams),
          ...Object.values(providedParams),
        )
      : [providedParams],
  );

  useEffect(() => {
    setIsSuccess(null);
    setError(null);
    setIsLoading(false);
    let cleanup = false;
    let loading = false;
    const source = axios.CancelToken.source();
    const doPost = (data: T) => {
      if (loading || cleanup) {
        // eslint-disable-next-line no-console
        console.warn(
          'Attepmting to post new request before old one has finished',
        );
        return;
      }
      loading = true;
      setIsSuccess(null);
      setIsLoading(true);
      setError(null);
      axios
        .post(`/api/${endpoint}`, data, {
          cancelToken: source.token,
          params,
        })
        .then(() => {
          setIsSuccess(true);
        })
        .catch((err) => {
          if (!axios.isCancel(err) && !cleanup) {
            setIsSuccess(false);
            setError(err);
          }
        })
        .finally(() => {
          if (!cleanup) {
            setIsLoading(false);
            loading = false;
          }
        });
    };
    setPost(() => doPost);
    return () => {
      cleanup = true;
      source.cancel('Unmounting');
    };
  }, [endpoint, params]);

  return useMemo(
    () => ({
      post,
      isSuccess,
      isLoading,
      error,
    }),
    [post, isSuccess, isLoading, error],
  );
}
