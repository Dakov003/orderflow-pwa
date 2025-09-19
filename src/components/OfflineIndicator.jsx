import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-red-50 border border-red-200 rounded-lg shadow-lg p-3 z-50">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-5 h-5 text-red-600" />
        <div>
          <p className="text-sm font-medium text-red-800">
            Conexiune offline
          </p>
          <p className="text-xs text-red-600">
            Aplicația funcționează în mod offline
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;

