const express = require('express')
const cors = require('cors')
const initSqlJs = require('sql.js')

const app = express()
const PORT = process.env.PORT || 7061

app.use(cors())
app.use(express.json())

// ============================================
// SQLite Database
// ============================================
let db

async function initDatabase() {
  const SQL = await initSqlJs()
  db = new SQL.Database()

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS simulations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attack_type TEXT NOT NULL,
      defense_type TEXT,
      strength INTEGER NOT NULL,
      target_layer TEXT NOT NULL,
      attack_success INTEGER NOT NULL,
      defense_detected INTEGER NOT NULL,
      perturbation REAL NOT NULL,
      confidence INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS statistics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attack_type TEXT NOT NULL,
      total_runs INTEGER DEFAULT 0,
      successful_attacks INTEGER DEFAULT 0,
      detected_attacks INTEGER DEFAULT 0,
      avg_perturbation REAL DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('Database initialized successfully')
}

// ============================================
// REAL GAN ATTACK DATA (Based on Research Papers)
// ============================================

const attackTypes = {
  fgsm: {
    id: 'fgsm',
    name: 'FGSM (Fast Gradient Sign Method)',
    nameTk: 'FGSM (Çalt Gradient Belgisi Usuly)',
    category: 'adversarial',
    description: 'Single-step attack that perturbs input in the direction of the gradient sign',
    descriptionTk: 'Gradient belgisiniň ugurda girişi üýtgedýän bir basgançakly hüjüm',
    year: 2014,
    authors: 'Goodfellow et al.',
    paper: 'Explaining and Harnessing Adversarial Examples (ICLR 2015)',
    riskLevel: 'high',
    successRate: 85,
    detectionDifficulty: 'medium',
    computationalCost: 'low',
    formula: 'x_adv = x + ε · sign(∇_x J(θ, x, y))',
    // Unique visual pattern for this attack
    visualPattern: {
      noiseType: 'gradient',
      colorShift: { r: 1.2, g: 0.9, b: 0.8 },
      patternFrequency: 0.3,
      edgeEnhance: true
    },
    parameters: {
      epsilon: { name: 'ε (epsilon)', typical: '0.01 - 0.3', description: 'Perturbation magnitude' }
    },
    realWorldExamples: [
      'Fooling image classifiers with imperceptible noise',
      'Bypassing facial recognition systems',
      'Manipulating autonomous vehicle perception'
    ],
    effectiveness: {
      againstCNN: 97,
      againstGAN: 85,
      againstDefensiveDistillation: 45,
      againstAdversarialTraining: 35
    }
  },
  pgd: {
    id: 'pgd',
    name: 'PGD (Projected Gradient Descent)',
    nameTk: 'PGD (Proýeksiýalanan Gradient Düşüşi)',
    category: 'adversarial',
    description: 'Iterative attack that takes multiple small steps with projection onto ε-ball',
    descriptionTk: 'Epsilon topuna proýeksiýa bilen birnäçe kiçi ädim atýan iteratiw hüjüm',
    year: 2017,
    authors: 'Madry et al.',
    paper: 'Towards Deep Learning Models Resistant to Adversarial Attacks (ICLR 2018)',
    riskLevel: 'critical',
    successRate: 95,
    detectionDifficulty: 'hard',
    computationalCost: 'medium',
    formula: 'x^(t+1) = Π_ε(x^t + α · sign(∇_x J(θ, x^t, y)))',
    // Unique visual pattern - iterative waves
    visualPattern: {
      noiseType: 'iterative',
      colorShift: { r: 0.85, g: 0.85, b: 1.3 },
      patternFrequency: 0.15,
      waveEffect: true,
      iterations: 10
    },
    parameters: {
      epsilon: { name: 'ε (epsilon)', typical: '0.01 - 0.1', description: 'Maximum perturbation' },
      alpha: { name: 'α (step size)', typical: 'ε/10', description: 'Step size per iteration' },
      iterations: { name: 'K (iterations)', typical: '40-100', description: 'Number of steps' }
    },
    realWorldExamples: [
      'State-of-the-art adversarial attack benchmark',
      'Testing model robustness in research',
      'Breaking defended models'
    ],
    effectiveness: {
      againstCNN: 99,
      againstGAN: 95,
      againstDefensiveDistillation: 65,
      againstAdversarialTraining: 55
    }
  },
  cw: {
    id: 'cw',
    name: 'C&W (Carlini & Wagner)',
    nameTk: 'C&W (Carlini & Wagner) Hüjümi',
    category: 'adversarial',
    description: 'Optimization-based attack minimizing perturbation while ensuring misclassification',
    descriptionTk: 'Nädogry klassifikasiýany üpjün edip, üýtgeşmäni azaldýan optimizasiýa esasly hüjüm',
    year: 2016,
    authors: 'Carlini & Wagner',
    paper: 'Towards Evaluating the Robustness of Neural Networks (IEEE S&P 2017)',
    riskLevel: 'critical',
    successRate: 100,
    detectionDifficulty: 'very hard',
    computationalCost: 'high',
    formula: 'minimize ||δ||_p + c·f(x+δ) such that x+δ ∈ [0,1]^n',
    // Minimal but precise perturbations
    visualPattern: {
      noiseType: 'optimized',
      colorShift: { r: 1.0, g: 1.1, b: 1.0 },
      patternFrequency: 0.5,
      sparse: true,
      precision: 'high'
    },
    parameters: {
      c: { name: 'c (confidence)', typical: '0.01-100', description: 'Confidence parameter' },
      kappa: { name: 'κ (kappa)', typical: '0-40', description: 'Margin for misclassification' },
      lr: { name: 'learning rate', typical: '0.01', description: 'Optimization learning rate' }
    },
    realWorldExamples: [
      'Breaking defensive distillation (100% success)',
      'Creating minimal perturbation attacks',
      'Academic benchmark for robustness'
    ],
    effectiveness: {
      againstCNN: 100,
      againstGAN: 98,
      againstDefensiveDistillation: 100,
      againstAdversarialTraining: 70
    }
  },
  deepfool: {
    id: 'deepfool',
    name: 'DeepFool',
    nameTk: 'DeepFool Hüjümi',
    category: 'adversarial',
    description: 'Finds minimal perturbation to cross decision boundary',
    descriptionTk: 'Karar serhedini geçmek üçin minimal üýtgeşmäni tapýar',
    year: 2016,
    authors: 'Moosavi-Dezfooli et al.',
    paper: 'DeepFool: A Simple and Accurate Method to Fool DNNs (CVPR 2016)',
    riskLevel: 'high',
    successRate: 90,
    detectionDifficulty: 'hard',
    computationalCost: 'medium',
    formula: 'r = argmin ||r||_2 s.t. sign(f(x+r)) ≠ sign(f(x))',
    // Smooth boundary crossing
    visualPattern: {
      noiseType: 'boundary',
      colorShift: { r: 1.1, g: 1.0, b: 1.15 },
      patternFrequency: 0.25,
      smooth: true,
      radial: true
    },
    parameters: {
      overshoot: { name: 'overshoot', typical: '0.02', description: 'Overshoot parameter' },
      maxIter: { name: 'max iterations', typical: '50', description: 'Maximum iterations' }
    },
    realWorldExamples: [
      'Measuring model robustness',
      'Understanding decision boundaries',
      'Minimal adversarial perturbations'
    ],
    effectiveness: {
      againstCNN: 92,
      againstGAN: 88,
      againstDefensiveDistillation: 55,
      againstAdversarialTraining: 40
    }
  },
  modelInversion: {
    id: 'modelInversion',
    name: 'Model Inversion Attack',
    nameTk: 'Model Tersleşdirme Hüjümi',
    category: 'privacy',
    description: 'Reconstructs training data by exploiting model outputs and confidence scores',
    descriptionTk: 'Model çykyşlaryny we ynam ballaryny ulanyp türgenleşik maglumatlaryny dikeldýär',
    year: 2015,
    authors: 'Fredrikson et al.',
    paper: 'Model Inversion Attacks that Exploit Confidence Information (CCS 2015)',
    riskLevel: 'critical',
    successRate: 78,
    detectionDifficulty: 'very hard',
    computationalCost: 'high',
    formula: 'x* = argmax_x P(y=target | x; θ)',
    // Ghostly reconstruction effect
    visualPattern: {
      noiseType: 'reconstruction',
      colorShift: { r: 0.7, g: 0.9, b: 1.2 },
      patternFrequency: 0.1,
      ghostEffect: true,
      layered: true
    },
    parameters: {
      targetClass: { name: 'target class', typical: 'any', description: 'Class to reconstruct' },
      iterations: { name: 'iterations', typical: '1000+', description: 'Optimization steps' }
    },
    realWorldExamples: [
      'Reconstructing faces from facial recognition models',
      'Extracting medical data from health prediction models',
      'Privacy breach in ML-as-a-Service'
    ],
    effectiveness: {
      againstCNN: 75,
      againstGAN: 85,
      againstDefensiveDistillation: 60,
      againstDifferentialPrivacy: 15
    }
  },
  membershipInference: {
    id: 'membershipInference',
    name: 'Membership Inference Attack',
    nameTk: 'Agzalyk Netije Hüjümi',
    category: 'privacy',
    description: 'Determines if a specific sample was used in model training',
    descriptionTk: 'Belli bir nusganyň model türgenleşiginde ulanylandygyny kesgitleýär',
    year: 2017,
    authors: 'Shokri et al.',
    paper: 'Membership Inference Attacks Against Machine Learning Models (IEEE S&P 2017)',
    riskLevel: 'high',
    successRate: 75,
    detectionDifficulty: 'medium',
    computationalCost: 'medium',
    formula: 'Attack(x) = 1 if f_attack(M(x)) > threshold else 0',
    // Binary detection pattern
    visualPattern: {
      noiseType: 'binary',
      colorShift: { r: 1.0, g: 1.3, b: 0.8 },
      patternFrequency: 0.4,
      binaryMask: true,
      scanlines: true
    },
    parameters: {
      shadowModels: { name: 'shadow models', typical: '10-100', description: 'Number of shadow models' },
      threshold: { name: 'threshold', typical: '0.5', description: 'Decision threshold' }
    },
    realWorldExamples: [
      'GDPR compliance violations',
      'Medical data privacy breaches',
      'Identifying individuals in training datasets'
    ],
    effectiveness: {
      againstCNN: 72,
      againstGAN: 68,
      againstDefensiveDistillation: 55,
      againstDifferentialPrivacy: 25
    }
  },
  dataPoisoning: {
    id: 'dataPoisoning',
    name: 'Data Poisoning Attack',
    nameTk: 'Maglumat Zäherleme Hüjümi',
    category: 'training',
    description: 'Injects malicious samples into training data to manipulate model behavior',
    descriptionTk: 'Model özüni alyp barşyny dolandyrmak üçin türgenleşik maglumatlaryna zyýanly nusgalar goşýar',
    year: 2017,
    authors: 'Gu et al.',
    paper: 'BadNets: Identifying Vulnerabilities in the ML Model Supply Chain (NIPS 2017)',
    riskLevel: 'critical',
    successRate: 92,
    detectionDifficulty: 'very hard',
    computationalCost: 'low',
    formula: 'D_poisoned = D_clean ∪ {(x_i + trigger, y_target)}',
    // Poison/trigger pattern
    visualPattern: {
      noiseType: 'trigger',
      colorShift: { r: 0.8, g: 1.4, b: 0.7 },
      patternFrequency: 0.6,
      triggerSpot: true,
      toxicGreen: true
    },
    parameters: {
      poisonRate: { name: 'poison rate', typical: '1-10%', description: 'Fraction of poisoned data' },
      triggerSize: { name: 'trigger size', typical: '3x3 pixels', description: 'Backdoor trigger size' }
    },
    realWorldExamples: [
      'Backdoor attacks on autonomous vehicles',
      'Compromising federated learning',
      'Supply chain attacks on ML pipelines'
    ],
    effectiveness: {
      againstCNN: 95,
      againstGAN: 92,
      againstDefensiveDistillation: 90,
      againstInputValidation: 45
    }
  },
  modelStealing: {
    id: 'modelStealing',
    name: 'Model Stealing/Extraction',
    nameTk: 'Model Ogurlamak/Çykarmak',
    category: 'intellectual_property',
    description: 'Creates a functionally equivalent copy of target model through API queries',
    descriptionTk: 'API soraglary arkaly nyşana modeliň funksional taýdan deň göçürmesini döredýär',
    year: 2016,
    authors: 'Tramèr et al.',
    paper: 'Stealing Machine Learning Models via Prediction APIs (USENIX 2016)',
    riskLevel: 'high',
    successRate: 85,
    detectionDifficulty: 'hard',
    computationalCost: 'medium',
    formula: 'M_stolen = Train(D_synthetic, Labels_from_M_target)',
    // Copy/mirror effect
    visualPattern: {
      noiseType: 'copy',
      colorShift: { r: 0.9, g: 0.9, b: 1.1 },
      patternFrequency: 0.2,
      mirror: true,
      fadeEdges: true
    },
    parameters: {
      queries: { name: 'queries', typical: '10K-1M', description: 'Number of API queries' },
      budget: { name: 'query budget', typical: '$100-$10000', description: 'Cost of queries' }
    },
    realWorldExamples: [
      'Copying commercial ML APIs',
      'Stealing proprietary trading algorithms',
      'Replicating recommendation systems'
    ],
    effectiveness: {
      againstCNN: 88,
      againstGAN: 82,
      againstAPIRateLimiting: 65,
      againstWatermarking: 40
    }
  },
  modeCollapse: {
    id: 'modeCollapse',
    name: 'Mode Collapse Exploitation',
    nameTk: 'Rejim Çöküşi Ulanmak',
    category: 'gan_specific',
    description: 'Exploits GAN tendency to generate limited diversity of outputs',
    descriptionTk: 'GAN-yň çäklendirilen dürlülikde çykyşlar döretmek meýlini ulanýar',
    year: 2016,
    authors: 'Arjovsky & Bottou',
    paper: 'Towards Principled Methods for Training GANs (ICLR 2017)',
    riskLevel: 'medium',
    successRate: 70,
    detectionDifficulty: 'easy',
    computationalCost: 'low',
    formula: 'G(z) ≈ constant for diverse z',
    // Repetitive/collapsed pattern
    visualPattern: {
      noiseType: 'collapse',
      colorShift: { r: 1.1, g: 0.8, b: 1.1 },
      patternFrequency: 0.8,
      repetitive: true,
      blocky: true
    },
    parameters: {
      detectionThreshold: { name: 'diversity threshold', typical: '0.1', description: 'Output diversity metric' }
    },
    realWorldExamples: [
      'Predicting GAN outputs for fraud',
      'Exploiting limited image generation diversity',
      'Breaking synthetic data quality'
    ],
    effectiveness: {
      againstGAN: 70,
      againstWGAN: 35,
      againstStyleGAN: 25
    }
  }
}

