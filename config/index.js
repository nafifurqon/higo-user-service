const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

module.exports = {
  root_path: path.resolve(__dirname, '..'),
  service_name: process.env.SERVICE_NAME,
  mongodb_url: process.env.MONGODB_URL,
  api_prefix: process.env.API_PREFIX,
};
