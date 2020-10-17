import React from 'react';
import useApiData from '../hooks/useApiData';

export default function NotIndex(): JSX.Element {
  const { data, isLoading, error } = useApiData('isConfigured');
  return (
    <div>
      {isLoading && 'Loading...'}
      {error && error.message}
      {data && data.v}
    </div>
  );
}
