export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const errorData = req.body;
  
  // Log error to console (will appear in Vercel logs)
  console.error('Client error reported:', {
    timestamp: errorData.timestamp,
    url: errorData.url,
    error: errorData.error,
    stack: errorData.stack
  });

  // Here you could send to external monitoring service
  // Example: Sentry, LogRocket, or custom analytics

  res.status(200).json({ message: 'Error reported successfully' });
}