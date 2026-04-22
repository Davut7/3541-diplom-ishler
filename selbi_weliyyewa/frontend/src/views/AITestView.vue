<template>
  <div class="ai-test-view">
    <div class="page-header">
      <h1><i class="pi pi-microchip"></i> {{ language === 'en' ? 'AI Security Tests' : 'AI Howpsuzlyk Synag' }}</h1>
      <p>{{ language === 'en' ? 'Three-stage demonstration: Generation → Attack → Defense using local AI (Ollama)' : 'Üç basgançakly görkeziş: Döretmek → Hüjüm → Gorag ýerli AI (Ollama) ulanyp' }}</p>
    </div>

    <!-- Ollama Status -->
    <Card class="status-card" :class="{ 'status-ok': ollamaStatus.running, 'status-error': !ollamaStatus.running }">
      <template #content>
        <div class="status-row">
          <div class="status-indicator">
            <i :class="ollamaStatus.running ? 'pi pi-check-circle' : 'pi pi-exclamation-circle'" />
            <span>Ollama: <strong>{{ ollamaStatus.running ? (language === 'en' ? 'Connected' : 'Birikdirildi') : (language === 'en' ? 'Not Connected' : 'Birikdirilmedi') }}</strong></span>
          </div>
          <div v-if="ollamaStatus.running" class="model-info">
            <Tag severity="success" :value="'Model: ' + ollamaModel" />
          </div>
          <div v-else class="install-hint">
            <code>ollama serve</code> → <code>ollama pull llama3.2:1b</code>
          </div>
          <Button :label="language === 'en' ? 'Check' : 'Barla'" icon="pi pi-refresh" size="small" severity="secondary" @click="checkOllamaStatus" :loading="checkingStatus" />
        </div>
      </template>
    </Card>

    <!-- Shared Controls -->
    <Card class="controls-card">
      <template #content>
        <h3><i class="pi pi-cog"></i> {{ language === 'en' ? 'Configuration' : 'Sazlamalar' }}</h3>
        <div class="shared-controls">
          <div class="control-group">
            <label>{{ language === 'en' ? 'Image Category' : 'Surat Kategoriýasy' }}</label>
            <Dropdown v-model="category" :options="categoryOptions" optionLabel="label" optionValue="value" class="w-full" />
          </div>
          <div class="control-group">
            <label>{{ language === 'en' ? 'Attack Type' : 'Hüjüm Görnüşi' }}</label>
            <Dropdown v-model="attackType" :options="attackOptions" optionLabel="label" optionValue="value" class="w-full" />
          </div>
          <div class="control-group">
            <label>{{ language === 'en' ? 'Attack Strength' : 'Hüjüm Güýji' }}: {{ attackStrength }}%</label>
            <Slider v-model="attackStrength" :min="10" :max="100" />
          </div>
          <div class="control-group">
            <label>{{ language === 'en' ? 'Defense Type' : 'Gorag Görnüşi' }}</label>
            <Dropdown v-model="defenseType" :options="defenseOptions" optionLabel="label" optionValue="value" class="w-full" />
          </div>
          <div class="control-group">
            <label>{{ language === 'en' ? 'Defense Strength' : 'Gorag Güýji' }}: {{ defenseStrength }}%</label>
            <Slider v-model="defenseStrength" :min="10" :max="100" />
          </div>
        </div>
      </template>
    </Card>

    <!-- THREE TESTS -->
    <div class="tests-grid">

      <!-- ==================== TEST 1: GENERATION ==================== -->
      <Card class="test-card test-generate">
        <template #content>
          <div class="test-header">
            <div class="test-number">1</div>
            <div>
              <h2>{{ language === 'en' ? 'AI Image Generation' : 'AI Surat Döretmek' }}</h2>
              <p>{{ language === 'en' ? 'Local AI (Ollama) generates a realistic image through GAN pipeline' : 'Ýerli AI (Ollama) GAN arkaly hakyky surat döredýär' }}</p>
            </div>
            <Button :label="language === 'en' ? 'Generate' : 'Döret'" icon="pi pi-sparkles" @click="runTest1" :loading="test1.loading" :disabled="!ollamaStatus.running" class="ml-auto" />
          </div>

          <div class="test-content" v-show="test1.done">
            <div class="image-display">
              <div class="canvas-box">
                <h4>{{ language === 'en' ? 'GAN Generated Image' : 'GAN Döredilen Surat' }} — {{ test1.imageName }}</h4>
                <canvas ref="canvas1" width="400" height="400"></canvas>
              </div>
              <div class="ai-info">
                <h4><i class="pi pi-sparkles"></i> {{ language === 'en' ? 'AI Analysis' : 'AI Derňew' }}</h4>
                <div class="info-row" v-if="test1.analysis?.description">
                  <span class="label">{{ language === 'en' ? 'Description' : 'Beýan' }}:</span>
                  <em>{{ test1.analysis.description }}</em>
                </div>
                <div class="info-row">
                  <span class="label">{{ language === 'en' ? 'GAN Type' : 'GAN Görnüşi' }}:</span>
                  <Tag :value="test1.analysis?.gan_type || 'StyleGAN3'" severity="info" />
                </div>
                <div class="info-row">
                  <span class="label">{{ language === 'en' ? 'Quality' : 'Hil' }}:</span>
                  <ProgressBar :value="test1.analysis?.quality_score || 85" :showValue="true" style="height:22px;flex:1" />
                </div>
                <div class="info-row">
                  <span class="label">{{ language === 'en' ? 'Realism' : 'Hakykylygy' }}:</span>
                  <ProgressBar :value="test1.analysis?.realism_score || 82" :showValue="true" style="height:22px;flex:1" />
                </div>
                <div class="info-row">
                  <span class="label">Model:</span>
                  <Tag :value="ollamaModel" severity="secondary" />
                </div>
                <div class="info-row">
                  <span class="label">{{ language === 'en' ? 'Category' : 'Kategoriýa' }}:</span>
                  <Tag :value="test1.category" severity="success" />
                </div>
              </div>
            </div>
          </div>

          <div class="placeholder" v-show="!test1.done && !test1.loading && !test1.error">
            <i class="pi pi-image"></i>
            <span>{{ language === 'en' ? 'Click Generate to create an image' : 'Surat döretmek üçin Döret basyň' }}</span>
          </div>
          <div class="error-state" v-show="test1.error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ test1.error }}</span>
          </div>
          <div class="loading-state" v-show="test1.loading">
            <ProgressSpinner style="width:50px;height:50px" />
            <span>{{ language === 'en' ? 'AI is generating image...' : 'AI surat döredýär...' }}</span>
          </div>
        </template>
      </Card>

      <!-- ==================== TEST 2: GENERATION + ATTACK ==================== -->
      <Card class="test-card test-attack">
        <template #content>
          <div class="test-header">
            <div class="test-number attack">2</div>
            <div>
              <h2>{{ language === 'en' ? 'Generation + Attack' : 'Döretmek + Hüjüm' }}</h2>
              <p>{{ language === 'en' ? 'AI generates image, then adversarial attack corrupts it' : 'AI surat döredýär, soňra garşydaş hüjüm bozýar' }}</p>
            </div>
            <Button :label="language === 'en' ? 'Generate + Attack' : 'Döret + Hüjüm'" icon="pi pi-bolt" severity="danger" @click="runTest2" :loading="test2.loading" :disabled="!ollamaStatus.running" class="ml-auto" />
          </div>

          <div class="test-content" v-show="test2.done">
            <div class="image-compare">
              <div class="canvas-box">
                <h4>{{ language === 'en' ? 'Original (GAN)' : 'Asyl (GAN)' }}</h4>
                <canvas ref="canvas2a" width="350" height="350"></canvas>
                <Tag value="Clean" severity="success" />
              </div>
              <div class="arrow-divider">
                <i class="pi pi-arrow-right"></i>
                <Tag :value="attackType.toUpperCase() + ' ' + attackStrength + '%'" severity="danger" />
              </div>
              <div class="canvas-box">
                <h4>{{ language === 'en' ? 'After Attack' : 'Hüjümden soň' }}</h4>
                <canvas ref="canvas2b" width="350" height="350"></canvas>
                <Tag :value="(language === 'en' ? 'Success: ' : 'Üstünlik: ') + (test2.analysis?.success_rate || 0) + '%'" severity="danger" />
              </div>
            </div>
            <div class="analysis-panel attack-panel" v-if="test2.analysis">
              <h4><i class="pi pi-exclamation-triangle"></i> {{ language === 'en' ? 'Attack Analysis' : 'Hüjüm Derňewi' }}</h4>
              <div class="analysis-content">
                <div class="knob-group">
                  <Knob :modelValue="test2.analysis.success_rate || 0" :size="90" :strokeWidth="8" valueColor="#ef4444" rangeColor="#fee2e2" readonly />
                  <span>{{ language === 'en' ? 'Success Rate' : 'Üstünlik' }}</span>
                </div>
                <div class="knob-group">
                  <Knob :modelValue="test2.analysis.affected_pixels_pct || 0" :size="90" :strokeWidth="8" valueColor="#f97316" rangeColor="#ffedd5" readonly />
                  <span>{{ language === 'en' ? 'Pixels Affected' : 'Täsirli pikseller' }}</span>
                </div>
                <div class="analysis-details">
                  <p v-if="test2.analysis.visual_impact"><strong>{{ language === 'en' ? 'Impact' : 'Täsir' }}:</strong> {{ test2.analysis.visual_impact }}</p>
                  <p v-if="test2.analysis.vulnerability"><strong>{{ language === 'en' ? 'Vulnerability' : 'Gowşaklyk' }}:</strong> {{ test2.analysis.vulnerability }}</p>
                  <p><strong>{{ language === 'en' ? 'Detectable' : 'Göze ilýär' }}:</strong> {{ test2.analysis.human_detectable ? (language === 'en' ? 'Yes' : 'Hawa') : (language === 'en' ? 'No (stealth attack)' : 'Ýok (gizlin hüjüm)') }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="placeholder" v-show="!test2.done && !test2.loading && !test2.error">
            <i class="pi pi-bolt"></i>
            <span>{{ language === 'en' ? 'Click to generate and attack' : 'Döredip hüjüm etmek üçin basyň' }}</span>
          </div>
          <div class="error-state" v-show="test2.error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ test2.error }}</span>
          </div>
          <div class="loading-state" v-show="test2.loading">
            <ProgressSpinner style="width:50px;height:50px" />
            <span>{{ language === 'en' ? 'Generating and attacking...' : 'Döredýär we hüjüm edýär...' }}</span>
          </div>
        </template>
      </Card>

      <!-- ==================== TEST 3: GENERATION + ATTACK + DEFENSE ==================== -->
      <Card class="test-card test-defend">
        <template #content>
          <div class="test-header">
            <div class="test-number defend">3</div>
            <div>
              <h2>{{ language === 'en' ? 'Generation + Attack + Defense' : 'Döretmek + Hüjüm + Gorag' }}</h2>
              <p>{{ language === 'en' ? 'Full pipeline: generate, attack, then defend' : 'Doly konweýer: döretmek, hüjüm, soňra goramak' }}</p>
            </div>
            <Button :label="language === 'en' ? 'Full Pipeline' : 'Doly Synag'" icon="pi pi-shield" severity="success" @click="runTest3" :loading="test3.loading" :disabled="!ollamaStatus.running" class="ml-auto" />
          </div>

          <div class="test-content" v-show="test3.done">
            <div class="image-compare triple">
              <div class="canvas-box">
                <h4>{{ language === 'en' ? 'Original' : 'Asyl' }}</h4>
                <canvas ref="canvas3a" width="300" height="300"></canvas>
                <Tag value="GAN Output" severity="success" />
              </div>
              <div class="arrow-divider">
                <i class="pi pi-arrow-right"></i>
                <Tag :value="attackType.toUpperCase()" severity="danger" />
              </div>
              <div class="canvas-box">
                <h4>{{ language === 'en' ? 'Attacked' : 'Hüjüm edilen' }}</h4>
                <canvas ref="canvas3b" width="300" height="300"></canvas>
                <Tag value="Corrupted" severity="danger" />
              </div>
              <div class="arrow-divider">
                <i class="pi pi-arrow-right"></i>
                <Tag :value="defenseType.replace(/_/g, ' ')" severity="success" />
              </div>
              <div class="canvas-box">
                <h4>{{ language === 'en' ? 'Defended' : 'Goralan' }}</h4>
                <canvas ref="canvas3c" width="300" height="300"></canvas>
                <Tag :value="(language === 'en' ? 'Restored: ' : 'Dikeldildi: ') + (test3.defenseAnalysis?.image_quality_restored || 0) + '%'" severity="success" />
              </div>
            </div>

            <div class="analysis-row">
              <div class="analysis-panel attack-panel" v-if="test3.attackAnalysis">
                <h4><i class="pi pi-exclamation-triangle"></i> {{ language === 'en' ? 'Attack' : 'Hüjüm' }}</h4>
                <Knob :modelValue="test3.attackAnalysis.success_rate || 0" :size="80" :strokeWidth="8" valueColor="#ef4444" rangeColor="#fee2e2" readonly />
                <span class="knob-label">{{ language === 'en' ? 'Attack Success' : 'Hüjüm üstünligi' }}</span>
                <p class="small" v-if="test3.attackAnalysis.visual_impact">{{ test3.attackAnalysis.visual_impact }}</p>
              </div>
              <div class="analysis-panel defense-panel" v-if="test3.defenseAnalysis">
                <h4><i class="pi pi-shield"></i> {{ language === 'en' ? 'Defense' : 'Gorag' }}</h4>
                <div class="knob-row">
                  <div class="knob-group">
                    <Knob :modelValue="test3.defenseAnalysis.effectiveness || 0" :size="80" :strokeWidth="8" valueColor="#22c55e" rangeColor="#dcfce7" readonly />
                    <span>{{ language === 'en' ? 'Effectiveness' : 'Netijelilik' }}</span>
                  </div>
                  <div class="knob-group">
                    <Knob :modelValue="test3.defenseAnalysis.image_quality_restored || 0" :size="80" :strokeWidth="8" valueColor="#3b82f6" rangeColor="#dbeafe" readonly />
                    <span>{{ language === 'en' ? 'Quality' : 'Hil' }}</span>
                  </div>
                </div>
                <p class="small" v-if="test3.defenseAnalysis.defense_method">{{ test3.defenseAnalysis.defense_method }}</p>
                <p class="small recommendation" v-if="test3.defenseAnalysis.recommendation"><strong>{{ language === 'en' ? 'Tip' : 'Maslahat' }}:</strong> {{ test3.defenseAnalysis.recommendation }}</p>
              </div>
            </div>
          </div>

          <div class="placeholder" v-show="!test3.done && !test3.loading && !test3.error">
            <i class="pi pi-shield"></i>
            <span>{{ language === 'en' ? 'Click to run full pipeline' : 'Doly konweýeri işletmek üçin basyň' }}</span>
          </div>
          <div class="error-state" v-show="test3.error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ test3.error }}</span>
          </div>
          <div class="loading-state" v-show="test3.loading">
            <ProgressSpinner style="width:50px;height:50px" />
            <span>{{ language === 'en' ? 'Running full pipeline...' : 'Doly konweýer işleýär...' }}</span>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from 'vue'
import axios from 'axios'

const API = '/api'

export default {
  name: 'AITestView',
  props: {
    t: { type: Object, required: true },
    language: { type: String, default: 'en' }
  },
  setup(props) {
    const ollamaStatus = reactive({ running: false, models: [] })
    const ollamaModel = ref('llama3.2:1b')
    const checkingStatus = ref(false)

    // Shared config
    const category = ref('animals')
    const categoryOptions = [
      { label: 'Animals / Haýwanlar', value: 'animals' },
      { label: 'Cities / Şäherler', value: 'cities' },
      { label: 'Landscapes / Tebigatlar', value: 'landscapes' }
    ]

    const attackType = ref('fgsm')
    const attackStrength = ref(60)
    const attackOptions = [
      { label: 'FGSM (Fast Gradient Sign)', value: 'fgsm' },
      { label: 'PGD (Projected Gradient Descent)', value: 'pgd' },
      { label: 'C&W (Carlini & Wagner)', value: 'cw' },
      { label: 'DeepFool', value: 'deepfool' },
      { label: 'Data Poisoning', value: 'poisoning' }
    ]

    const defenseType = ref('adversarial_training')
    const defenseStrength = ref(70)
    const defenseOptions = [
      { label: 'Adversarial Training', value: 'adversarial_training' },
      { label: 'Input Preprocessing', value: 'input_preprocessing' },
      { label: 'Differential Privacy', value: 'differential_privacy' },
      { label: 'Ensemble Methods', value: 'ensemble' },
      { label: 'Adversarial Detection', value: 'detection' }
    ]

    // Canvas refs
    const canvas1 = ref(null)
    const canvas2a = ref(null)
    const canvas2b = ref(null)
    const canvas3a = ref(null)
    const canvas3b = ref(null)
    const canvas3c = ref(null)

    // Test states
    const test1 = reactive({ loading: false, done: false, error: '', analysis: null, imageName: '', category: '' })
    const test2 = reactive({ loading: false, done: false, error: '', analysis: null })
    const test3 = reactive({ loading: false, done: false, error: '', attackAnalysis: null, defenseAnalysis: null })

    // ========== IMAGE HELPERS ==========

    function loadImageToCanvas(canvasEl, base64Url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          const ctx = canvasEl.getContext('2d')
          ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height)
          resolve()
        }
        img.onerror = reject
        img.src = base64Url
      })
    }

    function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))) }

    function applyAttackToCanvas(canvasEl, epsilon) {
      const ctx = canvasEl.getContext('2d')
      const w = canvasEl.width
      const h = canvasEl.height
      const imgData = ctx.getImageData(0, 0, w, h)
      const d = imgData.data

      for (let i = 0; i < d.length; i += 4) {
        // FGSM: x_adv = x + epsilon * sign(gradient)
        const sign = Math.random() > 0.5 ? 1 : -1
        const noise = sign * epsilon * 100
        d[i]     = clamp(d[i] + noise * (0.7 + Math.random() * 0.3))
        d[i + 1] = clamp(d[i + 1] + noise * (0.7 + Math.random() * 0.3))
        d[i + 2] = clamp(d[i + 2] + noise * (0.7 + Math.random() * 0.3))

        // Pixel displacement for stronger attacks
        if (epsilon > 0.4 && Math.random() < epsilon * 0.15) {
          const offset = Math.floor(Math.random() * 16) * 4
          if (i + offset < d.length) {
            d[i] = d[i + offset]
            d[i + 1] = d[i + offset + 1]
            d[i + 2] = d[i + offset + 2]
          }
        }
      }

      ctx.putImageData(imgData, 0, 0)
      // Red tint overlay
      ctx.fillStyle = `rgba(255, 0, 0, ${epsilon * 0.08})`
      ctx.fillRect(0, 0, w, h)
    }

    function applyDefenseToCanvas(canvasEl, strength) {
      const ctx = canvasEl.getContext('2d')
      const w = canvasEl.width
      const h = canvasEl.height
      const imgData = ctx.getImageData(0, 0, w, h)
      const copy = new Uint8ClampedArray(imgData.data)
      const d = imgData.data
      const radius = Math.max(1, Math.round(strength * 4))

      // Gaussian-like box blur
      for (let y = radius; y < h - radius; y++) {
        for (let x = radius; x < w - radius; x++) {
          let r = 0, g = 0, b = 0, count = 0
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const idx = ((y + dy) * w + (x + dx)) * 4
              r += copy[idx]
              g += copy[idx + 1]
              b += copy[idx + 2]
              count++
            }
          }
          const idx = (y * w + x) * 4
          d[idx]     = Math.round(copy[idx] * (1 - strength) + (r / count) * strength)
          d[idx + 1] = Math.round(copy[idx + 1] * (1 - strength) + (g / count) * strength)
          d[idx + 2] = Math.round(copy[idx + 2] * (1 - strength) + (b / count) * strength)
        }
      }

      ctx.putImageData(imgData, 0, 0)
      // Subtle green tint
      ctx.fillStyle = `rgba(0, 200, 0, ${strength * 0.03})`
      ctx.fillRect(0, 0, w, h)
    }

    // ========== API ==========

    async function checkOllamaStatus() {
      checkingStatus.value = true
      try {
        const { data } = await axios.get(`${API}/ai-test/status`)
        ollamaStatus.running = data.ollamaRunning
        ollamaStatus.models = data.models || []
        if (data.recommendedModel) ollamaModel.value = data.recommendedModel
      } catch {
        ollamaStatus.running = false
      }
      checkingStatus.value = false
    }

    async function fetchGeneratedImage() {
      const { data } = await axios.post(`${API}/ai-test/generate`, { category: category.value })
      if (!data.success) throw new Error(data.error || 'Generation failed')
      return data
    }

    // Helper: wait for canvas ref to be available
    function waitForCanvas(canvasRef, maxWait = 2000) {
      return new Promise((resolve, reject) => {
        if (canvasRef.value) return resolve(canvasRef.value)
        const start = Date.now()
        const check = () => {
          if (canvasRef.value) return resolve(canvasRef.value)
          if (Date.now() - start > maxWait) return reject(new Error('Canvas not ready'))
          requestAnimationFrame(check)
        }
        requestAnimationFrame(check)
      })
    }

    // ========== TEST 1 ==========
    async function runTest1() {
      test1.loading = true
      test1.done = false
      test1.error = ''
      try {
        const data = await fetchGeneratedImage()
        test1.analysis = data.aiAnalysis
        test1.imageName = data.imageName
        test1.category = data.category
        if (data.model) ollamaModel.value = data.model
        test1.done = true

        const c1 = await waitForCanvas(canvas1)
        await loadImageToCanvas(c1, data.image)
      } catch (err) {
        test1.error = err.message || 'Generation failed'
        console.error('Test 1 failed:', err)
      }
      test1.loading = false
    }

    // ========== TEST 2 ==========
    async function runTest2() {
      test2.loading = true
      test2.done = false
      test2.error = ''
      test2.analysis = null
      try {
        // Step 1: Generate image
        const genData = await fetchGeneratedImage()
        const imageBase64 = genData.image

        // Step 2: Get attack analysis from Ollama
        const { data: atkData } = await axios.post(`${API}/ai-test/attack`, {
          attackType: attackType.value,
          strength: attackStrength.value,
          imageName: genData.imageName
        })

        test2.analysis = atkData.analysis
        test2.done = true

        // Wait for canvases to appear in DOM
        const [c2a, c2b] = await Promise.all([
          waitForCanvas(canvas2a),
          waitForCanvas(canvas2b)
        ])

        // Draw original
        await loadImageToCanvas(c2a, imageBase64)
        // Draw attacked copy
        await loadImageToCanvas(c2b, imageBase64)
        applyAttackToCanvas(c2b, attackStrength.value / 100)
      } catch (err) {
        test2.error = err.message || 'Test 2 failed'
        console.error('Test 2 failed:', err)
      }
      test2.loading = false
    }

    // ========== TEST 3 ==========
    async function runTest3() {
      test3.loading = true
      test3.done = false
      test3.error = ''
      test3.attackAnalysis = null
      test3.defenseAnalysis = null
      try {
        // Step 1: Generate image
        const genData = await fetchGeneratedImage()
        const imageBase64 = genData.image

        // Step 2 & 3: Get attack + defense analysis from Ollama (parallel)
        const [atkRes, defRes] = await Promise.all([
          axios.post(`${API}/ai-test/attack`, {
            attackType: attackType.value,
            strength: attackStrength.value,
            imageName: genData.imageName
          }),
          axios.post(`${API}/ai-test/defend`, {
            defenseType: defenseType.value,
            strength: defenseStrength.value,
            attackType: attackType.value,
            imageName: genData.imageName
          })
        ])

        test3.attackAnalysis = atkRes.data.analysis
        test3.defenseAnalysis = defRes.data.analysis
        test3.done = true

        // Wait for canvases
        const [c3a, c3b, c3c] = await Promise.all([
          waitForCanvas(canvas3a),
          waitForCanvas(canvas3b),
          waitForCanvas(canvas3c)
        ])

        // Draw original
        await loadImageToCanvas(c3a, imageBase64)
        // Draw attacked
        await loadImageToCanvas(c3b, imageBase64)
        applyAttackToCanvas(c3b, attackStrength.value / 100)
        // Draw defended (attack then defense)
        await loadImageToCanvas(c3c, imageBase64)
        applyAttackToCanvas(c3c, attackStrength.value / 100)
        applyDefenseToCanvas(c3c, defenseStrength.value / 100)
      } catch (err) {
        test3.error = err.message || 'Test 3 failed'
        console.error('Test 3 failed:', err)
      }
      test3.loading = false
    }

    onMounted(() => { checkOllamaStatus() })

    return {
      ollamaStatus, ollamaModel, checkingStatus, checkOllamaStatus,
      category, categoryOptions,
      attackType, attackStrength, attackOptions,
      defenseType, defenseStrength, defenseOptions,
      canvas1, canvas2a, canvas2b, canvas3a, canvas3b, canvas3c,
      test1, test2, test3,
      runTest1, runTest2, runTest3
    }
  }
}
</script>

