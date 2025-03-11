module.exports = {
  apps: [
    {
      name: 'strategic-sync',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      max_memory_restart: '1G',
      restart_delay: 3000,
      max_restarts: 10,
      autorestart: true,
      exp_backoff_restart_delay: 100
    }
  ]
}; 