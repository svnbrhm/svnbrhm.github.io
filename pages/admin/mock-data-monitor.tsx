import React from 'react';
import Head from 'next/head';
import MockDataMonitor from '../../components/Admin/MockDataMonitor';

const MockDataMonitorPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Mock Data Monitor - Running Crews Admin</title>
        <meta name="description" content="Monitor mock data usage and Airtable connectivity" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <header style={{ marginBottom: '24px' }}>
            <h1 style={{ 
              margin: '0 0 8px 0',
              color: '#333',
              fontSize: '2em'
            }}>
              🔍 Mock Data Monitor
            </h1>
            <p style={{ 
              margin: '0',
              color: '#666',
              fontSize: '1.1em'
            }}>
              Track when and why the application falls back to mock data instead of using Airtable.
            </p>
          </header>

          <MockDataMonitor showDetails={true} />

          <div style={{
            marginTop: '32px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#333' }}>📋 Understanding the Monitor</h3>
            <div style={{ fontSize: '0.9em', color: '#666', lineHeight: '1.5' }}>
              <p><strong>Status Indicators:</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li><span style={{ color: '#44aa44' }}>🟢 Green:</span> All data is coming from Airtable</li>
                <li><span style={{ color: '#ffaa00' }}>🟡 Orange:</span> Recent fallbacks to mock data (within 24h)</li>
                <li><span style={{ color: '#ff4444' }}>🔴 Red:</span> Currently using mock data</li>
              </ul>
              
              <p><strong>Common Reasons for Mock Data:</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li><strong>airtable_not_configured:</strong> Missing API credentials</li>
                <li><strong>airtable_error:</strong> API request failed</li>
                <li><strong>network_error:</strong> Network connectivity issues</li>
                <li><strong>timeout:</strong> Request took too long</li>
              </ul>

              <p><strong>Goal:</strong> Keep this monitor green! All data should come from Airtable for the best user experience.</p>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#fff3cd',
            borderRadius: '6px',
            border: '1px solid #ffeaa7'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#856404' }}>⚠️ Troubleshooting</h3>
            <div style={{ fontSize: '0.9em', color: '#856404', lineHeight: '1.5' }}>
              <p>If you see mock data usage:</p>
              <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Check that <code>AIRTABLE_PERSONAL_ACCESS_TOKEN</code> and <code>AIRTABLE_BASE_ID</code> are set</li>
                <li>Verify Airtable API connectivity at <a href="/api/test-connection" target="_blank" style={{ color: '#856404' }}>/api/test-connection</a></li>
                <li>Check the browser console for detailed error messages</li>
                <li>Review the Recent Usages section for specific error contexts</li>
              </ol>
            </div>
          </div>

          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '0.9em',
            color: '#666'
          }}>
            <p>
              <a href="/admin/revalidation" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Admin Panel</a>
              {' | '}
              <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>Go to Homepage</a>
              {' | '}
              <a href="/api/mock-data-metrics" target="_blank" style={{ color: '#007bff', textDecoration: 'none' }}>View Raw Metrics API</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MockDataMonitorPage;