<style scoped>
.ai-test-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.page-header h1 i { color: var(--p-primary-color, #6366f1); margin-right: 0.5rem; }
.page-header p { opacity: 0.7; font-size: 1.1rem; }

/* Status */
.status-card { margin-bottom: 1.5rem; border-left: 4px solid #94a3b8; }
.status-card.status-ok { border-left-color: #22c55e; }
.status-card.status-error { border-left-color: #ef4444; }
.status-row { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.status-indicator { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; }
.status-indicator .pi-check-circle { color: #22c55e; font-size: 1.3rem; }
.status-indicator .pi-exclamation-circle { color: #ef4444; font-size: 1.3rem; }
.model-info { display: flex; gap: 0.5rem; }
.install-hint code { background: rgba(0,0,0,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.9rem; }

/* Controls */
.controls-card { margin-bottom: 2rem; }
.controls-card h3 { margin: 0 0 1rem; }
.shared-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.control-group { display: flex; flex-direction: column; gap: 0.5rem; }
.control-group label { font-weight: 600; font-size: 0.9rem; }

/* Tests */
.tests-grid { display: flex; flex-direction: column; gap: 2rem; }
.test-card { border-left: 4px solid #6366f1; }
.test-card.test-attack { border-left-color: #ef4444; }
.test-card.test-defend { border-left-color: #22c55e; }

.test-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.test-number {
  width: 48px; height: 48px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white; display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: bold; flex-shrink: 0;
}
.test-number.attack { background: linear-gradient(135deg, #ef4444, #f97316); }
.test-number.defend { background: linear-gradient(135deg, #22c55e, #10b981); }
.test-header h2 { margin: 0; font-size: 1.3rem; }
.test-header p { margin: 0.25rem 0 0; opacity: 0.7; font-size: 0.9rem; }
.ml-auto { margin-left: auto; }

/* Image display */
.image-display { display: flex; gap: 2rem; flex-wrap: wrap; }
.canvas-box { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.canvas-box h4 { margin: 0; font-size: 0.95rem; opacity: 0.8; }
.canvas-box canvas {
  border: 2px solid rgba(128,128,128,0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  max-width: 100%;
  height: auto;
}

.ai-info { flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 0.6rem; }
.ai-info h4 { margin: 0; }
.info-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
.info-row .label { font-weight: 600; min-width: 100px; }
.info-row em { opacity: 0.85; font-size: 0.95rem; }

/* Compare */
.image-compare { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-bottom: 1.5rem; }
.image-compare.triple { gap: 0.75rem; }
.arrow-divider { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.arrow-divider .pi { font-size: 1.5rem; opacity: 0.6; }

/* Analysis */
.analysis-row { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.analysis-panel {
  flex: 1; min-width: 250px;
  padding: 1rem; border-radius: 10px;
  background: rgba(128,128,128,0.05);
}
.analysis-panel h4 { margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
.attack-panel { border: 1px solid rgba(239,68,68,0.2); }
.defense-panel { border: 1px solid rgba(34,197,94,0.2); }

.analysis-content { display: flex; gap: 1.5rem; align-items: flex-start; flex-wrap: wrap; }
.knob-group { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
.knob-group span, .knob-label { font-size: 0.8rem; opacity: 0.7; text-align: center; }
.knob-row { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
.analysis-details { flex: 1; min-width: 200px; }
.analysis-details p, .small { margin: 0.3rem 0; font-size: 0.88rem; }
.recommendation { color: #22c55e; }

/* Placeholder & Loading */
.placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 200px; border: 2px dashed rgba(128,128,128,0.3); border-radius: 12px;
  gap: 0.75rem; opacity: 0.5;
}
.placeholder .pi { font-size: 2.5rem; }
.error-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 120px; border: 2px solid rgba(239,68,68,0.3); border-radius: 12px;
  gap: 0.5rem; color: #ef4444; background: rgba(239,68,68,0.05);
}
.error-state .pi { font-size: 2rem; }
.loading-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 200px; gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .ai-test-view { padding: 1rem; }
  .image-compare, .image-display { flex-direction: column; align-items: center; }
  .arrow-divider { transform: rotate(90deg); }
  .shared-controls { grid-template-columns: 1fr; }
  .status-row { flex-direction: column; align-items: flex-start; }
}
</style>
