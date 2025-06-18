import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import RevalidationPanel from '../../components/Admin/RevalidationPanel';

interface RevalidationPageProps {
  isAuthorized: boolean;
}

const RevalidationPage: React.FC<RevalidationPageProps> = ({ isAuthorized }) => {
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this admin panel.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This page is only accessible in development mode or with proper authentication.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Revalidation Admin - Running Crews</title>
        <meta name="description" content="Admin panel for on-demand ISR revalidation" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Revalidation Admin Panel
            </h1>
            <p className="text-gray-600">
              Manually trigger on-demand revalidation of ISR pages when crew data is updated in Airtable.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Revalidation Panel */}
            <div className="lg:col-span-2">
              <RevalidationPanel />
            </div>

            {/* Information Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  📋 Current ISR Settings
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-gray-700">Homepage:</strong>
                    <span className="text-gray-600 ml-2">24 hours (86400s)</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Crew Listing:</strong>
                    <span className="text-gray-600 ml-2">1 hour (3600s)</span>
                  </div>
                  <div>
                    <strong className="text-gray-700">Crew Details:</strong>
                    <span className="text-gray-600 ml-2">24 hours (86400s)</span>
                  </div>
                </div>

                <hr className="my-4" />

                <h4 className="font-semibold text-gray-800 mb-2">When to Use:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• New crew added to Airtable</li>
                  <li>• Crew information updated</li>
                  <li>• Crew images changed</li>
                  <li>• Schedule updates</li>
                  <li>• Team member changes</li>
                </ul>

                <hr className="my-4" />

                <h4 className="font-semibold text-gray-800 mb-2">API Usage:</h4>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                  <div className="mb-2">POST /api/revalidate</div>
                  <div className="text-gray-600">
                    {`{`}<br />
                    &nbsp;&nbsp;"secret": "your-secret",<br />
                    &nbsp;&nbsp;"type": "crews",<br />
                    &nbsp;&nbsp;"paths": ["/crews/rec123"]<br />
                    {`}`}
                  </div>
                </div>
              </div>

              {/* Environment Setup */}
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  ⚙️ Environment Setup
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-gray-700">Required Environment Variable:</strong>
                    <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
                      REVALIDATION_SECRET=your-secret-token
                    </div>
                  </div>
                  
                  <div>
                    <strong className="text-gray-700">Optional (for client-side):</strong>
                    <div className="bg-gray-50 p-2 rounded mt-1 font-mono text-xs">
                      NEXT_PUBLIC_REVALIDATION_SECRET=your-secret-token
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    <strong>Security Note:</strong> Keep your revalidation secret secure. 
                    Consider using different secrets for different environments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              This admin panel allows manual triggering of Next.js ISR revalidation.
              Use it when you need immediate updates after changing data in Airtable.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Simple authorization check - only allow in development or with proper auth
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // You can add more sophisticated auth here, e.g.:
  // - Check for admin session/cookie
  // - Verify API key in headers
  // - Check IP whitelist
  
  const isAuthorized = isDevelopment; // Modify this logic as needed
  
  return {
    props: {
      isAuthorized,
    },
  };
};

export default RevalidationPage;