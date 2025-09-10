#!/bin/bash

# SIMDAG Database Backup Script
# This script creates automated backups of the PostgreSQL database
# Copy this file to /home/bowo/ on the server

# Configuration
DB_NAME="simdag_db"
DB_USER="simdag_user"
DB_HOST="localhost"
DB_PORT="5432"

# Backup directory
BACKUP_DIR="/home/bowo/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/simdag_backup_${DATE}.sql"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Retention policy (days)
RETENTION_DAYS=7

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to print colored output
print_status() {
    case $1 in
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $2"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $2"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $2"
            ;;
        "INFO")
            echo -e "[INFO] $2"
            ;;
    esac
}

# Create backup directory if it doesn't exist
create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        if [ $? -eq 0 ]; then
            print_status "SUCCESS" "Created backup directory: $BACKUP_DIR"
            log_message "Created backup directory: $BACKUP_DIR"
        else
            print_status "ERROR" "Failed to create backup directory: $BACKUP_DIR"
            log_message "ERROR: Failed to create backup directory: $BACKUP_DIR"
            exit 1
        fi
    fi
}

# Check if PostgreSQL is running
check_postgresql() {
    if ! systemctl is-active --quiet postgresql; then
        print_status "ERROR" "PostgreSQL is not running"
        log_message "ERROR: PostgreSQL is not running"
        exit 1
    fi
    print_status "SUCCESS" "PostgreSQL is running"
}

# Test database connection
test_connection() {
    if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        print_status "ERROR" "Cannot connect to database $DB_NAME"
        log_message "ERROR: Cannot connect to database $DB_NAME"
        exit 1
    fi
    print_status "SUCCESS" "Database connection successful"
}

# Create database backup
create_backup() {
    print_status "INFO" "Starting backup of database: $DB_NAME"
    log_message "Starting backup of database: $DB_NAME"
    
    # Create backup with compression
    if PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose --clean --no-owner --no-privileges \
        --format=custom --compress=9 \
        --file="${BACKUP_FILE}.custom" 2>> "$LOG_FILE"; then
        
        print_status "SUCCESS" "Custom format backup created: ${BACKUP_FILE}.custom"
        log_message "Custom format backup created: ${BACKUP_FILE}.custom"
        
        # Also create SQL format backup
        if PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
            --verbose --clean --no-owner --no-privileges \
            --format=plain \
            --file="$BACKUP_FILE" 2>> "$LOG_FILE"; then
            
            print_status "SUCCESS" "SQL format backup created: $BACKUP_FILE"
            log_message "SQL format backup created: $BACKUP_FILE"
            
            # Compress SQL backup
            gzip "$BACKUP_FILE"
            print_status "SUCCESS" "SQL backup compressed: ${BACKUP_FILE}.gz"
            log_message "SQL backup compressed: ${BACKUP_FILE}.gz"
        else
            print_status "ERROR" "Failed to create SQL backup"
            log_message "ERROR: Failed to create SQL backup"
        fi
    else
        print_status "ERROR" "Failed to create database backup"
        log_message "ERROR: Failed to create database backup"
        exit 1
    fi
}

# Clean old backups
clean_old_backups() {
    print_status "INFO" "Cleaning backups older than $RETENTION_DAYS days"
    log_message "Cleaning backups older than $RETENTION_DAYS days"
    
    # Find and delete old backups
    OLD_BACKUPS=$(find "$BACKUP_DIR" -name "simdag_backup_*.sql.gz" -o -name "simdag_backup_*.custom" -mtime +$RETENTION_DAYS)
    
    if [ -n "$OLD_BACKUPS" ]; then
        echo "$OLD_BACKUPS" | while read -r file; do
            if rm "$file"; then
                print_status "SUCCESS" "Deleted old backup: $(basename "$file")"
                log_message "Deleted old backup: $(basename "$file")"
            else
                print_status "ERROR" "Failed to delete: $(basename "$file")"
                log_message "ERROR: Failed to delete: $(basename "$file")"
            fi
        done
    else
        print_status "INFO" "No old backups to clean"
        log_message "No old backups to clean"
    fi
}

# Get backup statistics
get_backup_stats() {
    if [ -f "${BACKUP_FILE}.gz" ]; then
        SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
        print_status "INFO" "Backup size: $SIZE"
        log_message "Backup size: $SIZE"
    fi
    
    if [ -f "${BACKUP_FILE}.custom" ]; then
        SIZE_CUSTOM=$(du -h "${BACKUP_FILE}.custom" | cut -f1)
        print_status "INFO" "Custom backup size: $SIZE_CUSTOM"
        log_message "Custom backup size: $SIZE_CUSTOM"
    fi
    
    # Count total backups
    TOTAL_BACKUPS=$(find "$BACKUP_DIR" -name "simdag_backup_*.sql.gz" -o -name "simdag_backup_*.custom" | wc -l)
    print_status "INFO" "Total backups in directory: $TOTAL_BACKUPS"
    log_message "Total backups in directory: $TOTAL_BACKUPS"
}

