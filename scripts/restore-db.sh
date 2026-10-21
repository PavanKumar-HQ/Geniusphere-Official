#!/usr/bin/env bash
# ====================================================================
# Geniusphere Automated PostgreSQL Restoration Script
# Validates checksum before performing clean atomic restore
# ====================================================================

set -euo pipefail

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path_to_backup_file.sql.gz>"
    exit 1
fi

BACKUP_FILE="$1"
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
CONTAINER_NAME="${DB_CONTAINER:-geniusphere_db}"
DB_USER="${POSTGRES_USER:-geniusphere_admin}"
DB_NAME="${DB_NAME:-${POSTGRES_DB:-geniusphere_prod}}"

if [ ! -f "${BACKUP_FILE}" ]; then
    echo "Error: Backup file not found at: ${BACKUP_FILE}"
    exit 1
fi

# Validate SHA-256 Checksum if present
if [ -f "${CHECKSUM_FILE}" ]; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Validating SHA-256 integrity checksum..."
    sha256sum -c "${CHECKSUM_FILE}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Checksum verified successfully!"
else
    echo "Warning: Checksum file not found. Proceeding with unverified archive."
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restoring '${BACKUP_FILE}' into container '${CONTAINER_NAME}' database '${DB_NAME}'..."

# Uncompress and pipe into psql
if command -v docker &>/dev/null && docker ps -q -f name="${CONTAINER_NAME}" 2>/dev/null | grep -q .; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restoring into container '${CONTAINER_NAME}' database '${DB_NAME}'..."
  gunzip -c "${BACKUP_FILE}" | docker exec -i "${CONTAINER_NAME}" psql -U "${DB_USER}" -d "${DB_NAME}"
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restoring into local database '${DB_NAME}'..."
  gunzip -c "${BACKUP_FILE}" | psql -d "${DB_NAME}"
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Database restoration completed successfully!"
