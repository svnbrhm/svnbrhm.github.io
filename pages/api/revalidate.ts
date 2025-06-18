import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  revalidated: boolean;
  message: string;
  paths?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ 
      revalidated: false, 
      message: 'Method not allowed. Use POST.' 
    });
    return;
  }

  try {
    // Check for secret token to prevent unauthorized revalidation
    const { secret, paths, type } = req.body;
    
    // Verify the secret token (you should set this in your environment variables)
    if (secret !== process.env.REVALIDATION_SECRET) {
      return res.status(401).json({ 
        revalidated: false, 
        message: 'Invalid token' 
      });
    }

    const pathsToRevalidate: string[] = [];

    // Determine which paths to revalidate based on the type
    switch (type) {
      case 'crews':
      case 'all':
        // Revalidate main pages
        pathsToRevalidate.push('/');
        pathsToRevalidate.push('/crews');
        break;
      
      case 'crew':
        // Revalidate specific crew page if crew ID is provided
        if (paths && Array.isArray(paths)) {
          paths.forEach(path => {
            if (typeof path === 'string') {
              pathsToRevalidate.push(path);
            }
          });
        }
        // Also revalidate crew listing pages
        pathsToRevalidate.push('/crews');
        pathsToRevalidate.push('/');
        break;
      
      case 'custom':
        // Revalidate custom paths provided in the request
        if (paths && Array.isArray(paths)) {
          paths.forEach(path => {
            if (typeof path === 'string') {
              pathsToRevalidate.push(path);
            }
          });
        }
        break;
      
      default:
        return res.status(400).json({
          revalidated: false,
          message: 'Invalid revalidation type. Use: crews, crew, custom, or all'
        });
    }

    if (pathsToRevalidate.length === 0) {
      return res.status(400).json({
        revalidated: false,
        message: 'No valid paths provided for revalidation'
      });
    }

    // Revalidate all specified paths
    const revalidationPromises = pathsToRevalidate.map(async (path) => {
      try {
        await res.revalidate(path);
        return { path, success: true };
      } catch (err) {
        console.error(`Failed to revalidate ${path}:`, err);
        return { path, success: false, error: err };
      }
    });

    const results = await Promise.allSettled(revalidationPromises);
    const successfulPaths = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => (result as PromiseFulfilledResult<any>).value.path);
    
    const failedPaths = results
      .filter(result => result.status === 'rejected' || 
        (result.status === 'fulfilled' && !result.value.success))
      .map(result => {
        if (result.status === 'rejected') {
          return { path: 'unknown', error: result.reason };
        }
        return (result as PromiseFulfilledResult<any>).value;
      });

    if (failedPaths.length > 0) {
      console.warn('Some paths failed to revalidate:', failedPaths);
    }

    res.json({
      revalidated: true,
      message: `Successfully revalidated ${successfulPaths.length} of ${pathsToRevalidate.length} paths`,
      paths: successfulPaths
    });

  } catch (err) {
    console.error('Revalidation error:', err);
    res.status(500).json({
      revalidated: false,
      message: 'Error revalidating pages',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}