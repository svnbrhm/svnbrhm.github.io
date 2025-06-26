import { useState, useEffect } from 'react';
import { NextPage } from 'next';

interface MapCrewData {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  memberCount?: number;
  status: string;
}

interface ApiResponse {
  crews: MapCrewData[];
  total: number;
  cached: boolean;
  lastUpdated: string;
  bounds?: string;
  limit?: number;
  error?: string;
  message?: string;
}

const TestMapApi: NextPage = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testParams, setTestParams] = useState({
    bounds: '60,-60,180,-180', // World bounds
    limit: '50',
    zoom: '2'
  });

  const testApi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (testParams.bounds) params.append('bounds', testParams.bounds);
      if (testParams.limit) params.append('limit', testParams.limit);
      if (testParams.zoom) params.append('zoom', testParams.zoom);
      
      const url = `/api/crews/map-data?${params.toString()}`;
      console.log('Testing API:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      setApiData(data);
      console.log('API Response:', data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('API Test Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Test on component mount
  useEffect(() => {
    testApi();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Map API Test</h1>
      
      {/* Test Parameters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bounds (N,S,E,W)</label>
            <input
              type="text"
              value={testParams.bounds}
              onChange={(e) => setTestParams(prev => ({ ...prev, bounds: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="60,-60,180,-180"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Limit</label>
            <input
              type="number"
              value={testParams.limit}
              onChange={(e) => setTestParams(prev => ({ ...prev, limit: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Zoom</label>
            <input
              type="number"
              value={testParams.zoom}
              onChange={(e) => setTestParams(prev => ({ ...prev, zoom: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="2"
            />
          </div>
        </div>
        <button
          onClick={testApi}
          disabled={loading}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {apiData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-green-800 font-semibold mb-4">API Response</h3>
          
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-3 rounded">
              <div className="text-sm text-gray-600">Crews Loaded</div>
              <div className="text-xl font-bold">{apiData.crews.length}</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="text-sm text-gray-600">Total Available</div>
              <div className="text-xl font-bold">{apiData.total}</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="text-sm text-gray-600">Cached</div>
              <div className="text-xl font-bold">{apiData.cached ? '✅' : '❌'}</div>
            </div>
            <div className="bg-white p-3 rounded">
              <div className="text-sm text-gray-600">Last Updated</div>
              <div className="text-sm">{new Date(apiData.lastUpdated).toLocaleString()}</div>
            </div>
          </div>
          
          {/* Sample Crews */}
          <div>
            <h4 className="font-semibold mb-2">Sample Crews (first 10):</h4>
            <div className="bg-white rounded border max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Location</th>
                    <th className="p-2 text-left">Coordinates</th>
                    <th className="p-2 text-left">Members</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData.crews.slice(0, 10).map((crew, index) => (
                    <tr key={crew.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="p-2 font-medium">{crew.name}</td>
                      <td className="p-2">{crew.city}, {crew.country}</td>
                      <td className="p-2 text-xs">{crew.lat.toFixed(4)}, {crew.lng.toFixed(4)}</td>
                      <td className="p-2">{crew.memberCount || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {apiData.crews.length > 10 && (
              <p className="text-sm text-gray-600 mt-2">
                ... and {apiData.crews.length - 10} more crews
              </p>
            )}
          </div>
        </div>
      )}

      {/* Raw JSON */}
      {apiData && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Raw JSON Response</h3>
          <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestMapApi;