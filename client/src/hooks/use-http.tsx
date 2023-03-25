import { useState, useCallback, useRef, useEffect } from 'react';

interface SendRequest {
  url: string;
  abortController: AbortController;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string | null;
  headers?: {
    [header: string]: string;
  };
}

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const activeRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async ({
      url,
      abortController,
      method = 'GET',
      body = null,
      headers = {},
    }: SendRequest) => {
      setIsLoading(true);
      activeRequests.current.push(abortController);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: abortController.signal,
        });

        const data = await response.json();

        if (!response.ok) setError(data.message);

        setIsLoading(false);
        return data;
      } catch (error: any) {
        if (!abortController.signal.aborted) {
          setError(error.message);
          setIsLoading(false);
          throw error;
        }
      }
    },
    []
  );

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    return () => {
      activeRequests.current.forEach((abortController) =>
        abortController.abort()
      );
    };
  }, []);

  return { sendRequest, isLoading, error, clearError };
};