// ============================================
// REAL DEFENSE MECHANISMS DATA
// ============================================

const defenseMechanisms = {
  adversarialTraining: {
    id: 'adversarialTraining',
    name: 'Adversarial Training',
    nameTk: 'Garşydaş Türgenleşik',
    category: 'proactive',
    description: 'Augments training data with adversarial examples to improve robustness',
    descriptionTk: 'Berkitligi gowulandyrmak üçin türgenleşik maglumatlaryny garşydaş mysallar bilen baýlaşdyrýar',
    year: 2014,
    authors: 'Goodfellow et al.',
    paper: 'Explaining and Harnessing Adversarial Examples',
    effectiveness: 85,
    computationalOverhead: '2-10x training time',
    complexity: 'medium',
    formula: 'min_θ E[(L(f(x;θ), y) + λ·L(f(x_adv;θ), y))]',
    // Defense effectiveness against each attack
    againstAttacks: {
      fgsm: 65,
      pgd: 45,
      cw: 30,
      deepfool: 60,
      modelInversion: 10,
      membershipInference: 15,
      dataPoisoning: 20,
      modelStealing: 10,
      modeCollapse: 25
    },
    implementation: {
      frameworks: ['PyTorch', 'TensorFlow', 'JAX'],
      libraries: ['CleverHans', 'Foolbox', 'ART']
    },
    pros: [
      'Proven effectiveness against known attacks',
      'No inference overhead',
      'Works with any model architecture'
    ],
    cons: [
      'Significantly increases training time',
      'May reduce accuracy on clean data',
      'Not effective against unseen attack types'
    ]
  },
  inputPreprocessing: {
    id: 'inputPreprocessing',
    name: 'Input Preprocessing',
    nameTk: 'Giriş Öňünden Işlemek',
    category: 'reactive',
    description: 'Applies transformations to remove adversarial perturbations before inference',
    descriptionTk: 'Netije çykarmazdan ozal garşydaş üýtgeşmeleri aýyrmak üçin üýtgetmeleri ulanýar',
    year: 2017,
    authors: 'Guo et al.',
    paper: 'Countering Adversarial Images using Input Transformations (ICLR 2018)',
    effectiveness: 72,
    computationalOverhead: '1.1-1.5x inference time',
    complexity: 'low',
    againstAttacks: {
      fgsm: 75,
      pgd: 60,
      cw: 40,
      deepfool: 65,
      modelInversion: 5,
      membershipInference: 5,
      dataPoisoning: 55,
      modelStealing: 5,
      modeCollapse: 15
    },
    methods: {
      jpegCompression: { effectiveness: 60, description: 'JPEG compression removes high-frequency noise' },
      bitDepthReduction: { effectiveness: 55, description: 'Reduces bit depth to remove small perturbations' },
      spatialSmoothing: { effectiveness: 65, description: 'Applies Gaussian or median filters' },
      featureSqueezing: { effectiveness: 70, description: 'Combines multiple squeezing techniques' }
    },
    pros: [
      'Simple to implement',
      'Low computational cost',
      'No retraining required'
    ],
    cons: [
      'Can degrade clean image quality',
      'Vulnerable to adaptive attacks',
      'Effectiveness varies by attack type'
    ]
  },
  defensiveDistillation: {
    id: 'defensiveDistillation',
    name: 'Defensive Distillation',
    nameTk: 'Gorag Distilýasiýasy',
    category: 'proactive',
    description: 'Trains model using soft labels from a teacher model to smooth decision boundaries',
    descriptionTk: 'Karar serhetlerini tekizlemek üçin mugallym modelinden ýumşak bellikler ulanyp modeli türgenleşdirýär',
    year: 2016,
    authors: 'Papernot et al.',
    paper: 'Distillation as a Defense to Adversarial Perturbations (IEEE S&P 2016)',
    effectiveness: 55,
    computationalOverhead: '2x training time',
    complexity: 'medium',
    formula: 'L = KL(softmax(z_s/T) || softmax(z_t/T))',
    againstAttacks: {
      fgsm: 65,
      pgd: 45,
      cw: 0, // C&W breaks it completely
      deepfool: 55,
      modelInversion: 10,
      membershipInference: 20,
      dataPoisoning: 15,
      modelStealing: 15,
      modeCollapse: 10
    },
    parameters: {
      temperature: { name: 'T (temperature)', typical: '20-100', description: 'Softmax temperature' }
    },
    pros: [
      'Smooths decision boundaries',
      'No inference overhead',
      'Improves model calibration'
    ],
    cons: [
      'Broken by C&W attack (100% success)',
      'Requires training two models',
      'Limited effectiveness'
    ]
  },
  differentialPrivacy: {
    id: 'differentialPrivacy',
    name: 'Differential Privacy (DP-SGD)',
    nameTk: 'Diferensial Gizlinlik (DP-SGD)',
    category: 'privacy',
    description: 'Adds calibrated noise during training to provide mathematical privacy guarantees',
    descriptionTk: 'Matematiki gizlinlik kepilliklerini bermek üçin türgenleşik wagtynda kalibrlenmiş ses goşýar',
    year: 2016,
    authors: 'Abadi et al.',
    paper: 'Deep Learning with Differential Privacy (CCS 2016)',
    effectiveness: 90,
    computationalOverhead: '1.5-3x training time',
    complexity: 'high',
    formula: 'θ_t+1 = θ_t - η·(1/B)·Σ clip(∇L_i, C) + N(0, σ²C²I)',
    againstAttacks: {
      fgsm: 20,
      pgd: 15,
      cw: 10,
      deepfool: 15,
      modelInversion: 85,
      membershipInference: 90,
      dataPoisoning: 60,
      modelStealing: 30,
      modeCollapse: 10
    },
    parameters: {
      epsilon: { name: 'ε (privacy budget)', typical: '1-10', description: 'Privacy guarantee strength' },
      delta: { name: 'δ (failure probability)', typical: '10^-5', description: 'Probability of privacy breach' },
      clipNorm: { name: 'C (clip norm)', typical: '1.0', description: 'Gradient clipping threshold' },
      noiseMultiplier: { name: 'σ (noise)', typical: '0.5-1.5', description: 'Noise multiplier' }
    },
    pros: [
      'Mathematical privacy guarantees',
      'Protects against membership inference',
      'Protects against model inversion'
    ],
    cons: [
      'Reduces model accuracy (5-15%)',
      'Complex hyperparameter tuning',
      'Higher training cost'
    ]
  },
  ensembleMethods: {
    id: 'ensembleMethods',
    name: 'Ensemble Defense',
    nameTk: 'Ansambly Gorag',
    category: 'proactive',
    description: 'Uses multiple models to improve robustness through diversity',
    descriptionTk: 'Dürlülik arkaly berkitligi gowulandyrmak üçin birnäçe modeli ulanýar',
    year: 2017,
    authors: 'Tramèr et al.',
    paper: 'Ensemble Adversarial Training: Attacks and Defenses (ICLR 2018)',
    effectiveness: 78,
    computationalOverhead: '5-15x training time',
    complexity: 'high',
    formula: 'min_θ E[L(f(x;θ), y) + Σ_i λ_i·L(f(x_adv^i;θ), y)]',
    againstAttacks: {
      fgsm: 82,
      pgd: 75,
      cw: 62,
      deepfool: 70,
      modelInversion: 25,
      membershipInference: 30,
      dataPoisoning: 45,
      modelStealing: 55,
      modeCollapse: 60
    },
    pros: [
      'Better generalization to unseen attacks',
      'Reduces transferability of adversarial examples',
      'State-of-the-art robustness'
    ],
    cons: [
      'Very high computational cost',
      'Requires multiple pre-trained models',
      'Complex implementation'
    ]
  },
  certifiedDefense: {
    id: 'certifiedDefense',
    name: 'Certified Robustness',
    nameTk: 'Kepillendirilen Berkitlik',
    category: 'certified',
    description: 'Provides provable robustness guarantees within a certified radius',
    descriptionTk: 'Kepillendirilen radiusda subut edilip boljak berkitlik kepilliklerini berýär',
    year: 2019,
    authors: 'Cohen et al.',
    paper: 'Certified Adversarial Robustness via Randomized Smoothing (ICML 2019)',
    effectiveness: 82,
    computationalOverhead: '100-1000x inference time',
    complexity: 'high',
    formula: 'g(x) = argmax_c P(f(x+ε) = c), ε ~ N(0, σ²I)',
    againstAttacks: {
      fgsm: 85,
      pgd: 82,
      cw: 80,
      deepfool: 78,
      modelInversion: 15,
      membershipInference: 20,
      dataPoisoning: 30,
      modelStealing: 20,
      modeCollapse: 35
    },
    parameters: {
      sigma: { name: 'σ (noise level)', typical: '0.25-1.0', description: 'Gaussian noise standard deviation' },
      n: { name: 'n (samples)', typical: '100-10000', description: 'Number of Monte Carlo samples' }
    },
    pros: [
      'Provable robustness guarantees',
      'Works with any classifier',
      'No retraining required'
    ],
    cons: [
      'Very slow at inference time',
      'Certified radius often small',
      'Accuracy-robustness tradeoff'
    ]
  },
  inputDetection: {
    id: 'inputDetection',
    name: 'Adversarial Detection',
    nameTk: 'Garşydaş Kesgitlemek',
    category: 'reactive',
    description: 'Detects and rejects adversarial inputs before they reach the model',
    descriptionTk: 'Garşydaş girişleri modele ýetmezden ozal kesgitleýär we ret edýär',
    year: 2017,
    authors: 'Metzen et al.',
    paper: 'Detecting Adversarial Perturbations Through Spatial Consistency',
    effectiveness: 80,
    computationalOverhead: '1.2-2x inference time',
    complexity: 'medium',
    againstAttacks: {
      fgsm: 85,
      pgd: 75,
      cw: 65,
      deepfool: 70,
      modelInversion: 40,
      membershipInference: 35,
      dataPoisoning: 70,
      modelStealing: 60,
      modeCollapse: 80
    },
    methods: {
      statisticalDetection: { effectiveness: 75, description: 'Analyzes statistical properties of inputs' },
      featureSqueezing: { effectiveness: 78, description: 'Compares outputs before/after squeezing' },
      magnet: { effectiveness: 82, description: 'Uses autoencoder to detect anomalies' },
      lid: { effectiveness: 80, description: 'Local Intrinsic Dimensionality analysis' }
    },
    pros: [
      'Can detect unknown attack types',
      'Moderate computational overhead',
      'Works as additional layer'
    ],
    cons: [
      'High false positive rate possible',
      'Adaptive attacks can evade detection',
      'May reject legitimate edge cases'
    ]
  }
}

