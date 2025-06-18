import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useAirtableTest, useCrews } from '../lib/hooks/useAirtable';

const TestAirtablePage: NextPage = () => {
  const { result, loading: testLoading, error: testError, testConnection } = useAirtableTest();
  const { crews, loading: crewsLoading, error: crewsError, refetch } = useCrews();

  return (
    <>
      <Head>
        <title>Airtable Integration Test | Running Crews</title>
        <meta name="description" content="Test page for Airtable integration" />
      </Head>
      
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Airtable Integration Test</h1>
        
        {/* Connection Test Section */}
        <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Connection Test</h2>
          <button 
            onClick={testConnection} 
            disabled={testLoading}
            style={{ 
              padding: '0.5rem 1rem', 
              marginBottom: '1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: testLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {testLoading ? 'Testing...' : 'Test Airtable Connection'}
          </button>
          
          {result && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: result.success ? '#d4edda' : '#f8d7da',
              border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <h3>Test Result:</h3>
              <p><strong>Status:</strong> {result.success ? '✅ Success' : '❌ Failed'}</p>
              <p><strong>Message:</strong> {result.message}</p>
              {result.config && (
                <div>
                  <p><strong>Configuration:</strong></p>
                  <ul>
                    <li>API Key: {result.config.hasApiKey ? '✅ Present' : '❌ Missing'}</li>
                    <li>Base ID: {result.config.hasBaseId ? '✅ Present' : '❌ Missing'}</li>
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {testError && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px'
            }}>
              <p><strong>Error:</strong> {testError}</p>
            </div>
          )}
        </section>
        
        {/* Crews Data Section */}
        <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Crews Data Test</h2>
          <button 
            onClick={refetch} 
            disabled={crewsLoading}
            style={{ 
              padding: '0.5rem 1rem', 
              marginBottom: '1rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: crewsLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {crewsLoading ? 'Loading...' : 'Fetch Crews Data'}
          </button>
          
          {crewsLoading && (
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <p>Loading crews from Airtable...</p>
            </div>
          )}
          
          {crewsError && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              <p><strong>Warning:</strong> {crewsError}</p>
              <p>Falling back to mock data...</p>
            </div>
          )}
          
          {!crewsLoading && crews.length > 0 && (
            <div>
              <h3>Crews Found: {crews.length}</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '1rem' }}>
                {crews.map((crew, index) => (
                  <div key={crew.id} style={{ 
                    marginBottom: '1rem', 
                    padding: '0.5rem', 
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <h4>{crew.CrewName}</h4>
                    <p><strong>ID:</strong> {crew.id}</p>
                    <p><strong>City:</strong> {crew.City}, {crew.Country}</p>
                    <p><strong>Members:</strong> ~{crew.ApproxMemberCount}</p>
                    {crew.InstagramURL && (
                      <p><strong>Instagram:</strong> <a href={crew.InstagramURL} target="_blank" rel="noopener noreferrer">{crew.InstagramURL}</a></p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!crewsLoading && crews.length === 0 && !crewsError && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c6cb',
              borderRadius: '4px'
            }}>
              <p>No crews found in Airtable</p>
            </div>
          )}
        </section>
        
        {/* Environment Variables Section */}
        <section style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2>Environment Variables</h2>
          <div style={{ fontFamily: 'monospace', backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>
            <p><strong>NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN:</strong> {process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN ? '✅ Set' : '❌ Not set'}</p>
            <p><strong>NEXT_PUBLIC_AIRTABLE_BASE_ID:</strong> {process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID ? '✅ Set' : '❌ Not set'}</p>
            {process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN && (
              <p><strong>Personal Access Token Preview:</strong> {process.env.NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN.substring(0, 10)}...</p>
            )}
            {process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID && (
              <p><strong>Base ID:</strong> {process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID}</p>
            )}
            {/* Show deprecated API key warning if still present */}
            {process.env.NEXT_PUBLIC_AIRTABLE_API_KEY && (
              <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px' }}>
                <p><strong>⚠️ Warning:</strong> NEXT_PUBLIC_AIRTABLE_API_KEY is deprecated as of Feb 1, 2024</p>
                <p>Please migrate to NEXT_PUBLIC_AIRTABLE_PERSONAL_ACCESS_TOKEN</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default TestAirtablePage;