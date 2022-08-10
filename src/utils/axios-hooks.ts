import React, { useState } from 'react';
import { AxiosResponse, AxiosError } from 'axios';

export const useMutation = <D, V extends any = {}>(queryFunc: (variables?: V) => Promise<AxiosResponse<D>>, options?: { onSuccess?: (data: D, variables?: V) => void, onError?: (err: AxiosError) => void }) => {
  const [response, setResponse] = useState<D>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setloading] = useState(false);

  const mutate = (variables: V) => {
    setloading(true);
    queryFunc(variables)
      .then((res) => {
        setResponse(res.data);
        if (options && options.onSuccess) {
          options.onSuccess(res.data, variables)
        }
      })
      .catch((err) => {
        setError(err);
        if (options && options.onError) {
          options.onError(err)
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { mutate, response, error, loading };
};

export const useQuery = <D, V = {}>(queryFunc: (variables?: V) => Promise<AxiosResponse<D>>, options?: { onSuccess?: (data: D, variables?: V) => void, onError?: (err: AxiosError) => void }) => {
  const [response, setResponse] = useState<D>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setloading] = useState(false);

  const query = (variables?: V) => {
    setloading(true);
    queryFunc(variables)
      .then((res) => {
        setResponse(res.data);
        if (options && options.onSuccess) {
          options.onSuccess(res.data, variables)
        }
      })
      .catch((err) => {
        setError(err);
        if (options && options.onError) {
          options.onError(err)
        }
      })
      .finally(() => {
        setloading(false);
      });
  };

  return { query, response, error, loading };
};

