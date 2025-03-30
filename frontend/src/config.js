const BACKEND_PORT = 5000;
const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;

// Debug logging
const debug = {
  log: (...args) => {
    if (config.isDevelopment) {
      console.log('[Debug]:', ...args);
    }
  },
  error: (...args) => {
    if (config.isDevelopment) {
      console.error('[Error]:', ...args);
    }
  }
};

const config = {
  API_URL: `${BACKEND_URL}/api`,
  SOCKET_URL: BACKEND_URL,
  isDevelopment: true, // Set to false in production
  debug
};

// Check backend connection
const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api-docs`);
    if (response.ok) {
      debug.log('Backend connection successful');
      return true;
    }
  } catch (error) {
    debug.error('Backend connection failed:', error);
    return false;
  }
  return false;
};

// Export both config and connection check
export { config as default, checkBackendConnection }; 