# Verify backup integrity
verify_backup() {
    print_status "INFO" "Verifying backup integrity"
    log_message "Verifying backup integrity"
    
    # Test custom format backup
    if [ -f "${BACKUP_FILE}.custom" ]; then
        if pg_restore --list "${BACKUP_FILE}.custom" > /dev/null 2>&1; then
            print_status "SUCCESS" "Custom backup integrity verified"
            log_message "Custom backup integrity verified"
        else
            print_status "ERROR" "Custom backup integrity check failed"
            log_message "ERROR: Custom backup integrity check failed"
        fi
    fi
    
    # Test compressed SQL backup
    if [ -f "${BACKUP_FILE}.gz" ]; then
        if gunzip -t "${BACKUP_FILE}.gz" 2>/dev/null; then
            print_status "SUCCESS" "SQL backup compression integrity verified"
            log_message "SQL backup compression integrity verified"
        else
            print_status "ERROR" "SQL backup compression integrity check failed"
            log_message "ERROR: SQL backup compression integrity check failed"
        fi
    fi
}

# Send notification (optional)
send_notification() {
    # Uncomment and configure if you want email notifications
    # echo "SIMDAG database backup completed successfully at $(date)" | mail -s "SIMDAG Backup Success" admin@example.com
    
    # Or use webhook notification
    # curl -X POST -H 'Content-type: application/json' --data '{"text":"SIMDAG backup completed"}' YOUR_WEBHOOK_URL
    
    print_status "INFO" "Backup process completed"
    log_message "Backup process completed successfully"
}

# Main execution
main() {
    print_status "INFO" "Starting SIMDAG database backup process"
    log_message "=== Starting SIMDAG database backup process ==="
    
    # Check if password is provided
    if [ -z "$DB_PASSWORD" ]; then
        print_status "WARNING" "DB_PASSWORD not set. Please set it as environment variable or in .pgpass file"
        log_message "WARNING: DB_PASSWORD not set"
    fi
    
    create_backup_dir
    check_postgresql
    test_connection
    create_backup
    verify_backup
    get_backup_stats
    clean_old_backups
    send_notification
    
    print_status "SUCCESS" "Backup process completed successfully!"
    log_message "=== Backup process completed successfully ==="
}

# Handle script arguments
case "$1" in
    "--help" | "-h")
        echo "SIMDAG Database Backup Script"
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --test, -t     Test database connection only"
        echo "  --clean, -c    Clean old backups only"
        echo "  --verify, -v   Verify existing backups"
        echo ""
        echo "Environment Variables:"
        echo "  DB_PASSWORD    Database password (required)"
        echo ""
        echo "Examples:"
        echo "  DB_PASSWORD='your_password' $0"
        echo "  $0 --test"
        echo "  $0 --clean"
        exit 0
        ;;
    "--test" | "-t")
        check_postgresql
        test_connection
        print_status "SUCCESS" "Database connection test passed"
        exit 0
        ;;
    "--clean" | "-c")
        create_backup_dir
        clean_old_backups
        exit 0
        ;;
    "--verify" | "-v")
        # Verify all existing backups
        for backup in "$BACKUP_DIR"/simdag_backup_*.custom; do
            if [ -f "$backup" ]; then
                if pg_restore --list "$backup" > /dev/null 2>&1; then
                    print_status "SUCCESS" "$(basename "$backup") - OK"
                else
                    print_status "ERROR" "$(basename "$backup") - CORRUPTED"
                fi
            fi
        done
        exit 0
        ;;
    "")
        # Run main backup process
        main
        ;;
    *)
        print_status "ERROR" "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

# Setup cron job example:
# Add this line to crontab (crontab -e):
# 0 2 * * * DB_PASSWORD='your_password' /home/bowo/backup-database.sh >> /home/bowo/backups/cron.log 2>&1

# Restore backup examples:
# From custom format: pg_restore -h localhost -U simdag_user -d simdag_db /home/bowo/backups/simdag_backup_20231201_020000.custom
# From SQL format: gunzip -c /home/bowo/backups/simdag_backup_20231201_020000.sql.gz | psql -h localhost -U simdag_user -d simdag_db