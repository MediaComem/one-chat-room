import { readFileSync } from 'node:fs';
import path from 'node:path';

export const root = path.dirname(new URL(import.meta.url).pathname);

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));

export const baseUrl = process.env.BASE_URL ?? '';
export const databaseUrl =
  process.env.MONGODB_URI ?? process.env.DATABASE_URL ?? 'mongodb://localhost/one-chat-room';
export const maxMessageLength = getEnvInt('MAX_MESSAGE_LENGTH') ?? 500;
export const maxMessages = getEnvInt('MAX_MESSAGES') ?? 10_000;
export const port = getEnvInt('PORT') ?? 3000;
export const { version } = pkg;

if (maxMessageLength <= 0) {
  throw new Error(
    `Environment variable $MAX_MESSAGE_LENGTH must be an integer greater than or equal to 1, but its value is ${maxMessageLength}`
  );
} else if (maxMessages <= 0) {
  throw new Error(
    `Environment variable $MAX_MESSAGES must be an integer greater than or equal to 1, but its value is ${maxMessages}`
  );
} else if (port < 0 || port > 65_535) {
  throw new Error(
    `Environment variable $PORT must be a port number between 0 and 63535, but its value is ${port}`
  );
}

function getEnvInt(name) {
  const value = process.env[name];
  if (value === undefined) {
    return undefined;
  }

  const intValue = Number.parseInt(value, 10);
  if (!Number.isInteger(intValue)) {
    throw new TypeError(
      `Environment variable $${name} must be an integer, but its value is "${value}"`
    );
  }

  return intValue;
}
