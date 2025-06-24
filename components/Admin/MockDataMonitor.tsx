import React, { useState, useEffect } from 'react';
import { mockDataTracker, MockDataMetrics, MockDataUsage } from '../../lib/mockDataTracker';

interface MockDataMonitorProps {
  className?: string;
  showDetails?: boolean;
}

const MockDataMonitor: React.FC<MockDataMonitorProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const [metrics, setMetrics] = useState<MockDataMetrics | null>(null);
  const [isExpanded, setIsExpanded] = useState(showDetails);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(mockDataTracker.getMetrics());
    };

    updateMetrics();
    
    // Update metrics every 10 seconds
    const interval = setInterval(updateMetrics, 10000);
    
    return () => clearInterval(interval);
  }, [refreshKey]);

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const clear = () => {
    mockDataTracker.clear();
    refresh();
  };

  const isCurrentlyUsingMock = mockDataTracker.isUsingMockData();
  const summary = mockDataTracker.getUsageSummary(24);

  if (!metrics) {
    return (
      <div className={`mock-data-monitor loading ${className}`}>
        <div className="monitor-header">
          <span className="monitor-title">📊 Mock Data Monitor</span>
          <span className="loading-indicator">Loading...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (isCurrentlyUsingMock) return '#ff4444'; // Red - currently using mock
    if (summary.count > 0) return '#ffaa00'; // Orange - used recently
    return '#44aa44'; // Green - all good
  };

  const getStatusText = () => {
    if (isCurrentlyUsingMock) return 'USING MOCK DATA';
    if (summary.count > 0) return `${summary.count} fallbacks in 24h`;
    return 'All data from Airtable';
  };

  return (
    <div className={`mock-data-monitor ${className}`} style={{ 
      border: `2px solid ${getStatusColor()}`,
      borderRadius: '8px',
      padding: '12px',
      margin: '8px 0',
      backgroundColor: isCurrentlyUsingMock ? '#fff5f5' : '#f9f9f9'
    }}>
      <div className="monitor-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isExpanded ? '12px' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span 
            style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              backgroundColor: getStatusColor(),
              display: 'inline-block'
            }}
          />
          <span className="monitor-title" style={{ fontWeight: 'bold' }}>
            📊 Mock Data Monitor
          </span>
          <span 
            className="status-text" 
            style={{ 
              color: getStatusColor(),
              fontWeight: 'bold',
              fontSize: '0.9em'
            }}
          >
            {getStatusText()}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.8em'
            }}
          >
            {isExpanded ? '▼ Hide' : '▶ Details'}
          </button>
          <button 
            onClick={refresh}
            style={{
              padding: '4px 8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.8em'
            }}
          >
            🔄 Refresh
          </button>
          {metrics.totalUsages > 0 && (
            <button 
              onClick={clear}
              style={{
                padding: '4px 8px',
                border: '1px solid #ff4444',
                borderRadius: '4px',
                background: 'white',
                color: '#ff4444',
                cursor: 'pointer',
                fontSize: '0.8em'
              }}
            >
              🗑️ Clear
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="monitor-details">
          <div className="metrics-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div className="metric-card" style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>Total Usages</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{metrics.totalUsages}</div>
            </div>
            
            <div className="metric-card" style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>Last 24h</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{summary.count}</div>
            </div>
            
            <div className="metric-card" style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: 'white'
            }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>Functions Affected</div>
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{Object.keys(metrics.usagesByFunction).length}</div>
            </div>
          </div>

          {Object.keys(metrics.usagesByFunction).length > 0 && (
            <div className="functions-breakdown" style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#333' }}>Functions Using Mock Data:</h4>
              <div style={{ fontSize: '0.8em' }}>
                {Object.entries(metrics.usagesByFunction).map(([func, count]) => (
                  <div key={func} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '2px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span>{func}</span>
                    <span style={{ fontWeight: 'bold' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Object.keys(metrics.usagesByReason).length > 0 && (
            <div className="reasons-breakdown" style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#333' }}>Reasons for Mock Data:</h4>
              <div style={{ fontSize: '0.8em' }}>
                {Object.entries(metrics.usagesByReason).map(([reason, count]) => (
                  <div key={reason} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: '2px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <span style={{ textTransform: 'capitalize' }}>{reason.replace('_', ' ')}</span>
                    <span style={{ fontWeight: 'bold' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {metrics.recentUsages.length > 0 && (
            <div className="recent-usages">
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9em', color: '#333' }}>Recent Usages:</h4>
              <div style={{ 
                maxHeight: '200px', 
                overflowY: 'auto',
                fontSize: '0.75em',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '8px'
              }}>
                {metrics.recentUsages.slice().reverse().map((usage, index) => (
                  <div key={index} style={{ 
                    marginBottom: '4px',
                    paddingBottom: '4px',
                    borderBottom: index < metrics.recentUsages.length - 1 ? '1px solid #eee' : 'none'
                  }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {new Date(usage.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <span style={{ color: '#666' }}>Function:</span> {usage.function}
                    </div>
                    <div>
                      <span style={{ color: '#666' }}>Reason:</span> {usage.reason.replace('_', ' ')}
                    </div>
                    {usage.context && (
                      <div>
                        <span style={{ color: '#666' }}>Context:</span> {usage.context}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {metrics.totalUsages === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: '#44aa44', 
              fontWeight: 'bold',
              padding: '16px'
            }}>
              ✅ No mock data usage detected! All data is coming from Airtable.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MockDataMonitor;