export default {
  nav: {
    home: 'Home',
    attackLab: 'Attack Lab',
    defense: 'Defense',
    scanner: 'Scanner',
    howItWorks: 'How It Works',
    about: 'About'
  },
  home: {
    title: 'XSS Shield',
    subtitle: 'Cross-Site Scripting Attack & Defense Laboratory',
    description: 'Learn how XSS attacks work, practice in a safe environment, and implement proper defenses. This educational platform demonstrates both attack vectors and protection techniques.',
    features: {
      attack: {
        title: 'Attack Simulation',
        desc: 'Practice XSS attacks in a safe, controlled environment'
      },
      defense: {
        title: 'Defense Techniques',
        desc: 'Learn input validation, output encoding, and CSP'
      },
      scanner: {
        title: 'Vulnerability Scanner',
        desc: 'Scan code for potential XSS vulnerabilities'
      },
      learn: {
        title: 'Educational Content',
        desc: 'Understand XSS types and prevention methods'
      }
    },
    tryAttackLab: 'Try Attack Lab',
    learnDefense: 'Learn Defense'
  },
  attackLab: {
    title: 'XSS Attack Laboratory',
    subtitle: 'Practice XSS attacks in a safe environment',
    warning: 'Educational purposes only! Never use these techniques on real websites without permission.',
    selectAttack: 'Select Attack Type',
    attackTypes: {
      reflected: {
        name: 'Reflected XSS',
        desc: 'Malicious script is reflected off a web server'
      },
      stored: {
        name: 'Stored XSS',
        desc: 'Malicious script is permanently stored on the target server'
      },
      dom: {
        name: 'DOM-based XSS',
        desc: 'Attack payload is executed by modifying the DOM'
      }
    },
    payload: 'Attack Payload',
    payloadPlaceholder: 'Enter XSS payload...',
    targetInput: 'Vulnerable Input Field',
    targetPlaceholder: 'Type something here...',
    executeAttack: 'Execute Attack',
    result: 'Result',
    resultPreview: 'Preview (Sandboxed)',
    examples: {
      title: 'Example Payloads',
      basic: 'Basic Alert',
      cookie: 'Cookie Stealing',
      redirect: 'Page Redirect',
      keylogger: 'Keylogger'
    },
    success: 'XSS Attack Successful!',
    blocked: 'Attack Blocked by Defense'
  },
  defense: {
    title: 'XSS Defense Techniques',
    subtitle: 'Learn how to protect against XSS attacks',
    techniques: {
      inputValidation: {
        name: 'Input Validation',
        desc: 'Validate and sanitize all user inputs',
        example: 'Whitelist allowed characters, reject suspicious patterns'
      },
      outputEncoding: {
        name: 'Output Encoding',
        desc: 'Encode special characters before displaying',
        example: '< becomes &lt; > becomes &gt;'
      },
      csp: {
        name: 'Content Security Policy',
        desc: 'HTTP header that controls resource loading',
        example: "Content-Security-Policy: script-src 'self'"
      },
      httpOnly: {
        name: 'HttpOnly Cookies',
        desc: 'Prevent JavaScript access to cookies',
        example: 'Set-Cookie: session=abc; HttpOnly'
      },
      sanitization: {
        name: 'HTML Sanitization',
        desc: 'Remove dangerous HTML tags and attributes',
        example: 'DOMPurify.sanitize(userInput)'
      },
      escaping: {
        name: 'Context-Aware Escaping',
        desc: 'Escape based on output context (HTML, JS, URL)',
        example: 'Different escaping for HTML vs JavaScript'
      }
    },
    tryDefense: 'Try Defense',
    inputLabel: 'Malicious Input',
    outputLabel: 'Sanitized Output',
    defenseEnabled: 'Defense Enabled',
    testDefense: 'Test Defense'
  },
  scanner: {
    title: 'XSS Vulnerability Scanner',
    subtitle: 'Scan your code for potential XSS vulnerabilities',
    pasteCode: 'Paste Your Code',
    codePlaceholder: 'Paste HTML, JavaScript, or server-side code here...',
    selectLanguage: 'Select Language',
    scan: 'Scan for Vulnerabilities',
    scanning: 'Scanning...',
    results: 'Scan Results',
    noVulnerabilities: 'No vulnerabilities found!',
    vulnerabilitiesFound: 'Vulnerabilities Found',
    line: 'Line',
    severity: 'Severity',
    description: 'Description',
    recommendation: 'Recommendation',
    severities: {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    }
  },
  howItWorks: {
    title: 'How XSS Attacks Work',
    subtitle: 'Understanding Cross-Site Scripting',
    steps: {
      step1: {
        title: 'Injection',
        desc: 'Attacker injects malicious script through user input'
      },
      step2: {
        title: 'Storage/Reflection',
        desc: 'Script is stored on server or reflected in response'
      },
      step3: {
        title: 'Delivery',
        desc: 'Victim visits the page containing the malicious script'
      },
      step4: {
        title: 'Execution',
        desc: 'Browser executes the script in victim\'s context'
      },
      step5: {
        title: 'Exploitation',
        desc: 'Attacker steals data, hijacks sessions, or defaces site'
      }
    },
    faq: {
      q1: {
        question: 'What is XSS?',
        answer: 'Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. It occurs when an application includes untrusted data in a web page without proper validation or escaping.'
      },
      q2: {
        question: 'What are the types of XSS?',
        answer: 'There are three main types: Reflected XSS (script is reflected from server), Stored XSS (script is stored on server), and DOM-based XSS (script manipulates the DOM directly). Each requires different prevention strategies.'
      },
      q3: {
        question: 'How dangerous is XSS?',
        answer: 'XSS can lead to session hijacking, credential theft, website defacement, malware distribution, and keylogging. It is consistently ranked in the OWASP Top 10 web vulnerabilities.'
      },
      q4: {
        question: 'How to prevent XSS?',
        answer: 'Prevention includes: input validation, output encoding, Content Security Policy (CSP), HttpOnly cookies, using security libraries like DOMPurify, and keeping frameworks updated.'
      }
    },
    xssTypes: {
      title: 'XSS Types Comparison',
      reflected: {
        name: 'Reflected XSS',
        vector: 'URL parameters, form inputs',
        persistence: 'Non-persistent',
        example: 'Search results page'
      },
      stored: {
        name: 'Stored XSS',
        vector: 'Database, comments, profiles',
        persistence: 'Persistent',
        example: 'Forum posts, user profiles'
      },
      dom: {
        name: 'DOM XSS',
        vector: 'Client-side JavaScript',
        persistence: 'Non-persistent',
        example: 'URL fragment handling'
      }
    }
  },
  about: {
    subtitle: 'XSS Attack & Defense Educational Platform',
    description: 'This diploma project provides a comprehensive learning environment for understanding Cross-Site Scripting vulnerabilities. It demonstrates both how attacks work and how to defend against them.',
    author: {
      title: 'Author',
      name: 'Daniyar Sapargeldiyew',
      project: 'Diploma Project',
      topic: 'XSS Attack and Defense Techniques',
      topicTk: 'XSS hüjümi we goranyş usullary'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    copy: 'Copy',
    copied: 'Copied!'
  }
}
