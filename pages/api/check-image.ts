import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imagePath } = req.query;

  if (!imagePath || typeof imagePath !== 'string') {
    return res.status(400).json({ error: 'Image path is required' });
  }

  try {
    // Remove leading slash and construct full path
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    const fullPath = path.join(process.cwd(), 'public', cleanPath);
    
    // Check if file exists
    const exists = fs.existsSync(fullPath);
    
    res.status(200).json({ exists });
  } catch (error) {
    console.error('Error checking image existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}