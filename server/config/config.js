const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  const { development } = require('./config.json');
  Object.keys(development).forEach(key => {
    process.env[key] = development[key];
  });
}
