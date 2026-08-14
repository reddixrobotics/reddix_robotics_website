import { useState, useCallback } from 'react';
import type { AsyncState } from '@/types';

/**
 * Wraps an async function in loading/success/error state management.
 *
 * @example
 * const { state, execute } = useAsync(fetchRobots);
 * await execute();
 * if (state.status === 'success') console.log(state.data);
 */
export function useAsync<T, Args extends unknown[]>(
  asyncFn: (...args: Args) => Promise<T>,
): {
  state: AsyncState<T>;
  execute: (...args: Args) => Promise<void>;
  reset: () => void;
} {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ status: 'loading', data: null, error: null });
      try {
        const data = await asyncFn(...args);
        setState({ status: 'success', data, error: null });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        setState({ status: 'error', data: null, error: message });
      }
    },
    [asyncFn],
  );

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  return { state, execute, reset };
}
