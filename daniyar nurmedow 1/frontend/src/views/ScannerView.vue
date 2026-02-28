<template>
  <div class="scanner-view">
    <!-- Terminal Header -->
    <div class="terminal-header">
      <div class="terminal-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      <div class="terminal-title">vuln_scanner.exe -- Code Vulnerability Analyzer</div>
      <div class="terminal-status">
        <span class="status-badge" :class="isScanning ? 'scanning' : 'ready'">
          <i :class="isScanning ? 'pi pi-spin pi-spinner' : 'pi pi-search'"></i>
          {{ isScanning ? 'SCANNING...' : 'READY' }}
        </span>
      </div>
    </div>

    <div class="page-header">
      <div class="glitch-title" data-text="// VULNERABILITY SCANNER">// VULNERABILITY SCANNER</div>
      <p class="subtitle">
        <span class="prompt">&gt;</span> {{ t.scanner.subtitle }}
      </p>
    </div>

    <!-- Scanner Card -->
    <div class="cyber-card scanner-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-code"></i></span>
        <span class="header-title">CODE_INPUT</span>
      </div>
      <div class="card-content">
        <div class="code-input-section">
          <label>
            <span class="label-prefix">&gt;</span>
            {{ t.scanner.pasteCode }}
          </label>
          <div class="example-buttons">
            <button class="example-btn danger" @click="loadExample('js')">
              <i class="pi pi-code"></i> Vulnerable JS
            </button>
            <button class="example-btn danger" @click="loadExample('php')">
              <i class="pi pi-code"></i> Vulnerable PHP
            </button>
            <button class="example-btn danger" @click="loadExample('html')">
              <i class="pi pi-code"></i> Vulnerable HTML
            </button>
            <button class="example-btn safe" @click="loadExample('safe')">
              <i class="pi pi-shield"></i> Safe Code
            </button>
          </div>
          <div class="code-editor">
            <div class="editor-header">
              <span class="file-tab">
                <i class="pi pi-file"></i>
                code.{{ selectedLanguage }}
              </span>
            </div>
            <Textarea v-model="codeInput" rows="14" :placeholder="t.scanner.codePlaceholder" class="editor-textarea" />
          </div>
        </div>

        <div class="options-row">
          <div class="language-select">
            <label>
              <span class="label-prefix">#</span>
              {{ t.scanner.selectLanguage }}
            </label>
            <Select v-model="selectedLanguage" :options="languages" optionLabel="name" optionValue="value" class="lang-dropdown" />
          </div>
          <button class="scan-btn" @click="scanCode" :disabled="isScanning">
            <i :class="isScanning ? 'pi pi-spin pi-spinner' : 'pi pi-search'"></i>
            <span>{{ isScanning ? 'SCANNING...' : 'RUN_SCAN' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Results Card -->
    <div v-if="scanResults" class="cyber-card results-card">
      <div class="card-header" :class="scanResults.length === 0 ? 'success' : 'danger'">
        <span class="header-icon">
          <i :class="scanResults.length === 0 ? 'pi pi-check-circle' : 'pi pi-exclamation-triangle'"></i>
        </span>
        <span class="header-title">SCAN_RESULTS</span>
        <span class="results-count">{{ scanResults.length }} vulnerabilities found</span>
      </div>
      <div class="card-content">
        <div v-if="scanResults.length === 0" class="no-vulnerabilities">
          <div class="safe-icon">
            <i class="pi pi-shield"></i>
          </div>
          <h3>NO_VULNERABILITIES_DETECTED</h3>
          <p>{{ t.scanner.noVulnerabilities }}</p>
        </div>

        <div v-else class="vulnerabilities-found">
          <div class="vuln-summary">
            <div class="summary-item critical">
              <span class="count">{{ criticalCount }}</span>
              <span class="label">CRITICAL</span>
            </div>
            <div class="summary-item high">
              <span class="count">{{ highCount }}</span>
              <span class="label">HIGH</span>
            </div>
            <div class="summary-item medium">
              <span class="count">{{ mediumCount }}</span>
              <span class="label">MEDIUM</span>
            </div>
            <div class="summary-item low">
              <span class="count">{{ lowCount }}</span>
              <span class="label">LOW</span>
            </div>
          </div>

          <div class="vuln-list">
            <div v-for="(result, index) in scanResults" :key="index" class="vuln-item" :class="result.severity.toLowerCase()">
              <div class="vuln-line">
                <span class="line-label">LINE</span>
                <span class="line-number">{{ result.line }}</span>
              </div>
              <div class="vuln-severity">
                <span class="severity-badge" :class="result.severity.toLowerCase()">{{ result.severity }}</span>
              </div>
              <div class="vuln-details">
                <p class="vuln-desc">{{ result.description }}</p>
                <p class="vuln-rec">
                  <i class="pi pi-info-circle"></i>
                  {{ result.recommendation }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Patterns Card -->
    <div class="cyber-card patterns-card">
      <div class="card-header">
        <span class="header-icon"><i class="pi pi-list"></i></span>
        <span class="header-title">COMMON_XSS_PATTERNS</span>
      </div>
      <div class="card-content">
        <div class="patterns-grid">
          <div class="pattern-item danger">
            <code>innerHTML = userInput</code>
            <span class="pattern-desc">Direct HTML injection</span>
          </div>
          <div class="pattern-item danger">
            <code>document.write(data)</code>
            <span class="pattern-desc">Document manipulation</span>
          </div>
          <div class="pattern-item danger">
            <code>eval(userInput)</code>
            <span class="pattern-desc">Code execution</span>
          </div>
          <div class="pattern-item warning">
            <code>element.outerHTML = data</code>
            <span class="pattern-desc">HTML replacement</span>
          </div>
          <div class="pattern-item warning">
            <code>location.href = input</code>
            <span class="pattern-desc">URL manipulation</span>
          </div>
          <div class="pattern-item warning">
            <code>setTimeout(userInput)</code>
            <span class="pattern-desc">Delayed execution</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  props: { t: Object, language: String },
  setup() {
    const codeInput = ref('')
    const selectedLanguage = ref('javascript')
    const isScanning = ref(false)
    const scanResults = ref(null)

    const languages = [
      { name: 'JavaScript', value: 'javascript' },
      { name: 'HTML', value: 'html' },
      { name: 'PHP', value: 'php' },
      { name: 'Python', value: 'python' }
    ]

    const codeExamples = {
      js: `// VULNERABLE JavaScript Code Example
function displayUserInput(input) {
  // Critical: Direct innerHTML assignment
  document.getElementById('output').innerHTML = input;

  // Critical: Using eval with user input
  eval('var data = ' + input);

  // High: Document.write usage
  document.write('Hello ' + input);

  // High: Location manipulation
  location.href = input;

  // High: setTimeout with string
  setTimeout('alert(' + input + ')', 1000);
}

// jQuery vulnerable code
$('#results').html(userInput);
`,
      php: `<?php
// VULNERABLE PHP Code Example

// Critical: Direct output of GET parameter
echo $_GET['search'];

// Critical: Direct print of POST data
print $_POST['comment'];

// Critical: Unescaped database result
echo $row['user_comment'];

// Should use htmlspecialchars():
// echo htmlspecialchars($_GET['search'], ENT_QUOTES, 'UTF-8');
?>`,
      html: `<!-- VULNERABLE HTML Code Example -->
<div id="output"></div>

<scr` + `ipt>
  // Getting URL parameter and displaying
  var param = location.hash.substring(1);
  document.getElementById('output').innerHTML = param;

  // Vulnerable event handler
  document.write('<img src="' + userInput + '">');
</scr` + `ipt>

<!-- Vue.js vulnerable -->
<div v-html="userInput"></div>

<!-- React vulnerable -->
<div dangerouslySetInnerHTML={{__html: userInput}}></div>
`,
      safe: `// SAFE JavaScript Code Example
function displayUserInput(input) {
  // Safe: Using textContent
  document.getElementById('output').textContent = input;

  // Safe: Creating elements properly
  const div = document.createElement('div');
  div.textContent = input;
  container.appendChild(div);

  // Safe: Sanitizing with DOMPurify
  const clean = DOMPurify.sanitize(input);
  element.innerHTML = clean;
}

// Safe: URL validation
function safeRedirect(url) {
  const parsed = new URL(url, window.location.origin);
  if (parsed.origin === window.location.origin) {
    location.href = url;
  }
}
`
    }

    const loadExample = (type) => {
      codeInput.value = codeExamples[type]
      selectedLanguage.value = type === 'php' ? 'php' : type === 'html' ? 'html' : 'javascript'
      scanResults.value = null
    }

    const vulnerabilityPatterns = [
      { pattern: /innerHTML\s*=/, severity: 'Critical', desc: 'Direct innerHTML assignment detected', rec: 'Use textContent or sanitize input with DOMPurify' },
      { pattern: /document\.write\s*\(/, severity: 'Critical', desc: 'document.write() usage detected', rec: 'Avoid document.write(), use DOM manipulation instead' },
      { pattern: /eval\s*\(/, severity: 'Critical', desc: 'eval() function detected', rec: 'Never use eval() with user input' },
      { pattern: /outerHTML\s*=/, severity: 'High', desc: 'outerHTML assignment detected', rec: 'Use safe DOM manipulation methods' },
      { pattern: /\.html\s*\(/, severity: 'High', desc: 'jQuery .html() method detected', rec: 'Use .text() or sanitize input' },
      { pattern: /location\s*=|location\.href\s*=/, severity: 'High', desc: 'URL manipulation detected', rec: 'Validate URLs before redirection' },
      { pattern: /setTimeout\s*\([^,]*\+|setInterval\s*\([^,]*\+/, severity: 'High', desc: 'String concatenation in timer', rec: 'Use function references instead of strings' },
      { pattern: /echo\s*\$_/, severity: 'Critical', desc: 'Direct PHP variable output', rec: 'Use htmlspecialchars() to escape output' },
      { pattern: /print\s*\$_/, severity: 'Critical', desc: 'Direct PHP print of user input', rec: 'Always escape user input before output' },
      { pattern: /v-html\s*=/, severity: 'Medium', desc: 'Vue v-html directive detected', rec: 'Sanitize content before using v-html' },
      { pattern: /dangerouslySetInnerHTML/, severity: 'Medium', desc: 'React dangerouslySetInnerHTML detected', rec: 'Sanitize content with DOMPurify' },
      { pattern: /\|\s*safe/, severity: 'Medium', desc: 'Template safe filter detected', rec: 'Only use safe filter for trusted content' }
    ]

    const scanCode = async () => {
      if (!codeInput.value.trim()) return

      isScanning.value = true
      await new Promise(resolve => setTimeout(resolve, 1500))

      const results = []
      const lines = codeInput.value.split('\n')

      lines.forEach((line, index) => {
        vulnerabilityPatterns.forEach(vuln => {
          if (vuln.pattern.test(line)) {
            results.push({
              line: index + 1,
              severity: vuln.severity,
              description: vuln.desc,
              recommendation: vuln.rec,
              code: line.trim()
            })
          }
        })
      })

      scanResults.value = results
      isScanning.value = false
    }

    const criticalCount = computed(() => scanResults.value?.filter(r => r.severity === 'Critical').length || 0)
    const highCount = computed(() => scanResults.value?.filter(r => r.severity === 'High').length || 0)
    const mediumCount = computed(() => scanResults.value?.filter(r => r.severity === 'Medium').length || 0)
    const lowCount = computed(() => scanResults.value?.filter(r => r.severity === 'Low').length || 0)

    return {
      codeInput,
      selectedLanguage,
      isScanning,
      scanResults,
      languages,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      scanCode,
      loadExample
    }
  }
}
</script>

<style scoped>
.scanner-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Terminal Header */
.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--cyber-surface-2);
  border: 1px solid var(--cyber-border);
  border-radius: 8px 8px 0 0;
  padding: 0.75rem 1rem;
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.terminal-dots .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dots .dot.red { background: #ff5f56; }
.terminal-dots .dot.yellow { background: #ffbd2e; }
.terminal-dots .dot.green { background: #27c93f; }

.terminal-title {
  font-size: 0.85rem;
  color: var(--cyber-text-dim);
}

.terminal-status .status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge.ready {
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid var(--cyber-primary);
  color: var(--cyber-primary);
}

.status-badge.scanning {
  background: rgba(0, 212, 255, 0.2);
  border: 1px solid var(--cyber-secondary);
  color: var(--cyber-secondary);
}

/* Page Header */
.page-header {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.glitch-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--cyber-secondary);
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--cyber-text-dim);
  font-size: 0.95rem;
}

.subtitle .prompt {
  color: var(--cyber-primary);
}

/* Cyber Card */
.cyber-card {
  background: var(--cyber-surface);
  border: 1px solid var(--cyber-border);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--cyber-surface-2);
  border-bottom: 1px solid var(--cyber-border);
}

.card-header.success {
  background: rgba(0, 255, 136, 0.1);
  border-bottom-color: var(--cyber-primary);
}

.card-header.success .header-icon { color: var(--cyber-primary); }

.card-header.danger {
  background: rgba(255, 51, 102, 0.1);
  border-bottom-color: var(--cyber-danger);
}

.card-header.danger .header-icon { color: var(--cyber-danger); }

.header-icon {
  color: var(--cyber-secondary);
  font-size: 1.1rem;
}

.header-title {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--cyber-text);
}

.results-count {
  margin-left: auto;
  font-size: 0.8rem;
  color: var(--cyber-text-dim);
}

.card-content {
  padding: 1.5rem;
}

/* Code Input Section */
.code-input-section label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: var(--cyber-text);
  font-weight: 500;
}

.label-prefix {
  color: var(--cyber-primary);
}

.example-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.example-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}

.example-btn.danger {
  background: rgba(255, 51, 102, 0.1);
  border-color: var(--cyber-danger);
  color: var(--cyber-danger);
}

.example-btn.danger:hover {
  background: rgba(255, 51, 102, 0.2);
}

.example-btn.safe {
  background: rgba(0, 255, 136, 0.1);
  border-color: var(--cyber-primary);
  color: var(--cyber-primary);
}

.example-btn.safe:hover {
  background: rgba(0, 255, 136, 0.2);
}

.code-editor {
  background: var(--cyber-code-bg);
  border: 1px solid var(--cyber-border);
  border-radius: 6px;
  overflow: hidden;
}

.editor-header {
  background: var(--cyber-surface-2);
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--cyber-border);
}

.file-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--cyber-text-dim);
}

