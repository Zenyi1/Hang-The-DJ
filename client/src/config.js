const config = {
  // Use environment variable with fallback for local development
  BASE_URL: process.env.REACT_APP_BASE_URL || 'https://hangthedjs-f06eea12d185.herokuapp.com',
  API_URL: process.env.REACT_APP_API_URL || 'https://hangthedjs-f06eea12d185.herokuapp.com/api',
  STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUBLIC_KEY,
  ENV: process.env.NODE_ENV || 'development',
  // Add other configuration variables as needed
};

export default config; 