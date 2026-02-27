// PM2 Ecosystem Configuration
// All Diploma Projects - TMDDI Group 3541
// Run: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    // ============================================
    // 1. Batyr Akyýew - WAF Behavioral Analysis
    // Frontend: http://localhost:3001
    // Backend: http://localhost:4001
    // ============================================
    {
      name: 'batyr-backend',
      script: 'npm',
      args: 'start',
      cwd: './batyr akyýew/backend',
      env: { PORT: 4001 }
    },
    {
      name: 'batyr-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './batyr akyýew/frontend',
      env: { PORT: 3001 }
    },

    // ============================================
    // 2. Bayram Gochmyradow - Network Traffic Analysis
    // Frontend: http://localhost:3002
    // Backend: http://localhost:4002
    // ============================================
    {
      name: 'bayram-backend',
      script: 'npm',
      args: 'start',
      cwd: './bayram gochmyradow/backend',
      env: { PORT: 4002 }
    },
    {
      name: 'bayram-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './bayram gochmyradow/frontend',
      env: { PORT: 3002 }
    },

    // ============================================
    // 3. Daniyar Nurmedow - Intrusion Detection System
    // Frontend: http://localhost:3003
    // Backend: http://localhost:4003
    // ============================================
    {
      name: 'daniyar-backend',
      script: 'npm',
      args: 'start',
      cwd: './daniyar nurmedow/backend',
      env: { PORT: 4003 }
    },
    {
      name: 'daniyar-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './daniyar nurmedow/frontend',
      env: { PORT: 3003 }
    },

    // ============================================
    // 4. Dawutmuhammet Begmedow - Vulnerability Scanner
    // Frontend: http://localhost:3004
    // Backend: http://localhost:4004
    // ============================================
    {
      name: 'dawut-backend',
      script: 'npm',
      args: 'start',
      cwd: './dawutmuhammet begmedow/backend',
      env: { PORT: 4004 }
    },
    {
      name: 'dawut-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './dawutmuhammet begmedow/frontend',
      env: { PORT: 3004 }
    },

    // ============================================
    // 5. Rowshen Orazmuhammedow - DDoS Protection
    // Frontend: http://localhost:3005
    // Backend: http://localhost:4005
    // ============================================
    {
      name: 'rowshen-backend',
      script: 'npm',
      args: 'start',
      cwd: './rowshen orazmuhammedow/backend',
      env: { PORT: 4005 }
    },
    {
      name: 'rowshen-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './rowshen orazmuhammedow/frontend',
      env: { PORT: 3005 }
    },

    // ============================================
    // 6. Selbi Weliyyewa - GAN Security Analysis
    // Frontend: http://localhost:3006
    // Backend: http://localhost:4006
    // ============================================
    {
      name: 'selbi-backend',
      script: 'npm',
      args: 'start',
      cwd: './selbi weliyyewa/backend',
      env: { PORT: 4006 }
    },
    {
      name: 'selbi-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './selbi weliyyewa/frontend',
      env: { PORT: 3006 }
    },

    // ============================================
    // 7. Shanur Gulmyradow - Network Packet Analyzer
    // Frontend: http://localhost:3007
    // Backend: http://localhost:4007
    // ============================================
    {
      name: 'shanur-backend',
      script: 'npm',
      args: 'start',
      cwd: './shanur gulmyradow/backend',
      env: { PORT: 4007 }
    },
    {
      name: 'shanur-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './shanur gulmyradow/frontend',
      env: { PORT: 3007 }
    },

    // ============================================
    // 8. Shatlyk Rahmanov - AI Firewall
    // Frontend: http://localhost:3008
    // Backend: http://localhost:4008
    // ============================================
    {
      name: 'shatlyk-backend',
      script: 'npm',
      args: 'start',
      cwd: './shatlyk rahmanov/backend',
      env: { PORT: 4008 }
    },
    {
      name: 'shatlyk-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './shatlyk rahmanov/frontend',
      env: { PORT: 3008 }
    },

    // ============================================
    // 9. Suleyman Akmuhammedow - OSINT AI Tools
    // Frontend: http://localhost:3009
    // Backend: http://localhost:4009
    // ============================================
    {
      name: 'suleyman-backend',
      script: 'npm',
      args: 'start',
      cwd: './suleyman akmuhammedow/backend',
      env: { PORT: 4009 }
    },
    {
      name: 'suleyman-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: './suleyman akmuhammedow/frontend',
      env: { PORT: 3009 }
    }
  ]
}
