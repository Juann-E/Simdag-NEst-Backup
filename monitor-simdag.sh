#!/bin/bash

# SIMDAG Application Monitoring Script
# This script monitors the health of SIMDAG application components
# Copy this file to /home/bowo/ on the server

# Configuration
APP_NAME="simdag-backend"
FRONTEND_URL="http://localhost"
BACKEND_URL="http://localhost:3000/api"
DB_NAME="simdag_db"
DB_USER="simdag_user"
DB_HOST="localhost"
DB_PORT="5432"

# Notification settings
ALERT_EMAIL="admin@example.com"  # Change this
WEBHOOK_URL=""  # Optional: Slack/Discord webhook

# Thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=85
RESPONSE_TIME_THRESHOLD=5  # seconds

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Log file
LOG_FILE="/home/bowo/logs/monitor.log"
STATUS_FILE="/home/bowo/logs/status.json"

# Create logs directory
mkdir -p /home/bowo/logs

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to print colored output
print_status() {
    case $1 in
        "OK")
            echo -e "${GREEN}[OK]${NC} $2"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $2"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $2"
            ;;
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $2"
            ;;
    esac
}

# Function to send alert
send_alert() {
    local message="$1"
    local severity="$2"
    
    log_message "ALERT [$severity]: $message"
    
    # Email notification (requires mailutils)
    if command -v mail >/dev/null 2>&1 && [ -n "$ALERT_EMAIL" ]; then
        echo "$message" | mail -s "SIMDAG Alert [$severity]" "$ALERT_EMAIL"
    fi
    
    # Webhook notification
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"SIMDAG Alert [$severity]: $message\"}" \
            "$WEBHOOK_URL" >/dev/null 2>&1
    fi
}

# Check PM2 application status
check_pm2_status() {
    print_status "INFO" "Checking PM2 application status..."
    
    if ! command -v pm2 >/dev/null 2>&1; then
        print_status "ERROR" "PM2 is not installed"
        send_alert "PM2 is not installed on the server" "CRITICAL"
        return 1
    fi
    
    local status=$(pm2 jlist | jq -r ".[] | select(.name==\"$APP_NAME\") | .pm2_env.status" 2>/dev/null)
    
    if [ "$status" = "online" ]; then
        print_status "OK" "$APP_NAME is running"
        return 0
    elif [ "$status" = "stopped" ]; then
        print_status "ERROR" "$APP_NAME is stopped"
        send_alert "$APP_NAME application is stopped" "CRITICAL"
        
        # Auto-restart attempt
        print_status "INFO" "Attempting to restart $APP_NAME..."
        if pm2 restart "$APP_NAME" >/dev/null 2>&1; then
            print_status "OK" "$APP_NAME restarted successfully"
            log_message "Auto-restarted $APP_NAME"
        else
            print_status "ERROR" "Failed to restart $APP_NAME"
            send_alert "Failed to auto-restart $APP_NAME" "CRITICAL"
        fi
        return 1
    else
        print_status "ERROR" "$APP_NAME status unknown or not found"
        send_alert "$APP_NAME application not found in PM2" "CRITICAL"
        return 1
    fi
}

# Check application memory and CPU usage
check_resource_usage() {
    print_status "INFO" "Checking resource usage..."
    
    # Get PM2 app info
    local app_info=$(pm2 jlist | jq -r ".[] | select(.name==\"$APP_NAME\")" 2>/dev/null)
    
    if [ -n "$app_info" ]; then
        local memory_mb=$(echo "$app_info" | jq -r '.monit.memory' | awk '{print int($1/1024/1024)}')
        local cpu_percent=$(echo "$app_info" | jq -r '.monit.cpu')
        
        print_status "INFO" "Memory usage: ${memory_mb}MB, CPU: ${cpu_percent}%"
        
        # Check memory threshold (assuming 1GB total for app)
        if [ "$memory_mb" -gt 800 ]; then
            print_status "WARNING" "High memory usage: ${memory_mb}MB"
            send_alert "High memory usage detected: ${memory_mb}MB" "WARNING"
        fi
        
        # Check CPU threshold
        if (( $(echo "$cpu_percent > $CPU_THRESHOLD" | bc -l) )); then
            print_status "WARNING" "High CPU usage: ${cpu_percent}%"
            send_alert "High CPU usage detected: ${cpu_percent}%" "WARNING"
        fi
    fi
    
    # Check system resources
    local system_memory=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    local system_cpu=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    
    print_status "INFO" "System - Memory: ${system_memory}%, CPU: ${system_cpu}%"
    
    if [ "$system_memory" -gt "$MEMORY_THRESHOLD" ]; then
        print_status "WARNING" "High system memory usage: ${system_memory}%"
        send_alert "High system memory usage: ${system_memory}%" "WARNING"
    fi
}

