<template>
  <div class="test-view">
    <div class="test-header">
      <h1>{{ t('test.title') }}</h1>
      <p>{{ t('test.subtitle') }}</p>
    </div>

    <!-- How APK Analysis Works Section -->
    <section class="how-it-works-section">
      <h2>{{ t('test.howItWorks') }}</h2>
      <div class="analysis-flow">
        <div class="flow-step">
          <div class="step-visual">
            <div class="file-icon">
              <i class="pi pi-file"></i>
              <span>.apk</span>
            </div>
          </div>
          <div class="step-info">
            <h3>{{ t('test.flow.step1.title') }}</h3>
            <p>{{ t('test.flow.step1.desc') }}</p>
            <code>unzip app.apk -d extracted/</code>
          </div>
        </div>

        <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>

        <div class="flow-step">
          <div class="step-visual">
            <div class="folder-structure">
              <div class="folder">📁 META-INF/</div>
              <div class="folder">📁 res/</div>
              <div class="folder">📁 lib/</div>
              <div class="file highlight">📄 AndroidManifest.xml</div>
              <div class="file">📄 classes.dex</div>
            </div>
          </div>
          <div class="step-info">
            <h3>{{ t('test.flow.step2.title') }}</h3>
            <p>{{ t('test.flow.step2.desc') }}</p>
          </div>
        </div>

        <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>

        <div class="flow-step">
          <div class="step-visual">
            <div class="binary-visual">
              <div class="binary-line">03 00 08 00 78 07 00 00</div>
              <div class="binary-line">01 00 1C 00 A4 02 00 00</div>
              <div class="binary-line">android.permission.CAMERA</div>
              <div class="binary-line">android.permission.SMS</div>
            </div>
          </div>
          <div class="step-info">
            <h3>{{ t('test.flow.step3.title') }}</h3>
            <p>{{ t('test.flow.step3.desc') }}</p>
          </div>
        </div>

        <div class="flow-arrow"><i class="pi pi-arrow-right"></i></div>

        <div class="flow-step">
          <div class="step-visual">
            <div class="result-visual">
              <div class="risk-indicator critical">96%</div>
              <div class="perms-found">
                <span class="perm critical">SEND_SMS</span>
                <span class="perm critical">CAMERA</span>
                <span class="perm high">CONTACTS</span>
              </div>
            </div>
          </div>
          <div class="step-info">
            <h3>{{ t('test.flow.step4.title') }}</h3>
            <p>{{ t('test.flow.step4.desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Details -->
    <section class="technical-section">
      <h2>{{ t('test.technicalDetails') }}</h2>
      <div class="tech-cards">
        <div class="tech-card">
          <h3><i class="pi pi-file-edit"></i> {{ t('test.manifest.title') }}</h3>
          <p>{{ t('test.manifest.desc') }}</p>
          <ul>
            <li v-for="(item, index) in manifestItems" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="tech-card">
          <h3><i class="pi pi-cog"></i> {{ t('test.binaryXml.title') }}</h3>
          <p>{{ t('test.binaryXml.desc') }}</p>
          <ul>
            <li v-for="(item, index) in binaryXmlItems" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="tech-card">
          <h3><i class="pi pi-database"></i> {{ t('test.permissionDb.title') }}</h3>
          <p>{{ t('test.permissionDb.desc') }}</p>
          <ul>
            <li><span class="badge critical">Critical</span> - {{ t('test.permissionDb.critical') }}</li>
            <li><span class="badge high">High</span> - {{ t('test.permissionDb.high') }}</li>
            <li><span class="badge medium">Medium</span> - {{ t('test.permissionDb.medium') }}</li>
            <li><span class="badge low">Low</span> - {{ t('test.permissionDb.low') }}</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Sample APKs Section -->
    <section class="samples-section">
      <h2>{{ t('test.sampleApks') }}</h2>
      <p class="samples-desc">{{ t('test.sampleApksDesc') }}</p>

      <div v-if="loading" class="loading">
        <i class="pi pi-spin pi-spinner"></i>
        {{ t('common.loading') }}
      </div>

      <div v-else class="samples-grid">
        <div
          v-for="sample in samples"
          :key="sample.id"
          class="sample-card"
          :class="'risk-' + sample.riskLevel"
          @click="analyzeSample(sample.id)"
        >
          <div class="sample-icon">
            <i :class="'pi ' + sample.icon"></i>
          </div>
          <div class="sample-info">
            <h3>{{ sample.name }}</h3>
            <p>{{ getLocalizedText(sample.description) }}</p>
          </div>
          <div class="sample-risk">
            <span class="risk-badge" :class="sample.riskLevel">
              {{ sample.riskLevel.toUpperCase() }}
            </span>
          </div>
          <button class="analyze-btn">
            <i class="pi pi-search"></i>
            {{ t('test.analyze') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Analysis Result Modal -->
    <div v-if="showResult" class="modal-overlay" @click.self="showResult = false">
      <div class="modal-content">
        <button class="close-btn" @click="showResult = false">
          <i class="pi pi-times"></i>
        </button>

        <div v-if="analysisLoading" class="analysis-loading">
          <div class="spinner"></div>
          <p>{{ t('analyze.upload.analyzing') }}</p>
        </div>

        <div v-else-if="analysisResult" class="analysis-result">
          <div class="result-header" :class="'risk-' + analysisResult.security.overallRisk">
            <div class="risk-score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8"/>
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  :stroke="getRiskColor(analysisResult.security.overallRisk)"
                  stroke-width="8" stroke-linecap="round"
                  :stroke-dasharray="283"
                  :stroke-dashoffset="283 - (283 * analysisResult.security.riskScore / 100)"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div class="score-value">{{ analysisResult.security.riskScore }}%</div>
            </div>
            <div class="result-info">
              <h2>{{ analysisResult.basicInfo.fileName }}</h2>
              <p>{{ analysisResult.manifest.packageName }}</p>
              <span class="risk-level" :class="analysisResult.security.overallRisk">
                {{ analysisResult.security.overallRisk.toUpperCase() }} RISK
              </span>
            </div>
          </div>

          <div class="result-stats">
            <div class="stat">
              <span class="value critical">{{ analysisResult.permissions.byRisk.critical.length }}</span>
              <span class="label">Critical</span>
            </div>
            <div class="stat">
              <span class="value high">{{ analysisResult.permissions.byRisk.high.length }}</span>
              <span class="label">High</span>
            </div>
            <div class="stat">
              <span class="value medium">{{ analysisResult.permissions.byRisk.medium.length }}</span>
              <span class="label">Medium</span>
            </div>
            <div class="stat">
              <span class="value low">{{ analysisResult.permissions.byRisk.low.length }}</span>
              <span class="label">Low</span>
            </div>
          </div>

          <div v-if="analysisResult.security.issues.length > 0" class="issues-section">
            <h3><i class="pi pi-exclamation-triangle"></i> Security Issues</h3>
            <div class="issues-list">
              <div
                v-for="(issue, index) in analysisResult.security.issues"
                :key="index"
                class="issue-item"
                :class="issue.severity"
              >
                <strong>{{ getLocalizedText(issue.title) }}</strong>
                <p>{{ getLocalizedText(issue.description) }}</p>
              </div>
            </div>
          </div>

          <div class="permissions-section">
            <h3><i class="pi pi-lock"></i> Permissions ({{ analysisResult.permissions.total }})</h3>
            <div class="permissions-list">
              <span
                v-for="perm in [...analysisResult.permissions.byRisk.critical, ...analysisResult.permissions.byRisk.high].slice(0, 10)"
                :key="perm.name"
                class="perm-tag"
                :class="perm.risk"
              >
                {{ perm.name.replace('android.permission.', '') }}
              </span>
            </div>
          </div>

          <div class="recommendations-section">
            <h3><i class="pi pi-lightbulb"></i> Recommendations</h3>
            <ul>
              <li v-for="(rec, index) in analysisResult.security.recommendations" :key="index">
                {{ getLocalizedText(rec) }}
              </li>
            </ul>
          </div>

          <button @click="goToFullAnalysis" class="btn btn-primary">
            <i class="pi pi-external-link"></i>
            View Full Analysis
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const i18n = inject('i18n')
const router = useRouter()

const samples = ref([])
const loading = ref(true)
const showResult = ref(false)
const analysisLoading = ref(false)
const analysisResult = ref(null)

function t(key) {
  return i18n.t(key)
}

const manifestItems = computed(() => {
  return i18n.t('test.manifest.items') || []
})

const binaryXmlItems = computed(() => {
  return i18n.t('test.binaryXml.items') || []
})

function getLocalizedText(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[i18n.locale] || obj.en || ''
}

function getRiskColor(risk) {
  const colors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' }
  return colors[risk] || '#6b7280'
}

async function loadSamples() {
  try {
    const response = await axios.get('/api/analyze/samples')
    samples.value = response.data
  } catch (err) {
    console.error('Failed to load samples:', err)
  } finally {
    loading.value = false
  }
}

async function analyzeSample(sampleId) {
  showResult.value = true
  analysisLoading.value = true
  analysisResult.value = null

  try {
    const response = await axios.get(`/api/analyze/sample/${sampleId}`)
    if (response.data.success) {
      analysisResult.value = response.data.analysis
    }
  } catch (err) {
    console.error('Failed to analyze sample:', err)
  } finally {
    analysisLoading.value = false
  }
}

function goToFullAnalysis() {
  showResult.value = false
  router.push('/analyze?demo=true')
}

onMounted(() => {
  loadSamples()
})
</script>

<style scoped>
.test-view {
  max-width: 1200px;
  margin: 0 auto;
}

.test-header {
  text-align: center;
  margin-bottom: 3rem;
}

.test-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.test-header p {
  color: var(--text-secondary);
}

section {
  margin-bottom: 4rem;
}

section h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Analysis Flow */
.analysis-flow {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
}

.flow-step {
  flex: 1;
  min-width: 200px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
}

.step-visual {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.file-icon {
  width: 80px;
  height: 100px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.file-icon i { font-size: 2rem; }
.file-icon span { font-size: 0.75rem; margin-top: 0.5rem; }

.folder-structure {
  font-family: monospace;
  font-size: 0.8rem;
  text-align: left;
}

.folder { color: var(--text-secondary); }
.file { color: var(--text-color); }
.file.highlight { color: var(--primary-color); font-weight: bold; }

.binary-visual {
  font-family: monospace;
  font-size: 0.7rem;
  background: #1e1e1e;
  color: #0f0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: left;
}

.binary-line { margin: 0.25rem 0; }

.result-visual {
  text-align: center;
}

.risk-indicator {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.risk-indicator.critical { color: #ef4444; }

.perms-found {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  justify-content: center;
}

.perm {
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
}

.perm.critical { background: #fef2f2; color: #dc2626; }
.perm.high { background: #fff7ed; color: #ea580c; }

.step-info h3 {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.step-info p {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.step-info code {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 0.25rem;
  font-size: 0.7rem;
}

.flow-arrow {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 1.5rem;
  padding-top: 50px;
}

/* Technical Cards */
.tech-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.tech-card {
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
}

.tech-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.tech-card h3 i { color: var(--primary-color); }

.tech-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.tech-card ul {
  list-style: none;
  padding: 0;
}

.tech-card li {
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
}

.tech-card li:last-child { border-bottom: none; }

.badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
}

.badge.critical { background: #fef2f2; color: #dc2626; }
.badge.high { background: #fff7ed; color: #ea580c; }
.badge.medium { background: #fefce8; color: #ca8a04; }
.badge.low { background: #f0fdf4; color: #16a34a; }

/* Samples */
.samples-desc {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.samples-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.sample-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.sample-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.sample-card.risk-low:hover { border-color: #22c55e; }
.sample-card.risk-medium:hover { border-color: #eab308; }
.sample-card.risk-high:hover { border-color: #f97316; }
.sample-card.risk-critical:hover { border-color: #ef4444; }

.sample-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.sample-card.risk-low .sample-icon { background: #f0fdf4; color: #16a34a; }
.sample-card.risk-medium .sample-icon { background: #fefce8; color: #ca8a04; }
.sample-card.risk-high .sample-icon { background: #fff7ed; color: #ea580c; }
.sample-card.risk-critical .sample-icon { background: #fef2f2; color: #dc2626; }

.sample-info {
  flex: 1;
}

.sample-info h3 { margin-bottom: 0.25rem; }
.sample-info p { font-size: 0.85rem; color: var(--text-secondary); }

.risk-badge {
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 600;
}

.risk-badge.low { background: #f0fdf4; color: #16a34a; }
.risk-badge.medium { background: #fefce8; color: #ca8a04; }
.risk-badge.high { background: #fff7ed; color: #ea580c; }
.risk-badge.critical { background: #fef2f2; color: #dc2626; }

.analyze-btn {
  padding: 0.75rem 1.25rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: background 0.2s;
}

.analyze-btn:hover { background: var(--primary-dark); }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 1rem;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.analysis-loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.result-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.result-header.risk-critical { background: #fef2f2; }
.result-header.risk-high { background: #fff7ed; }
.result-header.risk-medium { background: #fefce8; }
.result-header.risk-low { background: #f0fdf4; }

.risk-score-circle {
  position: relative;
  width: 100px;
  height: 100px;
}

.risk-score-circle svg { width: 100%; height: 100%; }

.score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: bold;
}

.result-info h2 { margin-bottom: 0.25rem; }
.result-info p { font-family: monospace; font-size: 0.85rem; color: var(--text-secondary); }

.risk-level {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-level.critical { background: #dc2626; color: white; }
.risk-level.high { background: #ea580c; color: white; }
.risk-level.medium { background: #ca8a04; color: white; }
.risk-level.low { background: #16a34a; color: white; }

.result-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.result-stats .stat {
  flex: 1;
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
}

.result-stats .value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

.result-stats .value.critical { color: #dc2626; }
.result-stats .value.high { color: #ea580c; }
.result-stats .value.medium { color: #ca8a04; }
.result-stats .value.low { color: #16a34a; }

.result-stats .label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.issues-section, .permissions-section, .recommendations-section {
  margin-bottom: 1.5rem;
}

.issues-section h3, .permissions-section h3, .recommendations-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.issue-item {
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  border-left: 4px solid;
}

.issue-item.critical { background: #fef2f2; border-color: #dc2626; }
.issue-item.high { background: #fff7ed; border-color: #ea580c; }

.issue-item strong { display: block; margin-bottom: 0.25rem; }
.issue-item p { font-size: 0.85rem; color: var(--text-secondary); margin: 0; }

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.perm-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.perm-tag.critical { background: #fef2f2; color: #dc2626; }
.perm-tag.high { background: #fff7ed; color: #ea580c; }

.recommendations-section ul {
  list-style: none;
  padding: 0;
}

.recommendations-section li {
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  width: 100%;
  justify-content: center;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
}

.loading i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .tech-cards { grid-template-columns: 1fr; }
  .samples-grid { grid-template-columns: 1fr; }
  .analysis-flow { flex-direction: column; }
  .flow-arrow { transform: rotate(90deg); padding: 0; }
}

@media (max-width: 768px) {
  .test-header h1 {
    font-size: 1.75rem;
  }

  section {
    margin-bottom: 2.5rem;
  }

  section h2 {
    font-size: 1.25rem;
  }

  .flow-step {
    min-width: unset;
    padding: 1rem;
  }

  .step-visual {
    height: 90px;
  }

  .sample-card {
    flex-wrap: wrap;
    padding: 1rem;
    gap: 0.75rem;
  }

  .sample-info h3 {
    font-size: 0.95rem;
  }

  .sample-info p {
    font-size: 0.8rem;
  }

  .analyze-btn {
    width: 100%;
    justify-content: center;
    padding: 0.6rem 1rem;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    padding: 1.25rem;
  }

  .result-header {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    gap: 1rem;
  }

  .risk-score-circle {
    width: 80px;
    height: 80px;
  }

  .score-value {
    font-size: 1.25rem;
  }

  .result-info h2 {
    font-size: 1.1rem;
  }

  .result-stats {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .result-stats .stat {
    flex: 1 1 40%;
    padding: 0.75rem;
  }

  .result-stats .value {
    font-size: 1.25rem;
  }

  .tech-card {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .test-header h1 {
    font-size: 1.4rem;
  }

  section h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .flow-step {
    padding: 0.85rem;
  }

  .step-visual {
    height: 75px;
  }

  .step-info h3 {
    font-size: 0.85rem;
  }

  .step-info p {
    font-size: 0.75rem;
  }

  .binary-visual {
    font-size: 0.6rem;
    padding: 0.5rem;
  }

  .file-icon {
    width: 60px;
    height: 75px;
  }

  .file-icon i {
    font-size: 1.5rem;
  }

  .sample-card {
    padding: 0.85rem;
  }

  .sample-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .result-header {
    padding: 0.85rem;
  }

  .result-info h2 {
    font-size: 0.95rem;
    word-break: break-all;
  }

  .result-info p {
    font-size: 0.75rem;
  }

  .issue-item {
    padding: 0.75rem;
  }

  .issue-item strong {
    font-size: 0.85rem;
  }

  .issue-item p {
    font-size: 0.8rem;
  }

  .recommendations-section li {
    padding: 0.6rem;
    font-size: 0.8rem;
  }

  .perm-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }

  .btn {
    font-size: 0.85rem;
    padding: 0.65rem 1.25rem;
  }

  .tech-card h3 {
    font-size: 0.9rem;
  }

  .tech-card p {
    font-size: 0.8rem;
  }

  .tech-card li {
    font-size: 0.8rem;
  }
}
</style>
