import { useMemo } from 'react';

const CONFIG = {
  development: {
    apiBaseUrl: 'http://localhost:8081/api',
    features: {
      fileUpload: true,
      notifications: true,
      errorTracking: true,
    },
    limits: {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      maxNotifications: 50,
      sessionTimeout: 3600000, // 1 hour
    }
  },
  production: {
    apiBaseUrl: process.env.REACT_APP_API_URL,
    features: {
      fileUpload: true,
      notifications: true,
      errorTracking: true,
    },
    limits: {
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxNotifications: 100,
      sessionTimeout: 7200000, // 2 hours
    }
  },
  test: {
    apiBaseUrl: 'http://localhost:8081/api',
    features: {
      fileUpload: false,
      notifications: false,
      errorTracking: false,
    },
    limits: {
      maxFileSize: 1024 * 1024, // 1MB
      maxNotifications: 10,
      sessionTimeout: 900000, // 15 minutes
    }
  }
};

export function useConfig() {
  const env = process.env.NODE_ENV || 'development';
  
  const config = useMemo(() => ({
    ...CONFIG[env],
    environment: env,
    isDevelopment: env === 'development',
    isProduction: env === 'production',
    isTest: env === 'test'
  }), [env]);

  return config;
}