# Check disk usage
check_disk_usage() {
    print_status "INFO" "Checking disk usage..."
    
    local disk_usage=$(df /home | tail -1 | awk '{print $5}' | sed 's/%//')
    
    print_status "INFO" "Disk usage: ${disk_usage}%"
    
    if [ "$disk_usage" -gt "$DISK_THRESHOLD" ]; then
        print_status "WARNING" "High disk usage: ${disk_usage}%"
        send_alert "High disk usage detected: ${disk_usage}%" "WARNING"
    else
        print_status "OK" "Disk usage normal: ${disk_usage}%"
    fi
}

# Check database connection
check_database() {
    print_status "INFO" "Checking database connection..."
    
    if ! systemctl is-active --quiet postgresql; then
        print_status "ERROR" "PostgreSQL service is not running"
        send_alert "PostgreSQL service is down" "CRITICAL"
        return 1
    fi
    
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" >/dev/null 2>&1; then
        print_status "OK" "Database connection successful"
        
        # Check database size
        local db_size=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" 2>/dev/null | xargs)
        print_status "INFO" "Database size: $db_size"
        
        return 0
    else
        print_status "ERROR" "Database connection failed"
        send_alert "Database connection failed" "CRITICAL"
        return 1
    fi
}

# Check Nginx status
check_nginx() {
    print_status "INFO" "Checking Nginx status..."
    
    if systemctl is-active --quiet nginx; then
        print_status "OK" "Nginx is running"
        
        # Test Nginx configuration
        if nginx -t >/dev/null 2>&1; then
            print_status "OK" "Nginx configuration is valid"
        else
            print_status "ERROR" "Nginx configuration has errors"
            send_alert "Nginx configuration errors detected" "WARNING"
        fi
        
        return 0
    else
        print_status "ERROR" "Nginx is not running"
        send_alert "Nginx web server is down" "CRITICAL"
        
        # Auto-restart attempt
        print_status "INFO" "Attempting to restart Nginx..."
        if sudo systemctl restart nginx >/dev/null 2>&1; then
            print_status "OK" "Nginx restarted successfully"
            log_message "Auto-restarted Nginx"
        else
            print_status "ERROR" "Failed to restart Nginx"
            send_alert "Failed to auto-restart Nginx" "CRITICAL"
        fi
        return 1
    fi
}

# Check HTTP endpoints
check_http_endpoints() {
    print_status "INFO" "Checking HTTP endpoints..."
    
    # Check frontend
    local frontend_response=$(curl -s -o /dev/null -w "%{http_code}:%{time_total}" "$FRONTEND_URL" --max-time 10 2>/dev/null)
    local frontend_code=$(echo "$frontend_response" | cut -d: -f1)
    local frontend_time=$(echo "$frontend_response" | cut -d: -f2)
    
    if [ "$frontend_code" = "200" ]; then
        print_status "OK" "Frontend accessible (${frontend_time}s)"
        
        if (( $(echo "$frontend_time > $RESPONSE_TIME_THRESHOLD" | bc -l) )); then
            print_status "WARNING" "Frontend response time slow: ${frontend_time}s"
            send_alert "Frontend response time is slow: ${frontend_time}s" "WARNING"
        fi
    else
        print_status "ERROR" "Frontend not accessible (HTTP $frontend_code)"
        send_alert "Frontend is not accessible (HTTP $frontend_code)" "CRITICAL"
    fi
    
    # Check backend API
    local backend_response=$(curl -s -o /dev/null -w "%{http_code}:%{time_total}" "$BACKEND_URL/health" --max-time 10 2>/dev/null)
    local backend_code=$(echo "$backend_response" | cut -d: -f1)
    local backend_time=$(echo "$backend_response" | cut -d: -f2)
    
    if [ "$backend_code" = "200" ]; then
        print_status "OK" "Backend API accessible (${backend_time}s)"
        
        if (( $(echo "$backend_time > $RESPONSE_TIME_THRESHOLD" | bc -l) )); then
            print_status "WARNING" "Backend response time slow: ${backend_time}s"
            send_alert "Backend API response time is slow: ${backend_time}s" "WARNING"
        fi
    else
        print_status "ERROR" "Backend API not accessible (HTTP $backend_code)"
        send_alert "Backend API is not accessible (HTTP $backend_code)" "CRITICAL"
    fi
}

