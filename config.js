const { isInteger } = require('lodash');

exports.baseUrl = process.env.BASE_URL || '';
exports.databaseUrl = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost/one-chat-room';
exports.maxMessages = getEnvInt('MAX_MESSAGES') || 10000;
exports.port = getEnvInt('PORT') || 3000;

if (exports.maxMessages <= 0) {
  throw new Error(`Environment variable $MAX_MESSAGES must be an integer greater than or equal to 1, but its value is ${exports.maxMessages}`);
} else if (exports.port < 0 || exports.port > 65535) {
  throw new Error(`Environment variable $PORT must be a port number between 0 and 63535, but its value is ${exports.port}`);
}

function getEnvInt(name) {

  const value = process.env[name];
  if (value === undefined) {
    return;
  }

  const intValue = parseInt(value, 10);
  if (!isInteger(intValue)) {
    throw new Error(`Environment variable $${name} must be an integer, but its value is "${value}"`);
  }

  return intValue;
}
