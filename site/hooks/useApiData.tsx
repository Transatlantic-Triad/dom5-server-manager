import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

import type ApiIsConfigured from '../pages/api/isConfigured';
import type ApiMaps from '../pages/api/maps';

type GetAPIRes<A> = A extends (...args: never[]) => Promise<infer T | void>
  ? T
  : never;

type Endpoints = {
  isConfigured: GetAPIRes<typeof ApiIsConfigured>;
  maps: GetAPIRes<typeof ApiMaps>;
};

export default function useApiData<T extends keyof Endpoints>(
  endpoint: T,
  opts?: {
    interval?: number;
    params?: { [key: string]: string | number | void | null };
  },
): {
  data: Endpoints[T] | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
};
export default function useApiData(
  endpoint: null,
  opts?: {
    interval?: number;
    params?: { [key: string]: string | number | void | null };
  },
): { data: null; isLoading: boolean; error: Error | null; refresh: () => void };
export default function useApiData<T extends null | keyof Endpoints>(
  endpoint: T,
  {
    interval,
    params: providedParams,
  }: {
    interval?: number;
    params?: { [key: string]: string | number | void | null };
  } = {},
): {
  data: (T extends keyof Endpoints ? Endpoints[T] : never) | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  type DataType = (T extends keyof Endpoints ? Endpoints[T] : never) | null;
  const [data, setData] = useState<DataType>(null);
  const [error, setError] = useState<Error | null>(null);
  const [refresh, setRefresh] = useState<() => void>(() => () =>
    // eslint-disable-next-line no-console
    console.warn(new Error('Running refresh before initialization')),
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
    setData(null);
    setError(null);
  }, [endpoint, params]);

  useEffect(() => {
    setIsLoading(false);
    if (endpoint == null) {
      setRefresh(() => () => {
        // eslint-disable-next-line no-console
        console.warn(new Error('Running refresh on null endpoint is a NOP'));
      });
      return undefined;
    }
    let cleanup = false;
    let loading = false;
    let refreshTimeout: null | number;
    const source = axios.CancelToken.source();
    const doRefresh = () => {
      if (loading || cleanup) return;
      loading = true;
      if (refreshTimeout != null) {
        clearTimeout(refreshTimeout);
        refreshTimeout = null;
      }
      setIsLoading(true);
      setError(null);
      axios
        .get(`/api/${endpoint}`, {
          cancelToken: source.token,
          params,
        })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          if (!axios.isCancel(err) && !cleanup) {
            setError(err);
          }
        })
        .finally(() => {
          if (!cleanup) {
            setIsLoading(false);
            loading = false;
            if (interval != null && refreshTimeout == null) {
              refreshTimeout = window.setTimeout(doRefresh, interval * 1000);
            }
          }
        });
    };
    setRefresh(() => doRefresh);
    doRefresh();
    return () => {
      cleanup = true;
      source.cancel('Unmounting');
      if (refreshTimeout != null) clearTimeout(refreshTimeout);
    };
  }, [endpoint, interval, params]);

  return useMemo(
    () => ({
      data,
      refresh,
      isLoading,
      error,
    }),
    [data, refresh, isLoading, error],
  );
}
