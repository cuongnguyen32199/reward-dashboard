module.exports = {
  apps : [
    {
      name: 'NextExpress',
      script: 'yarn start',
      cwd: '/home/ubuntu/actions-runner/next-express/reward-dashboard/reward-dashboard',
      watch: false
    }
  ],
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
