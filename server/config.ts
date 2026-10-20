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

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.PGUSER || 'pavankumars'}@localhost:5432/geniusphere_dev`,
  jwtSecret: process.env.JWT_SECRET || 'geniusphere_jwt_secret_dev_2026_default_key',
  vapid: {
    publicKey:
      process.env.VAPID_PUBLIC_KEY ||
      'BO_iZHOskZGdHMNKXMJ-Xi1394z3nKOIL3wD0kEqwrLHDex5PFiierPHhJnvSPp9RnHILAJXTJ4Se9nB2ecCIEQ',
    privateKey:
      process.env.VAPID_PRIVATE_KEY || 'psW43wwenQJ9p6BiHxUOXsGdOSq2Eb7lRQIlbSPBd9c',
    subject: process.env.VAPID_SUBJECT || 'mailto:security@geniusphere.tech',
  },
};
