const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 7005

app.use(cors())
app.use(express.json())

// GAN Attack Types Data
const attackTypes = {
  adversarial: {
    id: 'adversarial',
    name: 'Adversarial Examples',
    nameTk: 'Garşydaş Mysallar',
    description: 'Small perturbations to input that cause misclassification',
    riskLevel: 'high',
    methods: ['FGSM', 'PGD', 'C&W Attack', 'DeepFool'],
    effectiveness: 85
  },
  inversion: {
    id: 'inversion',
    name: 'Model Inversion',
    nameTk: 'Model Tersleşdirme',
    description: 'Reconstructing training data from model outputs',
    riskLevel: 'critical',
    methods: ['Gradient-based Inversion', 'Optimization Attack'],
    effectiveness: 70
  },
  membership: {
    id: 'membership',
    name: 'Membership Inference',
    nameTk: 'Agzalyk Netijesi',
    description: 'Determining if a sample was in training data',
    riskLevel: 'medium',
    methods: ['Shadow Model Attack', 'Threshold-based Attack'],
    effectiveness: 65
  },
  poisoning: {
    id: 'poisoning',
    name: 'Data Poisoning',
    nameTk: 'Maglumat Zäherleme',
    description: 'Corrupting training data to manipulate model behavior',
    riskLevel: 'critical',
    methods: ['Backdoor Attack', 'Clean-label Attack'],
    effectiveness: 90
  }
}

// Defense Mechanisms Data
const defenseMechanisms = {
  adversarialTraining: {
    id: 'adversarialTraining',
    name: 'Adversarial Training',
    nameTk: 'Garşydaş Türgenleşik',
    description: 'Training with adversarial examples to improve robustness',
    effectiveness: 85,
    complexity: 'medium'
  },
  inputPreprocessing: {
    id: 'inputPreprocessing',
    name: 'Input Preprocessing',
    nameTk: 'Giriş Öňünden Işlemek',
    description: 'Sanitizing inputs before feeding to the model',
    effectiveness: 70,
    complexity: 'low'
  },
  differentialPrivacy: {
    id: 'differentialPrivacy',
    name: 'Differential Privacy',
    nameTk: 'Diferensial Gizlinlik',
    description: 'Adding noise to protect training data privacy',
    effectiveness: 90,
    complexity: 'high'
  }
}

// API Routes
app.get('/api/attacks', (req, res) => {
  res.json({ success: true, attacks: Object.values(attackTypes) })
})

app.get('/api/attacks/:id', (req, res) => {
  const attack = attackTypes[req.params.id]
  if (attack) {
    res.json({ success: true, attack })
  } else {
    res.status(404).json({ success: false, error: 'Attack not found' })
  }
})

app.get('/api/defenses', (req, res) => {
  res.json({ success: true, defenses: Object.values(defenseMechanisms) })
})

app.post('/api/simulate', (req, res) => {
  const { attackType, strength } = req.body

  // Simulate attack results
  const perturbation = 0.01 + (strength / 100) * 0.1
  const confidence = Math.max(10, Math.round(95 - (strength / 100) * 60))
  const success = strength > 30
  const detected = strength > 60

  res.json({
    success: true,
    results: {
      attackType,
      strength,
      perturbation,
      confidence,
      attackSuccess: success,
      defenseDetected: detected,
      timestamp: new Date().toISOString()
    }
  })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GAN Security API is running',
    version: '1.0.0'
  })
})

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                 GAN Security Backend Server                   ║
║                       Version 1.0.0                           ║
╚══════════════════════════════════════════════════════════════╝

Server running on http://localhost:${PORT}
  `)
})
