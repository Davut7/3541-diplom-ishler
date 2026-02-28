export default {
  nav: {
    home: 'Home',
    attacks: 'Attacks',
    defense: 'Defense',
    simulator: 'Simulator',
    statistics: 'Statistics',
    howItWorks: 'How It Works',
    about: 'About'
  },
  footer: {
    diploma: 'Diploma Project',
    author: 'Author'
  },
  home: {
    title: 'GAN Security Analyzer',
    subtitle: 'Understanding Attacks on Generative Adversarial Networks and Defense Mechanisms',
    description: 'Explore various attack methods against GANs and learn about defense strategies to protect AI systems.',
    exploreAttacks: 'Explore Attacks',
    learnDefense: 'Learn Defense',
    features: {
      title: 'Key Features',
      attacks: {
        title: 'Attack Analysis',
        desc: 'Study different types of attacks including adversarial examples, model inversion, and membership inference.'
      },
      defense: {
        title: 'Defense Mechanisms',
        desc: 'Learn about defensive techniques like adversarial training, input preprocessing, and model hardening.'
      },
      simulator: {
        title: 'Attack Simulator',
        desc: 'Interactive demonstration of how attacks affect GAN outputs and model behavior.'
      },
      visualize: {
        title: 'Visualization',
        desc: 'Visual representation of attacks and their effects on generated images.'
      }
    },
    stats: {
      attackTypes: 'Attack Types',
      defenseStrategies: 'Defense Strategies',
      vulnerabilities: 'Known Vulnerabilities',
      mitigations: 'Mitigations'
    }
  },
  attacks: {
    title: 'GAN Attack Types',
    subtitle: 'Understanding different attack vectors against Generative Adversarial Networks',
    categories: {
      adversarial: {
        title: 'Adversarial Examples',
        desc: 'Small perturbations to input that cause misclassification',
        details: 'Adversarial examples are inputs to machine learning models that an attacker has intentionally designed to cause the model to make a mistake. These perturbations are often imperceptible to humans but can dramatically change the model output.',
        methods: ['FGSM (Fast Gradient Sign Method)', 'PGD (Projected Gradient Descent)', 'C&W Attack', 'DeepFool']
      },
      inversion: {
        title: 'Model Inversion',
        desc: 'Reconstructing training data from model outputs',
        details: 'Model inversion attacks attempt to reconstruct sensitive training data by exploiting the model\'s outputs. This is particularly dangerous when GANs are trained on private or sensitive data.',
        methods: ['Gradient-based Inversion', 'Optimization Attack', 'GAN-based Reconstruction']
      },
      membership: {
        title: 'Membership Inference',
        desc: 'Determining if a sample was in training data',
        details: 'Membership inference attacks aim to determine whether a specific data sample was used to train the model. This can reveal sensitive information about the training dataset.',
        methods: ['Shadow Model Attack', 'Threshold-based Attack', 'Label-only Attack']
      },
      poisoning: {
        title: 'Data Poisoning',
        desc: 'Corrupting training data to manipulate model behavior',
        details: 'Data poisoning attacks inject malicious data into the training set to influence the model\'s behavior. This can cause the GAN to generate manipulated or harmful outputs.',
        methods: ['Backdoor Attack', 'Clean-label Attack', 'Gradient-based Poisoning']
      },
      modeCollapse: {
        title: 'Mode Collapse Exploitation',
        desc: 'Exploiting GAN\'s tendency to generate limited variety',
        details: 'Mode collapse is a common failure mode where the GAN generates limited variety of outputs. Attackers can exploit this to predict and manipulate the model\'s behavior.',
        methods: ['Diversity Exploitation', 'Pattern Recognition Attack']
      },
      stealing: {
        title: 'Model Stealing',
        desc: 'Extracting model parameters through queries',
        details: 'Model stealing attacks aim to create a copy of the target model by querying it and learning from its outputs. This can expose proprietary architectures and training data.',
        methods: ['Query-based Extraction', 'Distillation Attack', 'API Probing']
      }
    },
    riskLevel: 'Risk Level',
    impact: 'Impact',
    difficulty: 'Difficulty'
  },
  defense: {
    title: 'Defense Mechanisms',
    subtitle: 'Strategies to protect GANs from various attacks',
    categories: {
      adversarialTraining: {
        title: 'Adversarial Training',
        desc: 'Training with adversarial examples to improve robustness',
        details: 'Include adversarial examples in the training process to make the model more robust against perturbation attacks.',
        effectiveness: 85
      },
      inputPreprocessing: {
        title: 'Input Preprocessing',
        desc: 'Sanitizing inputs before feeding to the model',
        details: 'Apply transformations like JPEG compression, bit-depth reduction, or spatial smoothing to remove adversarial perturbations.',
        effectiveness: 70
      },
      gradientMasking: {
        title: 'Gradient Masking',
        desc: 'Hiding gradient information from attackers',
        details: 'Obscure or modify gradients to prevent gradient-based attacks from being effective.',
        effectiveness: 60
      },
      differentialPrivacy: {
        title: 'Differential Privacy',
        desc: 'Adding noise to protect training data privacy',
        details: 'Add calibrated noise during training to provide mathematical guarantees about data privacy.',
        effectiveness: 90
      },
      ensembleMethods: {
        title: 'Ensemble Methods',
        desc: 'Using multiple models to improve robustness',
        details: 'Combine predictions from multiple models to reduce the impact of attacks on any single model.',
        effectiveness: 75
      },
      detectionMethods: {
        title: 'Attack Detection',
        desc: 'Identifying and rejecting adversarial inputs',
        details: 'Use statistical methods or secondary models to detect and reject adversarial inputs before processing.',
        effectiveness: 80
      }
    },
    effectiveness: 'Effectiveness',
    implementation: 'Implementation Complexity'
  },
  simulator: {
    title: 'Attack Simulator',
    subtitle: 'Interactive demonstration of GAN attacks',
    selectAttack: 'Select Attack Type',
    attackStrength: 'Attack Strength',
    runSimulation: 'Run Simulation',
    reset: 'Reset',
    original: 'Original Image',
    attacked: 'Attacked Image',
    difference: 'Difference',
    results: {
      title: 'Simulation Results',
      perturbation: 'Perturbation Size',
      confidence: 'Model Confidence',
      success: 'Attack Success',
      detected: 'Defense Detected'
    }
  },
  statistics: {
    title: 'GAN Security Statistics',
    subtitle: 'Visual analysis of attacks, defenses, and their effectiveness',
    attackEffectiveness: 'Attack Success Rate',
    defenseEffectiveness: 'Defense Effectiveness',
    riskDistribution: 'Risk Distribution',
    timeline: 'GAN Security Timeline (2019-2026)',
    comparisonTable: 'Attack vs Defense Comparison',
    keyInsights: 'Key Insights',
    totalAttacks: 'Attack Types',
    totalDefenses: 'Defense Methods',
    avgEffectiveness: 'Avg. Effectiveness',
    criticalRisks: 'Critical Risks',
    attack: 'Attack',
    riskLevel: 'Risk Level',
    bestDefense: 'Best Defense',
    effectiveness: 'Effectiveness'
  },
  howItWorks: {
    title: 'How GANs and Attacks Work',
    subtitle: 'Understanding the fundamentals',
    ganBasics: {
      title: 'GAN Fundamentals',
      content: 'Generative Adversarial Networks consist of two neural networks: a Generator that creates fake data, and a Discriminator that tries to distinguish real from fake. They compete in a minimax game, improving each other.',
      generator: 'Generator creates fake samples',
      discriminator: 'Discriminator distinguishes real vs fake',
      training: 'Both improve through adversarial training'
    },
    attackProcess: {
      title: 'Attack Process',
      step1: { title: 'Target Analysis', desc: 'Attacker analyzes the model architecture and behavior' },
      step2: { title: 'Vulnerability Identification', desc: 'Find weaknesses in the model or training process' },
      step3: { title: 'Attack Crafting', desc: 'Design attack inputs or poisoned data' },
      step4: { title: 'Execution', desc: 'Deploy the attack against the target model' },
      step5: { title: 'Exploitation', desc: 'Leverage the compromised model for malicious purposes' }
    },
    defenseProcess: {
      title: 'Defense Process',
      step1: { title: 'Threat Modeling', desc: 'Identify potential attack vectors' },
      step2: { title: 'Defense Selection', desc: 'Choose appropriate defense mechanisms' },
      step3: { title: 'Implementation', desc: 'Integrate defenses into the system' },
      step4: { title: 'Testing', desc: 'Evaluate defense effectiveness' },
      step5: { title: 'Monitoring', desc: 'Continuous monitoring for new attacks' }
    },
    faq: {
      title: 'Frequently Asked Questions',
      q1: { question: 'What is a GAN?', answer: 'A Generative Adversarial Network is a type of machine learning model consisting of two neural networks that compete against each other to generate realistic synthetic data.' },
      q2: { question: 'Why are GANs vulnerable to attacks?', answer: 'GANs are vulnerable because they rely on gradient-based optimization, can memorize training data, and their dual-network architecture creates unique attack surfaces.' },
      q3: { question: 'Can GANs be fully secured?', answer: 'While no system can be 100% secure, combining multiple defense mechanisms can significantly reduce the risk of successful attacks.' },
      q4: { question: 'What is the most dangerous attack?', answer: 'Data poisoning attacks are particularly dangerous because they can compromise the model during training, affecting all future outputs.' }
    }
  },
  about: {
    title: 'About GAN Security',
    subtitle: 'Research on Attacks against Generative Adversarial Networks and Security Measures',
    description: 'This project explores the security vulnerabilities of Generative Adversarial Networks and demonstrates various attack methods along with defense strategies.',
    whatIsGan: {
      title: 'What is a GAN?',
      content: 'Generative Adversarial Networks (GANs) are a class of machine learning frameworks where two neural networks contest with each other in a game. The generator creates fake data, while the discriminator evaluates its authenticity. This adversarial process results in highly realistic synthetic data generation.'
    },
    purpose: {
      title: 'Project Purpose',
      content: 'This diploma project was developed to study and demonstrate the security aspects of GANs, including various attack vectors and defense mechanisms. Understanding these vulnerabilities is crucial for deploying AI systems safely.'
    },
    author: {
      title: 'Author',
      name: 'Selbi Weliýewa',
      project: 'Diploma Project',
      topic: 'Attacks to GANs and Security',
      topicTk: 'GAN (Generative Adversarial Networks) garşy hüjümler we howpsuzlyk'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    critical: 'Critical'
  }
}
