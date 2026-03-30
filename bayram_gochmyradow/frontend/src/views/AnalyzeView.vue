<template>
  <div class="analyze-view">
    <h1>{{ t('analyze.title') }}</h1>

    <!-- Upload Section -->
    <div v-if="!analysisResult" class="upload-section">
      <div
        class="dropzone"
        :class="{ 'drag-over': isDragging, 'uploading': isUploading }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @click="triggerFileInput"
      >
        <input
          type="file"
          ref="fileInput"
          @change="handleFileSelect"
          accept=".apk"
          hidden
        />

        <div v-if="isUploading" class="upload-progress">
          <div class="spinner"></div>
          <p>{{ t('analyze.upload.analyzing') }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>

        <div v-else class="dropzone-content">
          <div class="dropzone-icon">
            <i class="pi pi-cloud-upload"></i>
          </div>
          <h3>{{ t('analyze.upload.dropzone') }}</h3>
          <p>{{ t('analyze.upload.hint') }}</p>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <i class="pi pi-exclamation-circle"></i>
        <span>{{ error }}</span>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="analysisResult" class="results-section">
      <div class="results-header">
        <h2>{{ t('analyze.result.title') }}</h2>
        <div class="results-actions">
          <button @click="newAnalysis" class="btn btn-secondary">
            <i class="pi pi-refresh"></i>
            {{ t('analyze.actions.newAnalysis') }}
          </button>
          <div class="export-dropdown">
            <button @click="showExportMenu = !showExportMenu" class="btn btn-primary">
              <i class="pi pi-download"></i>
              {{ t('analyze.actions.downloadReport') }}
              <i class="pi pi-chevron-down"></i>
            </button>
            <div v-if="showExportMenu" class="dropdown-menu">
              <button @click="exportJson">
                <i class="pi pi-file"></i>
                {{ t('export.json') }}
              </button>
              <button @click="exportHtml">
                <i class="pi pi-globe"></i>
                {{ t('export.html') }}
              </button>
              <button @click="exportPrint">
                <i class="pi pi-print"></i>
                {{ t('export.print') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Risk Score Overview -->
      <div class="risk-overview" :class="'risk-' + analysisResult.security.overallRisk">
        <div class="risk-score-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" stroke-width="8"/>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              :stroke="getRiskColor(analysisResult.security.overallRisk)"
              stroke-width="8"
              stroke-linecap="round"
              :stroke-dasharray="283"
              :stroke-dashoffset="283 - (283 * analysisResult.security.riskScore / 100)"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div class="risk-score-value">
            <span class="score">{{ analysisResult.security.riskScore }}%</span>
            <span class="label">{{ t('analyze.permissions.riskScore') }}</span>
          </div>
        </div>
        <div class="risk-info">
          <h3>{{ t('analyze.security.overallRisk') }}</h3>
          <span class="risk-level" :class="'level-' + analysisResult.security.overallRisk">
            {{ t('analyze.security.severity.' + analysisResult.security.overallRisk) }}
          </span>
          <div class="risk-summary">
            <div class="summary-item">
              <span class="count">{{ analysisResult.security.issues.length }}</span>
              <span class="label">{{ t('analyze.security.issues') }}</span>
            </div>
            <div class="summary-item">
              <span class="count">{{ analysisResult.security.warnings.length }}</span>
              <span class="label">{{ t('analyze.security.warnings') }}</span>
            </div>
            <div class="summary-item">
              <span class="count">{{ analysisResult.permissions.total }}</span>
              <span class="label">{{ t('analyze.permissions.total') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="result-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="{ active: activeTab === tab.id }"
          class="tab-btn"
        >
          <i :class="tab.icon"></i>
          {{ t(tab.label) }}
        </button>
      </div>

      <!-- Basic Info Tab -->
      <div v-if="activeTab === 'basic'" class="tab-content">
        <div class="info-grid">
          <div class="info-card">
            <i class="pi pi-file"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.fileName') }}</span>
              <span class="value">{{ analysisResult.basicInfo.fileName }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-box"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.packageName') }}</span>
              <span class="value">{{ analysisResult.manifest.packageName }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-tag"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.version') }}</span>
              <span class="value">{{ analysisResult.manifest.versionName }} ({{ analysisResult.manifest.versionCode }})</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-database"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.size') }}</span>
              <span class="value">{{ analysisResult.basicInfo.fileSizeFormatted }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-android"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.minSdk') }}</span>
              <span class="value">API {{ analysisResult.manifest.minSdkVersion || 'N/A' }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-android"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.targetSdk') }}</span>
              <span class="value">API {{ analysisResult.manifest.targetSdkVersion || 'N/A' }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-code"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.dexFiles') }}</span>
              <span class="value">{{ analysisResult.basicInfo.dexCount }}</span>
            </div>
          </div>
          <div class="info-card">
            <i class="pi pi-cog"></i>
            <div class="info-content">
              <span class="label">{{ t('analyze.basicInfo.nativeLibs') }}</span>
              <span class="value">{{ analysisResult.basicInfo.nativeLibraries.length || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Permissions Tab -->
      <div v-if="activeTab === 'permissions'" class="tab-content">
        <div class="permissions-overview">
          <div class="perm-stat critical">
            <span class="count">{{ analysisResult.permissions.byRisk.critical.length }}</span>
            <span class="label">{{ t('analyze.permissions.critical') }}</span>
          </div>
          <div class="perm-stat high">
            <span class="count">{{ analysisResult.permissions.byRisk.high.length }}</span>
            <span class="label">{{ t('analyze.permissions.high') }}</span>
          </div>
          <div class="perm-stat medium">
            <span class="count">{{ analysisResult.permissions.byRisk.medium.length }}</span>
            <span class="label">{{ t('analyze.permissions.medium') }}</span>
          </div>
          <div class="perm-stat low">
            <span class="count">{{ analysisResult.permissions.byRisk.low.length }}</span>
            <span class="label">{{ t('analyze.permissions.low') }}</span>
          </div>
        </div>

        <div class="permissions-table">
          <table>
            <thead>
              <tr>
                <th>{{ t('analyze.permissions.permission') }}</th>
                <th>{{ t('analyze.permissions.category') }}</th>
                <th>{{ t('analyze.permissions.risk') }}</th>
                <th>{{ t('analyze.permissions.description') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="perm in sortedPermissions" :key="perm.name">
                <td class="perm-name">{{ formatPermissionName(perm.name) }}</td>
                <td>
                  <span class="category-badge">{{ perm.category }}</span>
                </td>
                <td>
                  <span class="risk-badge" :class="'risk-' + perm.risk">
                    {{ t('analyze.security.severity.' + perm.risk) }}
                  </span>
                </td>
                <td class="perm-desc">{{ getLocalizedDescription(perm.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Security Tab -->
      <div v-if="activeTab === 'security'" class="tab-content">
        <!-- Issues -->
        <div v-if="analysisResult.security.issues.length > 0" class="security-section">
          <h3>
            <i class="pi pi-exclamation-triangle"></i>
            {{ t('analyze.security.issues') }}
          </h3>
          <div class="issue-list">
            <div
              v-for="(issue, index) in analysisResult.security.issues"
              :key="index"
              class="issue-card"
              :class="'severity-' + issue.severity"
            >
              <div class="issue-header">
                <span class="severity-badge" :class="issue.severity">
                  {{ t('analyze.security.severity.' + issue.severity) }}
                </span>
                <h4>{{ getLocalizedText(issue.title) }}</h4>
              </div>
              <p>{{ getLocalizedText(issue.description) }}</p>
              <div v-if="issue.permissions" class="issue-permissions">
                <span v-for="perm in issue.permissions" :key="perm" class="perm-tag">
                  {{ formatPermissionName(perm) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Warnings -->
        <div v-if="analysisResult.security.warnings.length > 0" class="security-section">
          <h3>
            <i class="pi pi-info-circle"></i>
            {{ t('analyze.security.warnings') }}
          </h3>
          <div class="issue-list">
            <div
              v-for="(warning, index) in analysisResult.security.warnings"
              :key="index"
              class="issue-card"
              :class="'severity-' + warning.severity"
            >
              <div class="issue-header">
                <span class="severity-badge" :class="warning.severity">
                  {{ t('analyze.security.severity.' + warning.severity) }}
                </span>
                <h4>{{ getLocalizedText(warning.title) }}</h4>
              </div>
              <p>{{ getLocalizedText(warning.description) }}</p>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="security-section">
          <h3>
            <i class="pi pi-lightbulb"></i>
            {{ t('analyze.security.recommendations') }}
          </h3>
          <ul class="recommendations-list">
            <li v-for="(rec, index) in analysisResult.security.recommendations" :key="index">
              <i class="pi pi-check-circle"></i>
              <span>{{ getLocalizedText(rec) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Signature Tab -->
      <div v-if="activeTab === 'signature'" class="tab-content">
        <div class="signature-info" v-if="analysisResult.signature">
          <!-- Signature Status -->
          <div class="signature-status" :class="{ 'signed': analysisResult.signature.isSigned, 'unsigned': !analysisResult.signature.isSigned }">
            <div class="status-icon">
              <i :class="analysisResult.signature.isSigned ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
            </div>
            <div class="status-text">
              <h3>{{ t('analyze.signature.status') }}</h3>
              <span>{{ analysisResult.signature.isSigned ? t('analyze.signature.signed') : t('analyze.signature.unsigned') }}</span>
            </div>
          </div>

          <!-- Signing Schemes -->
          <div class="signature-section" v-if="analysisResult.signature.signingSchemes.length > 0">
            <h3>
              <i class="pi pi-key"></i>
              {{ t('analyze.signature.schemes') }}
            </h3>
            <div class="schemes-list">
              <span class="scheme-badge" v-for="scheme in analysisResult.signature.signingSchemes" :key="scheme">
                {{ scheme }}
              </span>
            </div>
          </div>

          <!-- Certificates -->
          <div class="signature-section" v-if="analysisResult.signature.certificates.length > 0">
            <h3>
              <i class="pi pi-id-card"></i>
              {{ t('analyze.signature.certificates') }}
            </h3>
            <div class="cert-list">
              <div class="cert-card" v-for="cert in analysisResult.signature.certificates" :key="cert.name">
                <div class="cert-header">
                  <i class="pi pi-verified"></i>
                  <span>{{ cert.name }}</span>
                </div>
                <div class="cert-details">
                  <div class="cert-item">
                    <span class="label">{{ t('analyze.signature.algorithm') }}</span>
                    <span class="value">{{ cert.algorithm }}</span>
                  </div>
                  <div class="cert-item">
                    <span class="label">{{ t('analyze.signature.fingerprint') }}</span>
                    <code class="fingerprint">{{ cert.fingerprint }}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Signature Warnings -->
          <div class="signature-section warnings" v-if="analysisResult.signature.warnings && analysisResult.signature.warnings.length > 0">
            <h3>
              <i class="pi pi-exclamation-triangle"></i>
              {{ t('analyze.signature.warnings') }}
            </h3>
            <ul class="warning-list">
              <li v-for="(warning, index) in analysisResult.signature.warnings" :key="index">
                <i class="pi pi-info-circle"></i>
                <span>{{ getLocalizedText(warning) }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="no-signature" v-else>
          <i class="pi pi-info-circle"></i>
          <p>Signature information not available</p>
        </div>
      </div>

      <!-- Manifest Tab -->
      <div v-if="activeTab === 'manifest'" class="tab-content">
        <div class="manifest-grid">
          <!-- Activities -->
          <div class="manifest-section">
            <h3>
              <i class="pi pi-desktop"></i>
              {{ t('analyze.manifest.activities') }} ({{ analysisResult.manifest.activities.length }})
            </h3>
            <ul class="component-list">
              <li v-for="activity in analysisResult.manifest.activities" :key="activity">
                {{ formatComponentName(activity) }}
              </li>
            </ul>
          </div>

          <!-- Services -->
          <div class="manifest-section">
            <h3>
              <i class="pi pi-cog"></i>
              {{ t('analyze.manifest.services') }} ({{ analysisResult.manifest.services.length }})
            </h3>
            <ul class="component-list">
              <li v-for="service in analysisResult.manifest.services" :key="service">
                {{ formatComponentName(service) }}
              </li>
            </ul>
          </div>

          <!-- Receivers -->
          <div class="manifest-section">
            <h3>
              <i class="pi pi-wifi"></i>
              {{ t('analyze.manifest.receivers') }} ({{ analysisResult.manifest.receivers.length }})
            </h3>
            <ul class="component-list">
              <li v-for="receiver in analysisResult.manifest.receivers" :key="receiver">
                {{ formatComponentName(receiver) }}
              </li>
            </ul>
          </div>

          <!-- Flags -->
          <div class="manifest-section">
            <h3>
              <i class="pi pi-flag"></i>
              {{ t('analyze.manifest.flags') }}
            </h3>
            <div class="flags-list">
              <div class="flag-item" :class="{ danger: analysisResult.manifest.flags.debuggable }">
                <i :class="analysisResult.manifest.flags.debuggable ? 'pi pi-times-circle' : 'pi pi-check-circle'"></i>
                <span>{{ t('analyze.manifest.debuggable') }}</span>
                <span class="flag-value">{{ analysisResult.manifest.flags.debuggable ? t('common.yes') : t('common.no') }}</span>
              </div>
              <div class="flag-item" :class="{ warning: analysisResult.manifest.flags.allowBackup }">
                <i :class="analysisResult.manifest.flags.allowBackup ? 'pi pi-exclamation-circle' : 'pi pi-check-circle'"></i>
                <span>{{ t('analyze.manifest.allowBackup') }}</span>
                <span class="flag-value">{{ analysisResult.manifest.flags.allowBackup ? t('common.yes') : t('common.no') }}</span>
              </div>
              <div class="flag-item" :class="{ warning: analysisResult.manifest.flags.hasExportedComponents }">
                <i :class="analysisResult.manifest.flags.hasExportedComponents ? 'pi pi-exclamation-circle' : 'pi pi-check-circle'"></i>
                <span>{{ t('analyze.manifest.exportedComponents') }}</span>
                <span class="flag-value">{{ analysisResult.manifest.flags.hasExportedComponents ? t('common.yes') : t('common.no') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { addToHistory } from '../utils/storage.js'
import { downloadHtmlReport, downloadJsonReport, printReport } from '../utils/exportReport.js'

const i18n = inject('i18n')
const route = useRoute()

const fileInput = ref(null)
const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const error = ref(null)
const analysisResult = ref(null)
const activeTab = ref('basic')
const showExportMenu = ref(false)
const searchQuery = ref('')
const filterRisk = ref('all')

// Watch for analysis result changes to save to history
watch(analysisResult, (newVal) => {
  if (newVal) {
    addToHistory(newVal)
  }
})

const tabs = [
  { id: 'basic', label: 'analyze.result.basicInfo', icon: 'pi pi-info-circle' },
  { id: 'permissions', label: 'analyze.result.permissions', icon: 'pi pi-lock' },
  { id: 'security', label: 'analyze.result.security', icon: 'pi pi-shield' },
  { id: 'signature', label: 'analyze.result.signature', icon: 'pi pi-verified' },
  { id: 'manifest', label: 'analyze.result.manifest', icon: 'pi pi-file' }
]

function t(key) {
  return i18n.t(key)
}

const sortedPermissions = computed(() => {
  if (!analysisResult.value) return []

  const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  const allPerms = [
    ...analysisResult.value.permissions.byRisk.critical,
    ...analysisResult.value.permissions.byRisk.high,
    ...analysisResult.value.permissions.byRisk.medium,
    ...analysisResult.value.permissions.byRisk.low
  ]

  return allPerms.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk])
})

function triggerFileInput() {
  if (!isUploading.value) {
    fileInput.value.click()
  }
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    uploadFile(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.name.endsWith('.apk')) {
    uploadFile(file)
  } else {
    error.value = 'Please upload an APK file'
  }
}

async function uploadFile(file) {
  isUploading.value = true
  uploadProgress.value = 0
  error.value = null

  const formData = new FormData()
  formData.append('apk', file)

  try {
    // Simulate progress
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)

    const response = await axios.post('/api/analyze/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.data.success) {
      analysisResult.value = response.data.analysis
    } else {
      throw new Error(response.data.message?.en || 'Analysis failed')
    }
  } catch (err) {
    console.error('Upload error:', err)
    error.value = err.response?.data?.message?.en || err.message || 'Failed to analyze APK'
  } finally {
    isUploading.value = false
  }
}

async function loadDemo() {
  isUploading.value = true
  uploadProgress.value = 0

  try {
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 15
      }
    }, 100)

    const response = await axios.get('/api/analyze/demo')

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.data.success) {
      analysisResult.value = response.data.analysis
    }
  } catch (err) {
    error.value = 'Failed to load demo'
  } finally {
    isUploading.value = false
  }
}

function newAnalysis() {
  analysisResult.value = null
  error.value = null
  activeTab.value = 'basic'
}

function exportJson() {
  downloadJsonReport(analysisResult.value)
  showExportMenu.value = false
}

function exportHtml() {
  downloadHtmlReport(analysisResult.value, i18n.locale)
  showExportMenu.value = false
}

function exportPrint() {
  printReport(analysisResult.value, i18n.locale)
  showExportMenu.value = false
}

function getRiskColor(risk) {
  const colors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e'
  }
  return colors[risk] || '#6b7280'
}

function formatPermissionName(name) {
  return name.replace('android.permission.', '').replace(/_/g, ' ')
}

function formatComponentName(name) {
  const parts = name.split('.')
  return parts[parts.length - 1]
}

function getLocalizedText(obj) {
  if (!obj) return ''
  if (typeof obj === 'string') return obj
  return obj[i18n.locale] || obj.en || ''
}

function getLocalizedDescription(desc) {
  return getLocalizedText(desc)
}

async function loadSample(sampleId) {
  isUploading.value = true
  uploadProgress.value = 0
  error.value = null

  try {
    const progressInterval = setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 15
      }
    }, 100)

    const response = await axios.get(`/api/analyze/sample/${sampleId}`)

    clearInterval(progressInterval)
    uploadProgress.value = 100

    if (response.data.success) {
      analysisResult.value = response.data.analysis
    }
  } catch (err) {
    error.value = 'Failed to load sample analysis'
    console.error(err)
  } finally {
    isUploading.value = false
  }
}

onMounted(() => {
  if (route.query.demo === 'true') {
    loadDemo()
  } else if (route.query.sample) {
    loadSample(route.query.sample)
  }
})
</script>

<style scoped>
.analyze-view {
  max-width: 1200px;
  margin: 0 auto;
}

.analyze-view h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* Upload Section */
.upload-section {
  max-width: 700px;
  margin: 0 auto;
}

.dropzone {
  border: 3px dashed var(--border-color);
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: var(--card-bg);
}

.dropzone:hover,
.dropzone.drag-over {
  border-color: var(--primary-color);
  background: var(--bg-secondary);
}

.dropzone.uploading {
  cursor: default;
}

.dropzone-icon {
  width: 80px;
  height: 80px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.dropzone-icon i {
  font-size: 2.5rem;
  color: var(--primary-color);
}

.dropzone-content h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.dropzone-content p {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-bar {
  width: 100%;
  max-width: 300px;
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Results Section */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.results-actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

/* Export Dropdown */
.export-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  z-index: 100;
  min-width: 180px;
  overflow: hidden;
}

.dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 0.9rem;
  text-align: left;
  transition: background 0.2s;
}

.dropdown-menu button:hover {
  background: var(--bg-secondary);
}

.dropdown-menu button i {
  color: var(--primary-color);
}

.btn-secondary:hover {
  border-color: var(--primary-color);
}

/* Risk Overview */
.risk-overview {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.risk-score-circle {
  position: relative;
  width: 150px;
  height: 150px;
  flex-shrink: 0;
}

.risk-score-circle svg {
  width: 100%;
  height: 100%;
}

.risk-score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.risk-score-value .score {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
}

.risk-score-value .label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.risk-info h3 {
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
}

.risk-level {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.level-critical { background: #fef2f2; color: #dc2626; }
.level-high { background: #fff7ed; color: #ea580c; }
.level-medium { background: #fefce8; color: #ca8a04; }
.level-low { background: #f0fdf4; color: #16a34a; }

.risk-summary {
  display: flex;
  gap: 2rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-item .count {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.summary-item .label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Tabs */
.result-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 0.5rem 0.5rem 0 0;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.tab-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-color);
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.tab-content {
  background: var(--card-bg);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  padding: 1.5rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
}

.info-card > i {
  font-size: 1.25rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.info-content {
  display: flex;
  flex-direction: column;
}

.info-content .label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.info-content .value {
  font-weight: 600;
  color: var(--text-color);
  word-break: break-all;
}

/* Permissions */
.permissions-overview {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.perm-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
}

.perm-stat.critical { background: #fef2f2; }
.perm-stat.high { background: #fff7ed; }
.perm-stat.medium { background: #fefce8; }
.perm-stat.low { background: #f0fdf4; }

.perm-stat .count {
  font-size: 2rem;
  font-weight: 700;
}

.perm-stat.critical .count { color: #dc2626; }
.perm-stat.high .count { color: #ea580c; }
.perm-stat.medium .count { color: #ca8a04; }
.perm-stat.low .count { color: #16a34a; }

.perm-stat .label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.permissions-table {
  overflow-x: auto;
}

.permissions-table table {
  width: 100%;
  border-collapse: collapse;
}

.permissions-table th,
.permissions-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.permissions-table th {
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.perm-name {
  font-family: monospace;
  font-size: 0.85rem;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
  font-size: 0.75rem;
}

.risk-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-badge.risk-critical { background: #fef2f2; color: #dc2626; }
.risk-badge.risk-high { background: #fff7ed; color: #ea580c; }
.risk-badge.risk-medium { background: #fefce8; color: #ca8a04; }
.risk-badge.risk-low { background: #f0fdf4; color: #16a34a; }

.perm-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

/* Security */
.security-section {
  margin-bottom: 2rem;
}

.security-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.issue-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.issue-card {
  padding: 1.25rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
}

.issue-card.severity-critical {
  background: #fef2f2;
  border-color: #dc2626;
}

.issue-card.severity-high {
  background: #fff7ed;
  border-color: #ea580c;
}

.issue-card.severity-medium {
  background: #fefce8;
  border-color: #ca8a04;
}

.issue-card.severity-low {
  background: #f0fdf4;
  border-color: #16a34a;
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.severity-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.severity-badge.critical { background: #dc2626; color: white; }
.severity-badge.high { background: #ea580c; color: white; }
.severity-badge.medium { background: #ca8a04; color: white; }
.severity-badge.low { background: #16a34a; color: white; }

.issue-card h4 {
  font-size: 1rem;
  margin: 0;
}

.issue-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.issue-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.perm-tag {
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: monospace;
}

.recommendations-list {
  list-style: none;
  padding: 0;
}

.recommendations-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.recommendations-list li i {
  color: var(--primary-color);
  margin-top: 0.1rem;
}

/* Manifest */
.manifest-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Signature Tab Styles */
.signature-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.signature-status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--bg-secondary);
}

.signature-status.signed {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.signature-status.unsigned {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signature-status.signed .status-icon {
  background: rgba(34, 197, 94, 0.2);
}

.signature-status.unsigned .status-icon {
  background: rgba(239, 68, 68, 0.2);
}

.status-icon i {
  font-size: 2rem;
}

.signature-status.signed .status-icon i {
  color: #22c55e;
}

.signature-status.unsigned .status-icon i {
  color: #ef4444;
}

.status-text h3 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.status-text span {
  font-size: 1.5rem;
  font-weight: 700;
}

.signature-status.signed .status-text span {
  color: #22c55e;
}

.signature-status.unsigned .status-text span {
  color: #ef4444;
}

.signature-section {
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
}

.signature-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--text-color);
}

.signature-section h3 i {
  color: var(--primary-color);
}

.schemes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.scheme-badge {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.cert-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cert-card {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
}

.cert-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
}

.cert-header i {
  color: var(--primary-color);
}

.cert-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cert-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cert-item .label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.cert-item .value {
  font-weight: 500;
}

.fingerprint {
  font-family: monospace;
  font-size: 0.75rem;
  padding: 0.5rem;
  background: var(--card-bg);
  border-radius: 0.25rem;
  word-break: break-all;
}

.signature-section.warnings {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.05);
}

.signature-section.warnings h3 {
  color: #f59e0b;
}

.signature-section.warnings h3 i {
  color: #f59e0b;
}

.warning-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.warning-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(245, 158, 11, 0.1);
  border-radius: 0.5rem;
}

.warning-list li i {
  color: #f59e0b;
  margin-top: 0.1rem;
}

.no-signature {
  text-align: center;
  padding: 3rem;
  background: var(--bg-secondary);
  border-radius: 1rem;
}

.no-signature i {
  font-size: 3rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.no-signature p {
  color: var(--text-secondary);
}

.manifest-section {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 0.75rem;
}

.manifest-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.component-list {
  list-style: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.component-list li {
  padding: 0.5rem 0;
  font-family: monospace;
  font-size: 0.85rem;
  border-bottom: 1px solid var(--border-color);
}

.component-list li:last-child {
  border-bottom: none;
}

.flags-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.flag-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--card-bg);
  border-radius: 0.5rem;
}

.flag-item i {
  color: var(--success-color);
}

.flag-item.danger i {
  color: var(--danger-color);
}

.flag-item.warning i {
  color: var(--warning-color);
}

.flag-value {
  margin-left: auto;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .manifest-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analyze-view h1 {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }

  .risk-overview {
    flex-direction: column;
    text-align: center;
    padding: 1.25rem;
    gap: 1.5rem;
  }

  .risk-score-circle {
    width: 120px;
    height: 120px;
  }

  .risk-score-value .score {
    font-size: 1.5rem;
  }

  .risk-summary {
    justify-content: center;
    gap: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .permissions-overview {
    flex-wrap: wrap;
  }

  .perm-stat {
    flex: 1 1 45%;
  }

  .result-tabs {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .tab-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .tab-content {
    padding: 1rem;
  }

  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .results-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .results-actions .btn {
    flex: 1;
    justify-content: center;
    min-width: 0;
    padding: 0.6rem 0.75rem;
    font-size: 0.8rem;
  }

  .dropzone {
    padding: 2.5rem 1.25rem;
  }

  .dropzone-icon {
    width: 60px;
    height: 60px;
  }

  .dropzone-icon i {
    font-size: 2rem;
  }

  .permissions-table table {
    min-width: 600px;
  }

  .issue-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .summary-item .count {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .analyze-view h1 {
    font-size: 1.3rem;
  }

  .risk-overview {
    padding: 1rem;
  }

  .risk-score-circle {
    width: 100px;
    height: 100px;
  }

  .risk-score-value .score {
    font-size: 1.25rem;
  }

  .risk-level {
    padding: 0.35rem 1rem;
    font-size: 0.75rem;
  }

  .risk-summary {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.75rem;
    gap: 0.3rem;
  }

  .tab-content {
    padding: 0.75rem;
  }

  .perm-stat {
    padding: 0.75rem;
  }

  .perm-stat .count {
    font-size: 1.5rem;
  }

  .info-card {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  .info-content .value {
    font-size: 0.85rem;
  }

  .issue-card {
    padding: 1rem;
  }

  .issue-card h4 {
    font-size: 0.9rem;
  }

  .issue-card p {
    font-size: 0.8rem;
  }

  .dropzone {
    padding: 2rem 1rem;
  }

  .dropzone-content h3 {
    font-size: 0.95rem;
  }

  .dropzone-content p {
    font-size: 0.8rem;
  }

  .signature-status {
    flex-direction: column;
    text-align: center;
    padding: 1rem;
    gap: 1rem;
  }

  .status-text span {
    font-size: 1.2rem;
  }

  .cert-item .value {
    font-size: 0.85rem;
  }

  .fingerprint {
    font-size: 0.65rem;
  }

  .manifest-section h3 {
    font-size: 0.85rem;
  }

  .component-list li {
    font-size: 0.75rem;
  }
}
</style>
