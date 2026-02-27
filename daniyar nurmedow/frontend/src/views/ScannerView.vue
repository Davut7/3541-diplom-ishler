<template>
  <div class="scanner-view">
    <div class="page-header">
      <h1>{{ t.scanner.title }}</h1>
      <p>{{ t.scanner.subtitle }}</p>
    </div>

    <Card class="scanner-card">
      <template #content>
        <div class="scanner-form">
          <div class="code-input-section">
            <label>{{ t.scanner.pasteCode }}</label>
            <div class="example-buttons">
              <Button label="Load Vulnerable JS" size="small" severity="danger" outlined @click="loadExample('js')" />
              <Button label="Load Vulnerable PHP" size="small" severity="danger" outlined @click="loadExample('php')" />
              <Button label="Load Vulnerable HTML" size="small" severity="danger" outlined @click="loadExample('html')" />
              <Button label="Load Safe Code" size="small" severity="success" outlined @click="loadExample('safe')" />
            </div>
            <Textarea v-model="codeInput" rows="12" :placeholder="t.scanner.codePlaceholder" class="code-input" />
          </div>

          <div class="options-row">
            <div class="language-select">
              <label>{{ t.scanner.selectLanguage }}</label>
              <Select v-model="selectedLanguage" :options="languages" optionLabel="name" optionValue="value" class="lang-dropdown" />
            </div>
            <Button :label="isScanning ? t.scanner.scanning : t.scanner.scan" icon="pi pi-search" @click="scanCode" :loading="isScanning" class="scan-btn" />
          </div>
        </div>
      </template>
    </Card>

    <Card v-if="scanResults" class="results-card">
      <template #content>
        <h2>
          <i :class="scanResults.length === 0 ? 'pi pi-check-circle success-icon' : 'pi pi-exclamation-triangle warning-icon'"></i>
          {{ t.scanner.results }}
        </h2>

        <div v-if="scanResults.length === 0" class="no-vulnerabilities">
          <i class="pi pi-shield"></i>
          <p>{{ t.scanner.noVulnerabilities }}</p>
        </div>

        <div v-else class="vulnerabilities-list">
          <div class="vuln-summary">
            <Tag severity="danger">{{ criticalCount }} Critical</Tag>
            <Tag severity="warn">{{ highCount }} High</Tag>
            <Tag severity="info">{{ mediumCount }} Medium</Tag>
            <Tag severity="secondary">{{ lowCount }} Low</Tag>
          </div>

          <DataTable :value="scanResults" :paginator="scanResults.length > 5" :rows="5" class="vuln-table">
            <Column field="line" :header="t.scanner.line" style="width: 10%">
              <template #body="{ data }">
                <Badge :value="data.line" severity="info" />
              </template>
            </Column>
            <Column field="severity" :header="t.scanner.severity" style="width: 15%">
              <template #body="{ data }">
                <Tag :severity="getSeverityClass(data.severity)" :value="data.severity" />
              </template>
            </Column>
            <Column field="description" :header="t.scanner.description" style="width: 40%"></Column>
            <Column field="recommendation" :header="t.scanner.recommendation" style="width: 35%"></Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <Card class="patterns-card">
      <template #content>
        <h2><i class="pi pi-list"></i> Common XSS Vulnerability Patterns</h2>
        <div class="patterns-grid">
          <div class="pattern-item danger">
            <code>innerHTML = userInput</code>
            <p>Direct HTML injection</p>
          </div>
          <div class="pattern-item danger">
            <code>document.write(data)</code>
            <p>Document manipulation</p>
          </div>
          <div class="pattern-item danger">
            <code>eval(userInput)</code>
            <p>Code execution</p>
          </div>
          <div class="pattern-item warning">
            <code>element.outerHTML = data</code>
            <p>HTML replacement</p>
          </div>
          <div class="pattern-item warning">
            <code>location.href = input</code>
            <p>URL manipulation</p>
          </div>
          <div class="pattern-item warning">
            <code>setTimeout(userInput)</code>
            <p>Delayed execution</p>
          </div>
        </div>
      </template>
    </Card>
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

    const getSeverityClass = (severity) => {
      const classes = {
        'Critical': 'danger',
        'High': 'warn',
        'Medium': 'info',
        'Low': 'secondary'
      }
      return classes[severity] || 'info'
    }

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
      getSeverityClass,
      loadExample
    }
  }
}
</script>

<style scoped>
.scanner-view {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.scanner-card,
.results-card,
.patterns-card {
  margin-bottom: 1.5rem;
}

.code-input-section {
  margin-bottom: 1.5rem;
}

.code-input-section label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.example-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.code-input {
  width: 100%;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.options-row {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.language-select {
  flex: 1;
}

.language-select label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.lang-dropdown {
  width: 100%;
}

.scan-btn {
  min-width: 150px;
}

.results-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.success-icon {
  color: #22c55e;
}

.warning-icon {
  color: #f97316;
}

.no-vulnerabilities {
  text-align: center;
  padding: 3rem;
  color: #22c55e;
}

.no-vulnerabilities i {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.no-vulnerabilities p {
  font-size: 1.25rem;
  font-weight: 500;
}

.vuln-summary {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.patterns-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.patterns-card h2 i {
  color: #f97316;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.pattern-item {
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.pattern-item.danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.pattern-item.warning {
  background: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
}

.pattern-item code {
  display: block;
  font-family: monospace;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.pattern-item p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .options-row {
    flex-direction: column;
  }

  .scan-btn {
    width: 100%;
  }
}
</style>