// ============================================
// API ROUTES
// ============================================

app.get('/api/attacks', (req, res) => {
  res.json({
    success: true,
    count: Object.keys(attackTypes).length,
    attacks: Object.values(attackTypes)
  })
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
  res.json({
    success: true,
    count: Object.keys(defenseMechanisms).length,
    defenses: Object.values(defenseMechanisms)
  })
})

app.get('/api/defenses/:id', (req, res) => {
  const defense = defenseMechanisms[req.params.id]
  if (defense) {
    res.json({ success: true, defense })
  } else {
    res.status(404).json({ success: false, error: 'Defense not found' })
  }
})

// Enhanced simulation with defense
app.post('/api/simulate', (req, res) => {
  const { attackType, defenseType, strength, targetLayer } = req.body
  const attack = attackTypes[attackType]
  const defense = defenseType ? defenseMechanisms[defenseType] : null

  if (!attack) {
    return res.status(400).json({ success: false, error: 'Invalid attack type' })
  }

  const strengthFactor = strength / 100

  // Calculate base attack success rate
  let attackSuccessRate = attack.successRate
  let detectionRate = 0
  let defenseEffectiveness = 0

  // Apply defense if selected
  if (defense && defense.againstAttacks && defense.againstAttacks[attackType]) {
    defenseEffectiveness = defense.againstAttacks[attackType]
    attackSuccessRate = Math.max(0, attack.successRate - defenseEffectiveness)
    detectionRate = defenseEffectiveness * 0.8 // Detection correlates with effectiveness
  }

  // Calculate final results based on strength
  const perturbation = 0.001 + strengthFactor * 0.15
  const baseConfidence = 95 - strengthFactor * 60
  const confidence = defense
    ? Math.min(95, baseConfidence + defenseEffectiveness * 0.3)
    : baseConfidence

  const successProbability = (attackSuccessRate * strengthFactor) / 100
  const attackSuccess = Math.random() < successProbability

  const detectionProbability = defense
    ? (detectionRate / 100) + (strengthFactor > 0.5 ? 0.2 : 0)
    : strengthFactor > 0.6 ? 0.3 : 0.1
  const detected = Math.random() < detectionProbability

  // Save to database
  if (db) {
    try {
      db.run(`
        INSERT INTO simulations (attack_type, defense_type, strength, target_layer,
          attack_success, defense_detected, perturbation, confidence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [attackType, defenseType || null, strength, targetLayer,
          attackSuccess ? 1 : 0, detected ? 1 : 0, perturbation, Math.round(confidence)])

      // Update statistics
      updateStatistics(attackType, attackSuccess, detected, perturbation)
    } catch (err) {
      console.error('DB Error:', err)
    }
  }

  res.json({
    success: true,
    results: {
      attackType: attack.name,
      attackCategory: attack.category,
      defenseType: defense ? defense.name : 'None',
      defenseEffectiveness,
      strength,
      targetLayer,
      perturbation: parseFloat(perturbation.toFixed(4)),
      confidence: Math.round(confidence),
      attackSuccess,
      defenseDetected: detected,
      riskLevel: attack.riskLevel,
      visualPattern: attack.visualPattern,
      timestamp: new Date().toISOString(),
      recommendations: attackSuccess && !detected
        ? getDefenseRecommendations(attackType)
        : []
    }
  })
})

function updateStatistics(attackType, success, detected, perturbation) {
  const existing = db.exec(`SELECT * FROM statistics WHERE attack_type = ?`, [attackType])

  if (existing.length > 0 && existing[0].values.length > 0) {
    const row = existing[0].values[0]
    const newTotal = row[2] + 1
    const newSuccessful = row[3] + (success ? 1 : 0)
    const newDetected = row[4] + (detected ? 1 : 0)
    const newAvgPert = ((row[5] * row[2]) + perturbation) / newTotal

    db.run(`
      UPDATE statistics SET
        total_runs = ?, successful_attacks = ?, detected_attacks = ?,
        avg_perturbation = ?, last_updated = CURRENT_TIMESTAMP
      WHERE attack_type = ?
    `, [newTotal, newSuccessful, newDetected, newAvgPert, attackType])
  } else {
    db.run(`
      INSERT INTO statistics (attack_type, total_runs, successful_attacks, detected_attacks, avg_perturbation)
      VALUES (?, 1, ?, ?, ?)
    `, [attackType, success ? 1 : 0, detected ? 1 : 0, perturbation])
  }
}

function getDefenseRecommendations(attackType) {
  const recommendations = {
    fgsm: ['adversarialTraining', 'inputPreprocessing', 'inputDetection'],
    pgd: ['adversarialTraining', 'certifiedDefense', 'ensembleMethods'],
    cw: ['ensembleMethods', 'certifiedDefense'],
    deepfool: ['adversarialTraining', 'inputDetection'],
    modelInversion: ['differentialPrivacy'],
    membershipInference: ['differentialPrivacy'],
    dataPoisoning: ['inputPreprocessing', 'inputDetection'],
    modelStealing: ['inputDetection', 'ensembleMethods'],
    modeCollapse: ['ensembleMethods', 'inputDetection']
  }

  return (recommendations[attackType] || ['adversarialTraining']).map(id => ({
    id,
    name: defenseMechanisms[id]?.name || id,
    effectiveness: defenseMechanisms[id]?.againstAttacks?.[attackType] || 50
  }))
}

// Get statistics from database
app.get('/api/statistics', (req, res) => {
  if (!db) {
    return res.json({ success: true, statistics: { simulations: [], summary: {} } })
  }

  try {
    const stats = db.exec('SELECT * FROM statistics ORDER BY total_runs DESC')
    const recentSims = db.exec('SELECT * FROM simulations ORDER BY timestamp DESC LIMIT 50')

    const statistics = stats.length > 0 ? stats[0].values.map(row => ({
      attackType: row[1],
      totalRuns: row[2],
      successfulAttacks: row[3],
      detectedAttacks: row[4],
      avgPerturbation: row[5],
      successRate: row[2] > 0 ? ((row[3] / row[2]) * 100).toFixed(1) : 0,
      detectionRate: row[2] > 0 ? ((row[4] / row[2]) * 100).toFixed(1) : 0
    })) : []

    const simulations = recentSims.length > 0 ? recentSims[0].values.map(row => ({
      id: row[0],
      attackType: row[1],
      defenseType: row[2],
      strength: row[3],
      targetLayer: row[4],
      attackSuccess: row[5] === 1,
      defenseDetected: row[6] === 1,
      perturbation: row[7],
      confidence: row[8],
      timestamp: row[9]
    })) : []

    // Calculate summary
    const totalSims = statistics.reduce((sum, s) => sum + s.totalRuns, 0)
    const totalSuccess = statistics.reduce((sum, s) => sum + s.successfulAttacks, 0)
    const totalDetected = statistics.reduce((sum, s) => sum + s.detectedAttacks, 0)

    res.json({
      success: true,
      statistics: {
        byAttack: statistics,
        recentSimulations: simulations,
        summary: {
          totalSimulations: totalSims,
          overallSuccessRate: totalSims > 0 ? ((totalSuccess / totalSims) * 100).toFixed(1) : 0,
          overallDetectionRate: totalSims > 0 ? ((totalDetected / totalSims) * 100).toFixed(1) : 0,
          mostTestedAttack: statistics[0]?.attackType || 'N/A',
          mostSuccessfulAttack: [...statistics].sort((a, b) => b.successRate - a.successRate)[0]?.attackType || 'N/A'
        }
      }
    })
  } catch (err) {
    console.error('Stats Error:', err)
    res.json({ success: true, statistics: { simulations: [], summary: {} } })
  }
})

// Clear statistics
app.delete('/api/statistics', (req, res) => {
  if (db) {
    db.run('DELETE FROM simulations')
    db.run('DELETE FROM statistics')
  }
  res.json({ success: true, message: 'Statistics cleared' })
})

app.get('/api/compare', (req, res) => {
  const comparison = Object.values(attackTypes).map(attack => ({
    attack: attack.name,
    id: attack.id,
    category: attack.category,
    successRate: attack.successRate,
    riskLevel: attack.riskLevel,
    visualPattern: attack.visualPattern,
    bestDefenses: Object.entries(defenseMechanisms)
      .map(([id, def]) => ({
        id,
        name: def.name,
        effectiveness: def.againstAttacks?.[attack.id] || 0
      }))
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 3)
  }))
  res.json({ success: true, comparison })
})

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'GAN Security API is running',
    version: '2.0.0',
    database: db ? 'connected' : 'not connected',
    endpoints: {
      attacks: '/api/attacks',
      defenses: '/api/defenses',
      statistics: '/api/statistics',
      simulate: '/api/simulate',
      compare: '/api/compare'
    }
  })
})

// Initialize and start
initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║           GAN Security Analyzer - Backend Server             ║
║                      Version 2.0.0                           ║
╠══════════════════════════════════════════════════════════════╣
║  Attacks Database: ${Object.keys(attackTypes).length} types                                  ║
║  Defenses Database: ${Object.keys(defenseMechanisms).length} mechanisms                              ║
║  SQLite: Enabled                                             ║
║  Based on: Real research papers (2014-2026)                  ║
╚══════════════════════════════════════════════════════════════╝

Server running on http://localhost:${PORT}
  `)
  })
}).catch(err => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})
