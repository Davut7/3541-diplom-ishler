# WAF Integration Guide / WAF Интеграция Гидлери

## Overview / Syn

This WAF (Web Application Firewall) can be integrated with any Express.js or Node.js server to provide real-time protection against web attacks.

Bu WAF (Web Application Firewall) islendik Express.js ýa-da Node.js serwerlerine birleşdirilip, web hüjümlerine garşy hakyky wagtda gorag üpjün edip biler.

---

## Integration Methods / Integrasiýa Usullary

### Method 1: Proxy Mode (Recommended for existing servers)
### Usul 1: Proksi Režimi (Bar bolan serwerler üçin maslahat berilýär)

In this mode, the WAF server acts as a reverse proxy, analyzing all requests before forwarding them to your application.

Bu režimde, WAF serweri ters proksi hökmünde işleýär, ähli talaplary programmaňyza ugratmazdan öň derňeýär.

```javascript
// Your existing server (backend.js)
const express = require('express');
const app = express();

// WAF Middleware
const WAF_SERVER = 'http://localhost:4001';

const wafMiddleware = async (req, res, next) => {
  try {
    const response = await fetch(`${WAF_SERVER}/api/waf/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        headers: req.headers,
        ip: req.ip || req.socket.remoteAddress,
        sessionId: req.sessionID || 'anonymous'
      })
    });

    const analysis = await response.json();
    req.wafAnalysis = analysis;

    if (analysis.blocked) {
      return res.status(403).json({
        error: 'Request blocked by WAF',
        reason: analysis.reason,
        riskScore: analysis.riskScore
      });
    }

    next();
  } catch (error) {
    // If WAF is unavailable, allow request (fail-open)
    console.warn('WAF unavailable:', error.message);
    next();
  }
};

// Apply WAF to all routes
app.use(express.json());
app.use(wafMiddleware);

// Your routes
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000);
```

### Method 2: Direct Integration (For new projects)
### Usul 2: Göni Integrasiýa (Täze taslamalar üçin)

Copy the WAF analysis functions directly into your project.

WAF derňew funksiýalaryny göni taslamaňyza göçüriň.

```javascript
// waf.js - Copy this to your project
const attackPatterns = {
  sqlInjection: {
    name: 'SQL Injection',
    patterns: ["' OR '1'='1", "'; DROP TABLE", "UNION SELECT", "1=1--"]
  },
  xss: {
    name: 'XSS',
    patterns: ['<script>', 'javascript:', 'onerror=', '<img src=x']
  },
  pathTraversal: {
    name: 'Path Traversal',
    patterns: ['../', '..\\', '/etc/passwd']
  },
  commandInjection: {
    name: 'Command Injection',
    patterns: ['; ls', '| cat', '&& rm', '`whoami`']
  }
};

function analyzeRequest(content) {
  const threats = [];
  let riskScore = 0;
  const lowerContent = content.toLowerCase();

  for (const [key, attack] of Object.entries(attackPatterns)) {
    for (const pattern of attack.patterns) {
      if (lowerContent.includes(pattern.toLowerCase())) {
        threats.push({ type: attack.name, pattern });
        riskScore += 30;
        break;
      }
    }
  }

  return {
    isBlocked: riskScore >= 30,
    riskScore: Math.min(riskScore, 100),
    threats
  };
}

module.exports = { analyzeRequest };
```

---

## API Endpoints for Integration / Integrasiýa üçin API Endpointler

### POST /api/waf/analyze
Analyze a request and get WAF decision.

```bash
curl -X POST http://localhost:4001/api/waf/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "/api/users?id=1",
    "method": "GET",
    "body": {},
    "headers": {"user-agent": "Mozilla/5.0"},
    "ip": "192.168.1.100"
  }'
```

Response:
```json
{
  "blocked": false,
  "reason": "Clean request",
  "riskScore": 0,
  "action": "allow",
  "threats": [],
  "behavioral": {
    "score": 0,
    "isBot": false,
    "anomalies": []
  }
}
```

### GET /api/waf/status
Check WAF server status.

```bash
curl http://localhost:4001/api/waf/status
```

Response:
```json
{
  "status": "active",
  "version": "2.0.0",
  "activeRules": 8,
  "blockedIPs": 3,
  "totalAttacks": 150
}
```

### GET /api/waf/middleware-code
Get ready-to-use middleware code.

```bash
curl http://localhost:4001/api/waf/middleware-code
```

---

## Docker Deployment / Docker Deploymentи

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4001
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  waf:
    build: ./backend
    ports:
      - "4001:4001"
    volumes:
      - waf_data:/app/data
    restart: always

  your-app:
    build: ./your-app
    ports:
      - "3000:3000"
    depends_on:
      - waf
    environment:
      - WAF_SERVER=http://waf:4001

volumes:
  waf_data:
```

---

## Environment Configuration / Daşky Gurşaw Sazlamalary

```bash
# .env file
WAF_PORT=4001
WAF_HOST=0.0.0.0
JWT_SECRET=your-secret-key
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

---

## Testing the Integration / Integrasiýany Synag

```bash
# Test SQL Injection detection
curl -X POST http://localhost:4001/api/test-attack \
  -H "Content-Type: application/json" \
  -d '{"attackType": "sql"}'

# Test XSS detection
curl -X POST http://localhost:4001/api/test-attack \
  -H "Content-Type: application/json" \
  -d '{"attackType": "xss"}'

# Generate test data
curl -X POST http://localhost:4001/api/generate-test-data \
  -H "Content-Type: application/json" \
  -d '{"count": 100}'
```

---

## Features / Aýratynlyklar

1. **SQL Injection Protection** - Detects and blocks SQL injection attacks
2. **XSS Protection** - Blocks cross-site scripting attempts
3. **Path Traversal Protection** - Prevents directory traversal attacks
4. **Command Injection Protection** - Blocks OS command injection
5. **Rate Limiting** - Limits requests per IP (100 req/min)
6. **Bot Detection** - Identifies bot traffic using User-Agent analysis
7. **IP Geolocation** - Shows attacker location data
8. **Behavioral Analysis** - Detects anomalous user behavior
9. **Real-time Logging** - All attacks logged to SQLite database
10. **PDF Reports** - Generate security reports
11. **Email Alerts** - Send email notifications for critical attacks

---

## Author / Awtor

**Batyr Akyýew**
Diploma Project: Web Application Firewall with Behavioral Analysis
Diplom Taslamasy: Ulanyjynyň hereketine görä işleýän web gorag ulgamy

---

## Quick Start / Çalt Başlangyç

```bash
# Clone and setup
cd backend
npm install

# Start WAF server
npm start

# Server running at http://localhost:4001

# Test endpoints
curl http://localhost:4001/api/health
curl http://localhost:4001/api/waf/status
```
