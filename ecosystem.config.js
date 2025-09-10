// PM2 Ecosystem Configuration for SIMDAG
// Copy this file to /home/bowo/deployment-package/backend/ on the server

module.exports = {
  apps: [
    {
      name: 'simdag-backend',
      script: './dist/main.js',
      cwd: '/home/bowo/deployment-package/backend',
      
      // Instance configuration
      instances: 1, // Change to 'max' for cluster mode
      exec_mode: 'fork', // or 'cluster'
      
      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Logging
      log_file: '/home/bowo/logs/simdag-combined.log',
      out_file: '/home/bowo/logs/simdag-out.log',
      error_file: '/home/bowo/logs/simdag-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart configuration
      watch: false, // Set to true for development
      ignore_watch: ['node_modules', 'logs', 'uploads'],
      
      // Memory and CPU limits
      max_memory_restart: '500M',
      
      // Restart configuration
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Advanced options
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 8000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Source map support
      source_map_support: true,
      
      // Merge logs
      merge_logs: true,
      
      // Time zone
      time: true,
      
      // Interpreter options
      node_args: '--max-old-space-size=512',
      
      // Cron restart (optional - restart every day at 3 AM)
      // cron_restart: '0 3 * * *',
      
      // Auto restart on file change (development only)
      // watch: ['dist'],
      // watch_delay: 1000,
      
      // Custom startup script (if needed)
      // script: 'npm',
      // args: 'start',
      
      // Environment-specific configurations
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Add other production-specific variables here
      },
      
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        // Add other development-specific variables here
      }
    }
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      user: 'bowo',
      host: '10.10.11.149',
      ref: 'origin/main',
      repo: 'git@github.com:username/simdag.git', // Update with actual repo
      path: '/home/bowo/deployment-package',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

/*
Usage Commands:

1. Start application:
   pm2 start ecosystem.config.js --env production

2. Restart application:
   pm2 restart simdag-backend

3. Stop application:
   pm2 stop simdag-backend

4. Delete application:
   pm2 delete simdag-backend

5. Monitor applications:
   pm2 monit

6. View logs:
   pm2 logs simdag-backend
   pm2 logs simdag-backend --lines 100

7. Reload application (zero-downtime):
   pm2 reload simdag-backend

8. Save PM2 configuration:
   pm2 save

9. Resurrect saved processes:
   pm2 resurrect

10. Setup startup script:
    pm2 startup
    # Follow the instructions provided

11. Show application info:
    pm2 show simdag-backend

12. Reset restart counter:
    pm2 reset simdag-backend

13. Flush logs:
    pm2 flush

Monitoring:
- Web monitoring: pm2 plus (https://app.pm2.io/)
- Real-time monitoring: pm2 monit
- Status: pm2 status
- Memory usage: pm2 show simdag-backend

Troubleshooting:
- If app keeps restarting: Check logs with 'pm2 logs simdag-backend'
- If app won't start: Check environment variables and file permissions
- If high memory usage: Adjust max_memory_restart value
- If slow startup: Increase listen_timeout value
*/