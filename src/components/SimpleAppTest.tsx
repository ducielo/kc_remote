import React from 'react';
import { AuthProvider } from './AuthContext';
import { AdminContentProvider } from './contexts/AdminContentProvider';
import { PublicDataProvider } from './contexts/PublicDataContext';

export const SimpleAppTest: React.FC = () => {
  return (
    <AuthProvider>
      <AdminContentProvider>
        <PublicDataProvider>
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Karis Continental
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Test avec PublicDataProvider
              </p>
              <div className="space-y-4">
                <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                  ✅ AuthProvider OK
                </div>
                <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                  ✅ AdminContentProvider OK
                </div>
                <div className="p-4 bg-green-100 text-green-800 rounded-lg">
                  ✅ PublicDataProvider OK
                </div>
              </div>
            </div>
          </div>
        </PublicDataProvider>
      </AdminContentProvider>
    </AuthProvider>
  );
};