# Check log files for errors
check_logs() {
    print_status "INFO" "Checking recent log files for errors..."
    
    # Check PM2 logs for errors in last 10 minutes
    local recent_errors=$(pm2 logs "$APP_NAME" --lines 100 --nostream 2>/dev/null | grep -i "error\|exception\|fatal" | tail -5)
    
    if [ -n "$recent_errors" ]; then
        print_status "WARNING" "Recent errors found in application logs"
        log_message "Recent errors: $recent_errors"
    else
        print_status "OK" "No recent errors in application logs"
    fi
    
    # Check Nginx error logs
    if [ -f "/var/log/nginx/simdag_error.log" ]; then
        local nginx_errors=$(tail -20 /var/log/nginx/simdag_error.log 2>/dev/null | grep "$(date '+%Y/%m/%d')" | wc -l)
        if [ "$nginx_errors" -gt 0 ]; then
            print_status "WARNING" "$nginx_errors Nginx errors found today"
        else
            print_status "OK" "No Nginx errors today"
        fi
    fi
}

# Generate status report
generate_status_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local uptime=$(uptime -p)
    
    cat > "$STATUS_FILE" << EOF
{
  "timestamp": "$timestamp",
  "uptime": "$uptime",
  "services": {
    "pm2": "$(pm2 jlist | jq -r ".[] | select(.name==\"$APP_NAME\") | .pm2_env.status" 2>/dev/null || echo 'unknown')",
    "nginx": "$(systemctl is-active nginx 2>/dev/null || echo 'inactive')",
    "postgresql": "$(systemctl is-active postgresql 2>/dev/null || echo 'inactive')"
  },
  "resources": {
    "memory_percent": "$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')",
    "disk_percent": "$(df /home | tail -1 | awk '{print $5}' | sed 's/%//')"
  },
  "last_check": "$timestamp"
}
EOF
    
    print_status "INFO" "Status report saved to $STATUS_FILE"
}

# Main monitoring function
run_monitoring() {
    echo "=========================================="
    echo "SIMDAG Application Health Check"
    echo "Time: $(date)"
    echo "=========================================="
    
    log_message "=== Starting health check ==="
    
    local overall_status=0
    
    check_pm2_status || overall_status=1
    check_resource_usage
    check_disk_usage
    check_database || overall_status=1
    check_nginx || overall_status=1
    check_http_endpoints || overall_status=1
    check_logs
    
    generate_status_report
    
    echo "=========================================="
    if [ $overall_status -eq 0 ]; then
        print_status "OK" "All systems operational"
        log_message "Health check completed - All systems OK"
    else
        print_status "ERROR" "Some issues detected - check logs"
        log_message "Health check completed - Issues detected"
    fi
    echo "=========================================="
    
    return $overall_status
}

# Handle script arguments
case "$1" in
    "--help" | "-h")
        echo "SIMDAG Application Monitoring Script"
        echo "Usage: $0 [options]"
        echo ""
        echo "Options:"
        echo "  --help, -h      Show this help message"
        echo "  --status, -s    Show current status only"
        echo "  --logs, -l      Show recent logs"
        echo "  --restart, -r   Restart all services"
        echo "  --quiet, -q     Run in quiet mode (no output)"
        echo ""
        echo "Environment Variables:"
        echo "  DB_PASSWORD     Database password"
        echo "  ALERT_EMAIL     Email for alerts"
        echo "  WEBHOOK_URL     Webhook URL for notifications"
        exit 0
        ;;
    "--status" | "-s")
        if [ -f "$STATUS_FILE" ]; then
            cat "$STATUS_FILE" | jq .
        else
            echo "No status file found. Run monitoring first."
        fi
        exit 0
        ;;
    "--logs" | "-l")
        echo "=== Recent Application Logs ==="
        pm2 logs "$APP_NAME" --lines 20 --nostream 2>/dev/null || echo "No PM2 logs found"
        echo ""
        echo "=== Recent Nginx Error Logs ==="
        tail -10 /var/log/nginx/simdag_error.log 2>/dev/null || echo "No Nginx error logs found"
        exit 0
        ;;
    "--restart" | "-r")
        print_status "INFO" "Restarting all services..."
        pm2 restart "$APP_NAME"
        sudo systemctl restart nginx
        sudo systemctl restart postgresql
        print_status "OK" "All services restarted"
        exit 0
        ;;
    "--quiet" | "-q")
        run_monitoring >/dev/null 2>&1
        exit $?
        ;;
    "")
        run_monitoring
        exit $?
        ;;
    *)
        echo "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac

# Setup cron job examples:
# Every 5 minutes: */5 * * * * DB_PASSWORD='your_password' /home/bowo/monitor-simdag.sh --quiet
# Every hour with email: 0 * * * * DB_PASSWORD='your_password' ALERT_EMAIL='admin@example.com' /home/bowo/monitor-simdag.sh