.editor-textarea {
  width: 100%;
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  color: var(--cyber-text) !important;
  font-family: var(--font-mono) !important;
  font-size: 0.85rem !important;
  resize: none;
}

.options-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.language-select {
  flex: 1;
}

.language-select label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--cyber-text);
}

.lang-dropdown {
  width: 100%;
}

.scan-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, var(--cyber-secondary), #0099cc);
  border: none;
  border-radius: 6px;
  color: white;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.scan-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
}

.scan-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Results */
.no-vulnerabilities {
  text-align: center;
  padding: 3rem;
}

.safe-icon {
  width: 80px;
  height: 80px;
  background: rgba(0, 255, 136, 0.1);
  border: 2px solid var(--cyber-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.safe-icon i {
  font-size: 2.5rem;
  color: var(--cyber-primary);
}

.no-vulnerabilities h3 {
  color: var(--cyber-primary);
  margin-bottom: 0.5rem;
}

.no-vulnerabilities p {
  color: var(--cyber-text-dim);
}

.vuln-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-item {
  flex: 1;
  text-align: center;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid;
}

.summary-item.critical {
  background: rgba(255, 51, 102, 0.1);
  border-color: var(--cyber-danger);
}

.summary-item.high {
  background: rgba(255, 149, 0, 0.1);
  border-color: #ff9500;
}

.summary-item.medium {
  background: rgba(255, 204, 0, 0.1);
  border-color: var(--cyber-warning);
}

.summary-item.low {
  background: rgba(0, 212, 255, 0.1);
  border-color: var(--cyber-secondary);
}

.summary-item .count {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
}

.summary-item.critical .count { color: var(--cyber-danger); }
.summary-item.high .count { color: #ff9500; }
.summary-item.medium .count { color: var(--cyber-warning); }
.summary-item.low .count { color: var(--cyber-secondary); }

.summary-item .label {
  font-size: 0.7rem;
  color: var(--cyber-text-dim);
}

.vuln-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.vuln-item {
  display: grid;
  grid-template-columns: 80px 100px 1fr;
  gap: 1rem;
  align-items: start;
  padding: 1rem;
  background: var(--cyber-code-bg);
  border-radius: 6px;
  border-left: 3px solid;
}

.vuln-item.critical { border-color: var(--cyber-danger); }
.vuln-item.high { border-color: #ff9500; }
.vuln-item.medium { border-color: var(--cyber-warning); }
.vuln-item.low { border-color: var(--cyber-secondary); }

.vuln-line {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.line-label {
  font-size: 0.65rem;
  color: var(--cyber-text-dim);
}

.line-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--cyber-secondary);
}

.severity-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.severity-badge.critical {
  background: var(--cyber-danger);
  color: white;
}

.severity-badge.high {
  background: #ff9500;
  color: white;
}

.severity-badge.medium {
  background: var(--cyber-warning);
  color: #0a0e17;
}

.severity-badge.low {
  background: var(--cyber-secondary);
  color: #0a0e17;
}

.vuln-desc {
  color: var(--cyber-text);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.vuln-rec {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  color: var(--cyber-primary);
  font-size: 0.8rem;
}

.vuln-rec i {
  margin-top: 0.15rem;
}

/* Patterns */
.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.pattern-item {
  padding: 1rem;
  background: var(--cyber-code-bg);
  border-radius: 6px;
  border-left: 3px solid;
}

.pattern-item.danger { border-color: var(--cyber-danger); }
.pattern-item.warning { border-color: var(--cyber-warning); }

.pattern-item code {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.pattern-item.danger code { color: var(--cyber-danger); }
.pattern-item.warning code { color: var(--cyber-warning); }

.pattern-desc {
  font-size: 0.8rem;
  color: var(--cyber-text-dim);
}

/* Responsive */
@media (max-width: 768px) {
  .terminal-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .terminal-dots {
    display: none;
  }

  .glitch-title {
    font-size: 1.5rem;
  }

  .options-row {
    flex-direction: column;
  }

  .scan-btn {
    width: 100%;
    justify-content: center;
  }

  .vuln-summary {
    flex-wrap: wrap;
  }

  .summary-item {
    min-width: calc(50% - 0.5rem);
  }

  .vuln-item {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .vuln-line {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
