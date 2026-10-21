import path from 'path';
import fs from 'fs';

// Simple .env parser to avoid extra dotenv dependency
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const value = trimmed.slice(eqIdx + 1).trim();
        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const nodeEnv = process.env.NODE_ENV || 'development';
const databaseUrl = process.env.DATABASE_URL || (nodeEnv === 'development' || nodeEnv === 'test'
  ? `postgresql://${process.env.PGUSER || 'pavankumars'}@localhost:5432/geniusphere_dev`
  : '');

const jwtSecret = process.env.JWT_SECRET || (nodeEnv === 'development' || nodeEnv === 'test'
  ? 'geniusphere_jwt_secret_dev_2026_default_key'
  : '');

export function validateProductionConfig(env: { NODE_ENV?: string; DATABASE_URL?: string; JWT_SECRET?: string }) {
  const nodeEnv = env.NODE_ENV || 'development';
  if (nodeEnv === 'production') {
    if (!env.DATABASE_URL) {
      throw new Error('[CRITICAL PRODUCTION CONFIGURATION ERROR] DATABASE_URL must be explicitly provided in production environment.');
    }
    if (!env.JWT_SECRET || env.JWT_SECRET.length < 32 || env.JWT_SECRET.includes('default_key') || env.JWT_SECRET.includes('dev-')) {
      throw new Error('[CRITICAL PRODUCTION CONFIGURATION ERROR] A cryptographically strong JWT_SECRET (>= 32 chars) must be configured in production.');
    }
  }
}

// Fail-fast configuration checks for production
try {
  validateProductionConfig({
    NODE_ENV: nodeEnv,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
  });
} catch (err: any) {
  console.error(err.message);
  process.exit(1);
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv,
  databaseUrl,
  jwtSecret,
  aiProvider: (process.env.AI_PROVIDER || 'none').trim().toLowerCase(),
  aiModel: process.env.AI_MODEL || 'llama3.2',
  aiRequestTimeoutMs: parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '15000', 10),
  vapid: {
    publicKey:
      process.env.VAPID_PUBLIC_KEY ||
      'BO_iZHOskZGdHMNKXMJ-Xi1394z3nKOIL3wD0kEqwrLHDex5PFiierPHhJnvSPp9RnHILAJXTJ4Se9nB2ecCIEQ',
    privateKey:
      process.env.VAPID_PRIVATE_KEY || 'psW43wwenQJ9p6BiHxUOXsGdOSq2Eb7lRQIlbSPBd9c',
    subject: process.env.VAPID_SUBJECT || 'mailto:security@geniusphere.tech',
  },
};
