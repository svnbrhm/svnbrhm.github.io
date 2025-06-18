/**
 * Client-side utility for triggering on-demand revalidation
 */
import React from 'react';

export interface RevalidationOptions {
  type: 'crews' | 'crew' | 'custom' | 'all';
  paths?: string[];
  secret?: string;
}

export interface RevalidationResponse {
  revalidated: boolean;
  message: string;
  paths?: string[];
  error?: string;
}

/**
 * Trigger on-demand revalidation of ISR pages
 * @param options - Revalidation configuration
 * @returns Promise with revalidation result
 */
export async function triggerRevalidation(
  options: RevalidationOptions
): Promise<RevalidationResponse> {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: options.type,
        paths: options.paths,
        secret: options.secret || process.env.NEXT_PUBLIC_REVALIDATION_SECRET,
      }),
    });

    const data: RevalidationResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Revalidation failed');
    }

    return data;
  } catch (error) {
    console.error('Revalidation error:', error);
    throw error;
  }
}

/**
 * Revalidate all crew-related pages
 * @param secret - Revalidation secret token
 */
export async function revalidateAllCrews(secret?: string): Promise<RevalidationResponse> {
  return triggerRevalidation({
    type: 'crews',
    secret,
  });
}

/**
 * Revalidate specific crew page and related pages
 * @param crewId - The crew ID to revalidate
 * @param secret - Revalidation secret token
 */
export async function revalidateCrew(crewId: string, secret?: string): Promise<RevalidationResponse> {
  return triggerRevalidation({
    type: 'crew',
    paths: [`/crews/${crewId}`],
    secret,
  });
}

/**
 * Revalidate custom paths
 * @param paths - Array of paths to revalidate
 * @param secret - Revalidation secret token
 */
export async function revalidateCustomPaths(paths: string[], secret?: string): Promise<RevalidationResponse> {
  return triggerRevalidation({
    type: 'custom',
    paths,
    secret,
  });
}

/**
 * Revalidate all pages (use with caution)
 * @param secret - Revalidation secret token
 */
export async function revalidateAll(secret?: string): Promise<RevalidationResponse> {
  return triggerRevalidation({
    type: 'all',
    secret,
  });
}

/**
 * Hook for React components to handle revalidation with loading states
 */
export function useRevalidation() {
  const [isRevalidating, setIsRevalidating] = React.useState(false);
  const [lastResult, setLastResult] = React.useState<RevalidationResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const revalidate = async (options: RevalidationOptions) => {
    setIsRevalidating(true);
    setError(null);
    
    try {
      const result = await triggerRevalidation(options);
      setLastResult(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Revalidation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsRevalidating(false);
    }
  };

  return {
    revalidate,
    isRevalidating,
    lastResult,
    error,
    // Convenience methods
    revalidateAllCrews: (secret?: string) => revalidate({ type: 'crews', secret }),
    revalidateCrew: (crewId: string, secret?: string) => 
      revalidate({ type: 'crew', paths: [`/crews/${crewId}`], secret }),
    revalidateCustomPaths: (paths: string[], secret?: string) => 
      revalidate({ type: 'custom', paths, secret }),
  };
}