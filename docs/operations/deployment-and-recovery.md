# Geniusphere Operations, Deployment & Disaster Recovery Runbook

This runbook defines the operational lifecycle, deployment pipelines, environment configuration, database backup/restore drills, credential rotation, and incident recovery procedures for the Geniusphere platform.

---

## 1. Production Architecture & Deployment Topology

Geniusphere operates on a secure three-tier deployment topology:

```
[ Internet Traffic ]
        │
        ▼ (Port 80/443, TLS 1.3 Termination, HTTP/2, Reverse Proxy)
┌────────────────────────────────────────────────────────┐
│ Caddy Reverse Proxy (Container: geniusphere_proxy)     │
│ - Serves static frontend bundle (/srv/dist)            │
│ - Proxies API traffic to backend (http://app:3001)     │
│ - Proxies WebSocket connections (/ws)                  │
└───────────────────────┬────────────────────────────────┘
                        │ (Internal Docker Bridge: geniusphere_internal)
        ┌───────────────┴───────────────┐
        ▼                               ▼
┌─────────────────────────┐   ┌───────────────────────────────┐
│ Fastify Backend Gateway │   │ Private Ollama Daemon         │
│ (Container: app:3001)   │   │ (Container: ollama:11434)     │
│ - REST & WebSocket Hub  │   │ - No external port exposure   │
│ - JWT Auth & Rate Limit │   │ - Private model inference     │
└───────────────┬─────────┘   └───────────────────────────────┘
                │
                ▼ (Port 5432, No public port exposure)
┌────────────────────────────────────────────────────────┐
│ PostgreSQL 16 Alpine Database (Container: db)          │
│ - Authoritative Relational Storage                     │
│ - RLS, Transactions, Invariant Triggers                │
│ - Persistent Volume: postgres_data                     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Environment Configuration & Security Tiers

| Variable | Required | Default | Security Tier | Description |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` | Public | Environment mode (`development`, `production`, `test`) |
| `PORT` | Yes | `3001` | Internal | Fastify HTTP/WSS listening port |
| `HOST` | Yes | `0.0.0.0` | Internal | Fastify network bind address |
| `DATABASE_URL` | Yes | — | **Secret** | PostgreSQL connection URI (`postgresql://user:pass@host:5432/db`) |
| `JWT_SECRET` | Yes | — | **Secret** | Min 32-character high-entropy secret for signing session tokens |
| `AI_PROVIDER` | No | `none` | Internal | Target provider (`none`, `gemini`, `ollama`) |
| `GEMINI_API_KEY` | Conditional | — | **Secret** | API key when `AI_PROVIDER=gemini` |
| `OLLAMA_HOST` | Conditional | `http://ollama:11434` | Internal | Private network address of local Ollama container |
| `AI_MODEL` | No | `llama3.2` | Internal | Configured model name |
| `AI_REQUEST_TIMEOUT_MS` | No | `15000` | Internal | AI inference timeout limit in milliseconds |
| `CORS_ORIGIN` | Yes | `https://learn.geniusphere.tech` | Internal | Whitelisted CORS origin header |

> [!CAUTION]
> Never prefix backend secrets (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`) with `VITE_`. Doing so exposes secrets directly to client browser source maps and JavaScript bundles.

---

## 3. Deployment Procedure

### Standard Docker Compose Rollout:
```bash
# 1. Pull latest code from repository
git pull origin main

# 2. Build production static bundle and verify typecheck
npm run build

# 3. Build and spin up containers in detached mode
docker compose up -d --build

# 4. Verify service health checks
docker compose ps
curl -f http://localhost:3001/health
```

---

## 4. Disaster Recovery & Backup Verification Drill

### Step A: Logical Backup Execution (`scripts/backup-db.sh`)
```bash
#!/bin/bash
set -euo pipefail
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="${BACKUP_DIR}/geniusphere_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"
echo "[Backup] Creating PostgreSQL logical backup..."
pg_dump -U "${POSTGRES_USER:-geniusphere_admin}" -d "${POSTGRES_DB:-geniusphere_prod}" | gzip > "${FILENAME}"
echo "[Backup] Successfully created ${FILENAME} (Size: $(du -h "${FILENAME}" | cut -f1))"
```

### Step B: Restoration Drill (`scripts/restore-db.sh`)
```bash
#!/bin/bash
set -euo pipefail
BACKUP_FILE="${1:-}"

if [ -z "${BACKUP_FILE}" ] || [ ! -f "${BACKUP_FILE}" ]; then
  echo "Usage: ./scripts/restore-db.sh <path-to-backup.sql.gz>"
  exit 1
fi

echo "[Restore] Decompressing and restoring ${BACKUP_FILE}..."
gunzip -c "${BACKUP_FILE}" | psql -U "${POSTGRES_USER:-geniusphere_admin}" -d "${POSTGRES_DB:-geniusphere_prod}"
echo "[Restore] Restoration complete. Verifying table row counts..."
psql -U "${POSTGRES_USER:-geniusphere_admin}" -d "${POSTGRES_DB:-geniusphere_prod}" -c "
  SELECT 'users' as table, COUNT(*) FROM public.users
  UNION ALL SELECT 'courses', COUNT(*) FROM public.courses
  UNION ALL SELECT 'xp_ledger', COUNT(*) FROM public.xp_ledger;
"
```

---

## 5. Rollback Procedures

### Application Code Rollback:
1. Revert container image or checkout verified Git SHA:
   ```bash
   git checkout <PREVIOUS_STABLE_SHA>
   npm run build
   docker compose restart app proxy
   ```
2. Database migrations are designed to be backward-compatible (non-destructive column additions), allowing older application versions to continue reading from the schema without immediate rollback.

### Emergency Credential Rotation:
1. **Compromised `JWT_SECRET`:**
   - Update `JWT_SECRET` in `.env.production`.
   - Restart the Fastify backend: `docker compose restart app`.
   - Effect: All existing JWT tokens are invalidated immediately, forcing re-authentication across all active sessions.
2. **Compromised `DATABASE_URL`:**
   - Rotate password in PostgreSQL: `ALTER USER geniusphere_admin WITH PASSWORD 'new_secure_password';`.
   - Update `DATABASE_URL` in container environment and reload service.
