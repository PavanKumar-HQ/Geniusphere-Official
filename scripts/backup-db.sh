#!/usr/bin/env bash
# ====================================================================
# Geniusphere Automated PostgreSQL Backup Script
# Generates timestamped gzip-compressed dumps with SHA-256 checksums
# ====================================================================

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CONTAINER_NAME="${DB_CONTAINER:-geniusphere_db}"
DB_USER="${POSTGRES_USER:-geniusphere_admin}"
DB_NAME="${POSTGRES_DB:-geniusphere_prod}"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_backup_${TIMESTAMP}.sql.gz"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"

mkdir -p "${BACKUP_DIR}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting automated PostgreSQL backup for '${DB_NAME}'..."

# Execute pg_dump inside the database container and pipe through gzip
docker exec -t "${CONTAINER_NAME}" pg_dump -U "${DB_USER}" -d "${DB_NAME}" --clean --if-exists --no-owner | gzip -9 > "${BACKUP_FILE}"

# Generate cryptographic checksum
sha256sum "${BACKUP_FILE}" > "${CHECKSUM_FILE}"

FILESIZE=$(du -h "${BACKUP_FILE}" | cut -f1)

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup completed successfully: ${BACKUP_FILE} (${FILESIZE})"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] SHA-256 checksum written to: ${CHECKSUM_FILE}"

# Retention policy: Delete backups older than 30 days
find "${BACKUP_DIR}" -name "${DB_NAME}_backup_*.sql.gz*" -mtime +30 -exec rm -f {} +
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup retention policy enforced (30 days)."
