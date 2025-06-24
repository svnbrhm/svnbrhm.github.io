import React, { useState } from 'react';
import { useRevalidation } from '../../lib/revalidation';
import MockDataMonitor from './MockDataMonitor';

interface RevalidationPanelProps {
  secret?: string;
  className?: string;
}

const RevalidationPanel: React.FC<RevalidationPanelProps> = ({ 
  secret, 
  className = '' 
}) => {
  const { 
    revalidate, 
    isRevalidating, 
    lastResult, 
    error,
    revalidateAllCrews,
    revalidateCrew,
    revalidateCustomPaths
  } = useRevalidation();
  
  const [customPath, setCustomPath] = useState('');
  const [crewId, setCrewId] = useState('');
  const [secretInput, setSecretInput] = useState(secret || '');

  const handleRevalidateAll = async () => {
    try {
      await revalidateAllCrews(secretInput);
    } catch (err) {
      console.error('Failed to revalidate all crews:', err);
    }
  };

  const handleRevalidateCrew = async () => {
    if (!crewId.trim()) {
      alert('Please enter a crew ID');
      return;
    }
    
    try {
      await revalidateCrew(crewId.trim(), secretInput);
    } catch (err) {
      console.error('Failed to revalidate crew:', err);
    }
  };

  const handleRevalidateCustom = async () => {
    if (!customPath.trim()) {
      alert('Please enter a path');
      return;
    }
    
    const paths = customPath.split(',').map(p => p.trim()).filter(p => p);
    
    try {
      await revalidateCustomPaths(paths, secretInput);
    } catch (err) {
      console.error('Failed to revalidate custom paths:', err);
    }
  };

  const handleRevalidateHomepage = async () => {
    try {
      await revalidateCustomPaths(['/'], secretInput);
    } catch (err) {
      console.error('Failed to revalidate homepage:', err);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        🔄 On-Demand Revalidation
      </h3>
      
      <div className="space-y-4">
        {/* Secret Token Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Revalidation Secret
          </label>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            placeholder="Enter revalidation secret"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={handleRevalidateHomepage}
            disabled={isRevalidating || !secretInput}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRevalidating ? 'Revalidating...' : 'Revalidate Homepage'}
          </button>
          
          <button
            onClick={handleRevalidateAll}
            disabled={isRevalidating || !secretInput}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRevalidating ? 'Revalidating...' : 'Revalidate All Crews'}
          </button>
        </div>

        {/* Specific Crew Revalidation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Revalidate Specific Crew
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={crewId}
              onChange={(e) => setCrewId(e.target.value)}
              placeholder="Enter crew ID (e.g., rec123abc)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRevalidateCrew}
              disabled={isRevalidating || !secretInput || !crewId.trim()}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Revalidate
            </button>
          </div>
        </div>

        {/* Custom Path Revalidation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Revalidate Custom Paths
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              placeholder="Enter paths (comma-separated, e.g., /crews, /crews/rec123)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRevalidateCustom}
              disabled={isRevalidating || !secretInput || !customPath.trim()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Revalidate
            </button>
          </div>
        </div>

        {/* Status Display */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {lastResult && !error && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            <strong>Success:</strong> {lastResult.message}
            {lastResult.paths && lastResult.paths.length > 0 && (
              <div className="mt-2">
                <strong>Revalidated paths:</strong>
                <ul className="list-disc list-inside mt-1">
                  {lastResult.paths.map((path, index) => (
                    <li key={index} className="text-sm">{path}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mock Data Monitor */}
      <div className="mt-6">
        <MockDataMonitor />
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-800 mb-2">Usage Instructions:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Homepage:</strong> Revalidates the main page (/)</li>
          <li>• <strong>All Crews:</strong> Revalidates homepage and crew listing pages</li>
          <li>• <strong>Specific Crew:</strong> Revalidates a specific crew page and related pages</li>
          <li>• <strong>Custom Paths:</strong> Revalidates any custom paths you specify</li>
          <li>• Set <code>REVALIDATION_SECRET</code> in your environment variables</li>
        </ul>
      </div>
    </div>
  );
};

export default RevalidationPanel;