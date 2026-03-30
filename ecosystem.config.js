// PM2 Ecosystem Configuration
// All Diploma Projects - TMDDI Group 3541
// Run: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    // 1. Batyr Akyýew - WAF Behavioral Analysis
    {
      name: 'batyr-backend',
      script: 'npm',
      args: 'start',
      cwd: './batyr akyýew 1/backend',
      env: { PORT: 7011 }
    },
    {
      name: 'batyr-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './batyr akyýew 1/frontend',
      env: { PORT: 7010 }
    },

    // 2. Bayram Gochmyradow - Android Security
    {
      name: 'bayram-backend',
      script: 'npm',
      args: 'start',
      cwd: './bayram gochmyradow 1/backend',
      env: { PORT: 7021 }
    },
    {
      name: 'bayram-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './bayram gochmyradow 1/frontend',
      env: { PORT: 7020 }
    },

    // 3. Daniyar Nurmedow - XSS Shield
    {
      name: 'daniyar-backend',
      script: 'npm',
      args: 'start',
      cwd: './daniyar nurmedow 1/backend',
      env: { PORT: 7031 }
    },
    {
      name: 'daniyar-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './daniyar nurmedow 1/frontend',
      env: { PORT: 7030 }
    },

    // 4. Dawutmuhammet Begmedow - VirusDetect
    {
      name: 'dawut-backend',
      script: 'npm',
      args: 'start',
      cwd: './dawutmuhammet begmedow 1/backend',
      env: { PORT: 7041 }
    },
    {
      name: 'dawut-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './dawutmuhammet begmedow 1/frontend',
      env: { PORT: 7040 }
    },

    // 5. Rowshen Palwanow - KeyGuard
    {
      name: 'rowshen-backend',
      script: 'npm',
      args: 'start',
      cwd: './rowshen palwanow 0/backend',
      env: { PORT: 7051 }
    },
    {
      name: 'rowshen-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './rowshen palwanow 0/frontend',
      env: { PORT: 7050 }
    },

    // 6. Selbi Weliyyewa - GAN Security
    {
      name: 'selbi-backend',
      script: 'npm',
      args: 'start',
      cwd: './selbi weliyyewa 1/backend',
      env: { PORT: 7061 }
    },
    {
      name: 'selbi-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './selbi weliyyewa 1/frontend',
      env: { PORT: 7060 }
    },

    // 7. Shanur Gulmyradow - Wireshark Monitor
    {
      name: 'shanur-backend',
      script: 'npm',
      args: 'start',
      cwd: './shanur gulmyradow 1/backend',
      env: { PORT: 7071 }
    },
    {
      name: 'shanur-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './shanur gulmyradow 1/frontend',
      env: { PORT: 7070 }
    },

    // 8. Shatlyk Rahmanov - AI Firewall
    {
      name: 'shatlyk-backend',
      script: 'npm',
      args: 'start',
      cwd: './shatlyk rahmanov 0/backend',
      env: { PORT: 7081 }
    },
    {
      name: 'shatlyk-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './shatlyk rahmanov 0/frontend',
      env: { PORT: 7080 }
    },

    // 9. Suleyman Akmuhammedow - OSINT.AI
    {
      name: 'suleyman-backend',
      script: 'npm',
      args: 'start',
      cwd: './suleyman akmuhammedow 0/backend',
      env: { PORT: 7091 }
    },
    {
      name: 'suleyman-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './suleyman akmuhammedow 0/frontend',
      env: { PORT: 7090 }
    }
  ]
}
