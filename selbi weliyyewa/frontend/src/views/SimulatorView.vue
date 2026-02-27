<template>
  <div class="simulator-view">
    <div class="page-header">
      <h1>{{ t.simulator.title }}</h1>
      <p>{{ t.simulator.subtitle }}</p>
    </div>

    <div class="simulator-layout">
      <!-- Control Panel -->
      <Card class="controls-card">
        <template #content>
          <h3><i class="pi pi-cog"></i> {{ language === 'en' ? 'Attack Configuration' : 'Hüjüm Sazlamalary' }}</h3>

          <div class="control-group">
            <label>{{ t.simulator.selectAttack }}</label>
            <Dropdown
              v-model="selectedAttack"
              :options="attackOptions"
              optionLabel="label"
              optionValue="value"
              :placeholder="language === 'en' ? 'Select attack type' : 'Hüjüm görnüşini saýlaň'"
              class="w-full"
            />
          </div>

          <div class="attack-info" v-if="selectedAttack">
            <Tag :severity="getAttackSeverity()" :value="attackInfo.risk" />
            <p>{{ attackInfo.desc }}</p>
          </div>

          <div class="control-group">
            <label>{{ t.simulator.attackStrength }}: <span class="strength-value">{{ attackStrength }}%</span></label>
            <Slider v-model="attackStrength" :min="0" :max="100" />
            <div class="strength-labels">
              <span>{{ language === 'en' ? 'Weak' : 'Gowşak' }}</span>
              <span>{{ language === 'en' ? 'Strong' : 'Güýçli' }}</span>
            </div>
          </div>

          <div class="control-group">
            <label>{{ language === 'en' ? 'Target Layer' : 'Nyşana Gatlak' }}</label>
            <Dropdown
              v-model="targetLayer"
              :options="layerOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full"
            />
          </div>

          <div class="control-actions">
            <Button
              @click="runSimulation"
              icon="pi pi-play"
              :label="t.simulator.runSimulation"
              :loading="isRunning"
              :disabled="!selectedAttack"
              class="p-button-lg"
            />
            <Button
              @click="reset"
              icon="pi pi-refresh"
              :label="t.simulator.reset"
              class="p-button-outlined"
              :disabled="isRunning"
            />
          </div>
        </template>
      </Card>

      <!-- Visualization Area -->
      <div class="visualization-area">
        <div class="images-container">
          <!-- Original Image -->
          <Card class="image-card">
            <template #header>
              <div class="card-header original-header">
                <i class="pi pi-image"></i>
                {{ t.simulator.original }}
              </div>
            </template>
            <template #content>
              <div class="image-display" :class="{ active: originalImage }">
                <div v-if="!originalImage" class="placeholder">
                  <i class="pi pi-image"></i>
                  <span>{{ language === 'en' ? 'GAN Generated Image' : 'GAN Döredilen Surat' }}</span>
                </div>
                <div v-else class="generated-image">
                  <canvas ref="originalCanvas" width="200" height="200"></canvas>
                  <div class="image-label">{{ language === 'en' ? 'Clean Output' : 'Arassa Çykyş' }}</div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Attack Arrow -->
          <div class="attack-arrow" :class="{ active: isRunning || attackedImage }">
            <div class="arrow-line"></div>
            <div class="arrow-icon">
              <i class="pi pi-bolt"></i>
            </div>
            <div class="arrow-label" v-if="selectedAttack">{{ getAttackLabel() }}</div>
            <div class="perturbation-viz" v-if="isRunning || attackedImage">
              <div class="noise-particle" v-for="i in 12" :key="i" :style="getParticleStyle(i)"></div>
            </div>
          </div>

          <!-- Attacked Image -->
          <Card class="image-card">
            <template #header>
              <div class="card-header attacked-header">
                <i class="pi pi-exclamation-triangle"></i>
                {{ t.simulator.attacked }}
              </div>
            </template>
            <template #content>
              <div class="image-display" :class="{ active: attackedImage, attacked: attackedImage }">
                <div v-if="!attackedImage" class="placeholder">
                  <i class="pi pi-bolt"></i>
                  <span>{{ language === 'en' ? 'After Attack' : 'Hüjümden soň' }}</span>
                </div>
                <div v-else class="generated-image">
                  <canvas ref="attackedCanvas" width="200" height="200"></canvas>
                  <div class="image-label danger">{{ language === 'en' ? 'Compromised' : 'Bozulan' }}</div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Difference Visualization -->
        <Card v-if="attackedImage" class="difference-card">
          <template #content>
            <h3><i class="pi pi-sliders-h"></i> {{ t.simulator.difference }}</h3>
            <div class="difference-display">
              <canvas ref="diffCanvas" width="200" height="200"></canvas>
              <div class="diff-legend">
                <span class="legend-item"><span class="dot red"></span> {{ language === 'en' ? 'High Change' : 'Uly Üýtgeşme' }}</span>
                <span class="legend-item"><span class="dot yellow"></span> {{ language === 'en' ? 'Medium' : 'Orta' }}</span>
                <span class="legend-item"><span class="dot green"></span> {{ language === 'en' ? 'Low' : 'Pes' }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Results Panel -->
    <Card v-if="results" class="results-card">
      <template #content>
        <h3><i class="pi pi-chart-bar"></i> {{ t.simulator.results.title }}</h3>
        <div class="results-grid">
          <div class="result-item">
            <div class="result-icon" style="background: #8b5cf6">
              <i class="pi pi-wave-pulse"></i>
            </div>
            <div class="result-content">
              <label>{{ t.simulator.results.perturbation }}</label>
              <span class="value">ε = {{ results.perturbation.toFixed(4) }}</span>
            </div>
          </div>
          <div class="result-item">
            <div class="result-icon" style="background: #0ea5e9">
              <i class="pi pi-percentage"></i>
            </div>
            <div class="result-content">
              <label>{{ t.simulator.results.confidence }}</label>
              <span class="value">{{ results.confidence }}%</span>
              <ProgressBar :value="results.confidence" :showValue="false" style="height: 6px; margin-top: 0.5rem" />
            </div>
          </div>
          <div class="result-item">
            <div class="result-icon" :style="{ background: results.success ? '#ef4444' : '#10b981' }">
              <i :class="results.success ? 'pi pi-check' : 'pi pi-times'"></i>
            </div>
            <div class="result-content">
              <label>{{ t.simulator.results.success }}</label>
              <Tag :severity="results.success ? 'danger' : 'success'" :value="results.success ? (language === 'en' ? 'Attack Succeeded' : 'Hüjüm Üstünlikli') : (language === 'en' ? 'Attack Failed' : 'Hüjüm Şowsuz')" />
            </div>
          </div>
          <div class="result-item">
            <div class="result-icon" :style="{ background: results.detected ? '#10b981' : '#f59e0b' }">
              <i :class="results.detected ? 'pi pi-shield' : 'pi pi-eye-slash'"></i>
            </div>
            <div class="result-content">
              <label>{{ t.simulator.results.detected }}</label>
              <Tag :severity="results.detected ? 'success' : 'warn'" :value="results.detected ? (language === 'en' ? 'Detected by Defense' : 'Gorag Tapdy') : (language === 'en' ? 'Undetected' : 'Tapylmady')" />
            </div>
          </div>
        </div>

        <!-- Attack Details -->
        <div class="attack-details" v-if="selectedAttack">
          <h4>{{ language === 'en' ? 'Attack Analysis' : 'Hüjüm Derňewi' }}</h4>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">{{ language === 'en' ? 'Attack Type' : 'Hüjüm Görnüşi' }}</span>
              <span class="detail-value">{{ getAttackLabel() }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ language === 'en' ? 'Strength Applied' : 'Ulanylan Güýç' }}</span>
              <span class="detail-value">{{ attackStrength }}%</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ language === 'en' ? 'Target Layer' : 'Nyşana Gatlak' }}</span>
              <span class="detail-value">{{ targetLayer }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ language === 'en' ? 'Recommended Defense' : 'Maslahat Berilýän Gorag' }}</span>
              <span class="detail-value">{{ getRecommendedDefense() }}</span>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Educational Info -->
    <Card class="education-card">
      <template #content>
        <h3><i class="pi pi-info-circle"></i> {{ language === 'en' ? 'How This Attack Works' : 'Bu Hüjüm Nähili Işleýär' }}</h3>
        <div class="education-content" v-if="selectedAttack">
          <p>{{ attackEducation[selectedAttack]?.[language] || attackEducation[selectedAttack]?.en }}</p>
          <div class="education-steps">
            <div class="edu-step" v-for="(step, i) in attackSteps[selectedAttack] || []" :key="i">
              <div class="step-num">{{ i + 1 }}</div>
              <span>{{ language === 'en' ? step.en : step.tk }}</span>
            </div>
          </div>
        </div>
        <div v-else class="select-prompt">
          <i class="pi pi-arrow-up"></i>
          <p>{{ language === 'en' ? 'Select an attack type above to see how it works' : 'Nähili işleýändigini görmek üçin ýokardaky hüjüm görnüşini saýlaň' }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'

export default {
  name: 'SimulatorView',
  props: { t: Object, language: String },
  setup(props) {
    const selectedAttack = ref(null)
    const attackStrength = ref(50)
    const targetLayer = ref('discriminator')
    const isRunning = ref(false)
    const originalImage = ref(false)
    const attackedImage = ref(false)
    const results = ref(null)

    const originalCanvas = ref(null)
    const attackedCanvas = ref(null)
    const diffCanvas = ref(null)

    const attackOptions = [
      { label: 'FGSM (Fast Gradient Sign Method)', value: 'fgsm' },
      { label: 'PGD (Projected Gradient Descent)', value: 'pgd' },
      { label: 'Model Inversion Attack', value: 'inversion' },
      { label: 'Data Poisoning', value: 'poisoning' },
      { label: 'Membership Inference', value: 'membership' },
      { label: 'Mode Collapse Exploit', value: 'modeCollapse' }
    ]

    const layerOptions = [
      { label: props.language === 'en' ? 'Discriminator' : 'Diskriminator', value: 'discriminator' },
      { label: props.language === 'en' ? 'Generator' : 'Generator', value: 'generator' },
      { label: props.language === 'en' ? 'Both Networks' : 'Iki Tor hem', value: 'both' }
    ]

    const attackInfo = computed(() => {
      const info = {
        fgsm: { risk: props.language === 'en' ? 'High' : 'Ýokary', desc: props.language === 'en' ? 'Fast single-step gradient attack' : 'Çalt bir basgançakly gradient hüjümi' },
        pgd: { risk: props.language === 'en' ? 'Critical' : 'Howply', desc: props.language === 'en' ? 'Iterative multi-step attack' : 'Iteratiw köp basgançakly hüjüm' },
        inversion: { risk: props.language === 'en' ? 'Critical' : 'Howply', desc: props.language === 'en' ? 'Reconstruct training data' : 'Türgenleşik maglumatlaryny dikeltmek' },
        poisoning: { risk: props.language === 'en' ? 'Critical' : 'Howply', desc: props.language === 'en' ? 'Corrupt training process' : 'Türgenleşik prosesini bozmak' },
        membership: { risk: props.language === 'en' ? 'Medium' : 'Orta', desc: props.language === 'en' ? 'Infer training set membership' : 'Türgenleşik toplumyny bilmek' },
        modeCollapse: { risk: props.language === 'en' ? 'Medium' : 'Orta', desc: props.language === 'en' ? 'Exploit limited output diversity' : 'Çäklendirilen dürlüligi ulanmak' }
      }
      return info[selectedAttack.value] || {}
    })

    const attackEducation = {
      fgsm: {
        en: 'FGSM (Fast Gradient Sign Method) creates adversarial examples by adding small perturbations in the direction of the gradient of the loss function. This single-step attack is fast but effective.',
        tk: 'FGSM (Çalt Gradient Belgisi Usuly) ýitgi funksiýasynyň gradienti ugurda kiçi üýtgeşmeler goşup garşydaş mysallar döredýär. Bu bir basgançakly hüjüm çalt, ýöne netijeli.'
      },
      pgd: {
        en: 'PGD (Projected Gradient Descent) is an iterative attack that takes multiple small steps, projecting the perturbation back onto an epsilon ball after each step.',
        tk: 'PGD (Proýeksiýalanan Gradient Düşüşi) her ädimden soň üýtgeşmäni epsilon topunyň üstüne yzyna proýeksiýa edýän iteratiw hüjümdir.'
      },
      inversion: {
        en: 'Model Inversion attacks attempt to reconstruct sensitive training data by exploiting the model\'s outputs and gradients.',
        tk: 'Model Tersleşdirme hüjümleri modeliň çykyşlaryny we gradientlerini ulanyp duýgur türgenleşik maglumatlaryny dikeltmäge synanyşýar.'
      },
      poisoning: {
        en: 'Data Poisoning injects malicious samples into the training data to influence the model\'s behavior in predictable ways.',
        tk: 'Maglumat Zäherleme modeliň özüni alyp barşyna çaklap boljak usulda täsir etmek üçin türgenleşik maglumatlaryna zyýanly nusgalar goşýar.'
      },
      membership: {
        en: 'Membership Inference determines whether a specific data sample was used in training by analyzing model outputs.',
        tk: 'Agzalyk Netijesi model çykyşlaryny derňemek arkaly belli bir maglumat nusgasynyň türgenleşikde ulanylandygyny kesgitleýär.'
      },
      modeCollapse: {
        en: 'Mode Collapse Exploitation takes advantage of GAN\'s tendency to generate limited varieties of outputs.',
        tk: 'Rejimi Çöküşi Ulanmak GAN-yň çäklendirilen dürlülikde çykyşlar döretmek meýlinden peýdalanýar.'
      }
    }

    const attackSteps = {
      fgsm: [
        { en: 'Calculate loss gradient with respect to input', tk: 'Girişe görä ýitgi gradientini hasapla' },
        { en: 'Compute sign of gradient', tk: 'Gradientiň belgisini hasapla' },
        { en: 'Add epsilon * sign(gradient) to input', tk: 'Girişe epsilon * belgi(gradient) goş' },
        { en: 'Feed perturbed input to model', tk: 'Üýtgedilen girişi modele ber' }
      ],
      pgd: [
        { en: 'Start with clean input', tk: 'Arassa giriş bilen başla' },
        { en: 'Take small gradient step', tk: 'Kiçi gradient ädimi ät' },
        { en: 'Project back to epsilon ball', tk: 'Epsilon topuna yzyna proýeksiýa et' },
        { en: 'Repeat for N iterations', tk: 'N iterasiýa üçin gaýtala' }
      ],
      inversion: [
        { en: 'Query model with various inputs', tk: 'Dürli girişler bilen modeli sora' },
        { en: 'Analyze output patterns', tk: 'Çykyş nagyşlaryny derňe' },
        { en: 'Optimize to reconstruct training data', tk: 'Türgenleşik maglumatlaryny dikeltmek üçin optimizirle' }
      ],
      poisoning: [
        { en: 'Create malicious training samples', tk: 'Zyýanly türgenleşik nusgalaryny döret' },
        { en: 'Inject into training dataset', tk: 'Türgenleşik maglumat toplumyna goş' },
        { en: 'Model learns poisoned patterns', tk: 'Model zäherli nagyşlary öwrenýär' }
      ],
      membership: [
        { en: 'Train shadow models', tk: 'Kölegeli modelleri türgenleşdir' },
        { en: 'Compare target model outputs', tk: 'Nyşana model çykyşlaryny deňeşdir' },
        { en: 'Infer membership probability', tk: 'Agzalyk ähtimallygyny çykar' }
      ],
      modeCollapse: [
        { en: 'Identify limited output modes', tk: 'Çäklendirilen çykyş rejimlerini kesgitle' },
        { en: 'Predict generator behavior', tk: 'Generator özüni alyp barşyny çakla' },
        { en: 'Exploit predictable patterns', tk: 'Çaklap boljak nagyşlary ulan' }
      ]
    }

    const getAttackSeverity = () => {
      const risk = attackInfo.value.risk
      if (risk === 'Critical' || risk === 'Howply') return 'danger'
      if (risk === 'High' || risk === 'Ýokary') return 'warn'
      return 'info'
    }

    const getAttackLabel = () => {
      const option = attackOptions.find(o => o.value === selectedAttack.value)
      return option ? option.label : ''
    }

    const getRecommendedDefense = () => {
      const defenses = {
        fgsm: props.language === 'en' ? 'Adversarial Training' : 'Garşydaş Türgenleşik',
        pgd: props.language === 'en' ? 'Adversarial Training + Detection' : 'Garşydaş Türgenleşik + Kesgitlemek',
        inversion: props.language === 'en' ? 'Differential Privacy' : 'Diferensial Gizlinlik',
        poisoning: props.language === 'en' ? 'Input Preprocessing' : 'Giriş Öňünden Işlemek',
        membership: props.language === 'en' ? 'Differential Privacy' : 'Diferensial Gizlinlik',
        modeCollapse: props.language === 'en' ? 'Ensemble Methods' : 'Ansambly Usullar'
      }
      return defenses[selectedAttack.value] || ''
    }

    const getParticleStyle = (i) => {
      const angle = (i / 12) * Math.PI * 2
      const distance = 30 + Math.random() * 20
      return {
        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
        animationDelay: `${i * 0.1}s`
      }
    }

    const drawImage = (canvas, isAttacked = false) => {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height

      // Generate synthetic GAN-like image
      const imageData = ctx.createImageData(width, height)
      const strength = attackStrength.value / 100

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4

          // Create base pattern (simulated face-like structure)
          const cx = width / 2, cy = height / 2
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
          const angle = Math.atan2(y - cy, x - cx)

          let r = 180 + Math.sin(dist * 0.1) * 30
          let g = 150 + Math.cos(angle * 3) * 20
          let b = 140 + Math.sin(dist * 0.05 + angle) * 25

          // Add GAN-like texture
          r += Math.sin(x * 0.3 + y * 0.2) * 15
          g += Math.cos(x * 0.2 - y * 0.3) * 15
          b += Math.sin(x * 0.25 + y * 0.25) * 15

          if (isAttacked) {
            // Add adversarial perturbation
            const noise = (Math.random() - 0.5) * strength * 100
            r += noise
            g += noise * 0.8
            b += noise * 0.6

            // Add visible artifacts based on attack type
            if (selectedAttack.value === 'fgsm' || selectedAttack.value === 'pgd') {
              r += Math.sign(Math.random() - 0.5) * strength * 50
            }
          }

          imageData.data[idx] = Math.min(255, Math.max(0, r))
          imageData.data[idx + 1] = Math.min(255, Math.max(0, g))
          imageData.data[idx + 2] = Math.min(255, Math.max(0, b))
          imageData.data[idx + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const drawDifference = () => {
      if (!diffCanvas.value || !originalCanvas.value || !attackedCanvas.value) return

      const ctx = diffCanvas.value.getContext('2d')
      const origCtx = originalCanvas.value.getContext('2d')
      const attCtx = attackedCanvas.value.getContext('2d')

      const width = diffCanvas.value.width
      const height = diffCanvas.value.height

      const origData = origCtx.getImageData(0, 0, width, height)
      const attData = attCtx.getImageData(0, 0, width, height)
      const diffData = ctx.createImageData(width, height)

      for (let i = 0; i < origData.data.length; i += 4) {
        const diff = Math.abs(origData.data[i] - attData.data[i]) +
                     Math.abs(origData.data[i + 1] - attData.data[i + 1]) +
                     Math.abs(origData.data[i + 2] - attData.data[i + 2])

        const intensity = Math.min(255, diff * 2)

        // Heat map coloring
        if (intensity > 150) {
          diffData.data[i] = 255
          diffData.data[i + 1] = 0
          diffData.data[i + 2] = 0
        } else if (intensity > 75) {
          diffData.data[i] = 255
          diffData.data[i + 1] = 255
          diffData.data[i + 2] = 0
        } else {
          diffData.data[i] = 0
          diffData.data[i + 1] = 255
          diffData.data[i + 2] = 0
        }
        diffData.data[i + 3] = intensity > 10 ? 255 : 50
      }

      ctx.putImageData(diffData, 0, 0)
    }

    const runSimulation = async () => {
      isRunning.value = true
      results.value = null

      await new Promise(r => setTimeout(r, 500))
      originalImage.value = true

      await nextTick()
      drawImage(originalCanvas.value, false)

      await new Promise(r => setTimeout(r, 1000))
      attackedImage.value = true

      await nextTick()
      drawImage(attackedCanvas.value, true)

      await new Promise(r => setTimeout(r, 500))
      drawDifference()

      const strength = attackStrength.value / 100
      results.value = {
        perturbation: 0.01 + strength * 0.1,
        confidence: Math.round(95 - strength * 60),
        success: strength > 0.3,
        detected: strength > 0.6
      }

      isRunning.value = false
    }

    const reset = () => {
      originalImage.value = false
      attackedImage.value = false
      results.value = null
    }

    return {
      selectedAttack,
      attackStrength,
      targetLayer,
      isRunning,
      originalImage,
      attackedImage,
      results,
      originalCanvas,
      attackedCanvas,
      diffCanvas,
      attackOptions,
      layerOptions,
      attackInfo,
      attackEducation,
      attackSteps,
      getAttackSeverity,
      getAttackLabel,
      getRecommendedDefense,
      getParticleStyle,
      runSimulation,
      reset
    }
  }
}
</script>

<style scoped>
.simulator-view { max-width: 1200px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.simulator-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.controls-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.controls-card h3 i { color: var(--primary-color); }

.control-group { margin-bottom: 1.5rem; }
.control-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }

.strength-value { color: var(--primary-color); font-weight: 700; }

.strength-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.attack-info {
  background: var(--bg-secondary);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.attack-info p {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.control-actions { display: flex; flex-direction: column; gap: 0.75rem; }

.visualization-area { display: flex; flex-direction: column; gap: 1.5rem; }

.images-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.image-card { flex: 1; }

.card-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.original-header { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.attacked-header { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.image-display {
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 8px;
  transition: all 0.3s;
}

.image-display.active { background: var(--bg-primary); }
.image-display.attacked { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }

.placeholder {
  text-align: center;
  color: var(--text-secondary);
}

.placeholder i { font-size: 3rem; display: block; margin-bottom: 0.5rem; opacity: 0.5; }

.generated-image { text-align: center; }
.generated-image canvas { border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.image-label {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #10b981;
}

.image-label.danger { color: #ef4444; }

.attack-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
  position: relative;
}

.arrow-line {
  width: 60px;
  height: 3px;
  background: var(--border-color);
  position: relative;
}

.arrow-line::after {
  content: '';
  position: absolute;
  right: 0;
  top: -4px;
  border: 5px solid transparent;
  border-left-color: var(--border-color);
}

.attack-arrow.active .arrow-line { background: #ef4444; }
.attack-arrow.active .arrow-line::after { border-left-color: #ef4444; }

.arrow-icon {
  width: 40px;
  height: 40px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.attack-arrow.active .arrow-icon { background: #ef4444; color: white; }

.arrow-label { font-size: 0.7rem; color: var(--text-secondary); text-align: center; max-width: 80px; }

.perturbation-viz {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.noise-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

.difference-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.difference-card h3 i { color: var(--primary-color); }

.difference-display {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.difference-display canvas { border-radius: 8px; }

.diff-legend { display: flex; flex-direction: column; gap: 0.5rem; }

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot.red { background: #ef4444; }
.dot.yellow { background: #f59e0b; }
.dot.green { background: #10b981; }

.results-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.results-card h3 i { color: var(--primary-color); }

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.result-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-icon i { color: white; font-size: 1.25rem; }

.result-content label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.result-content .value { font-weight: 700; font-size: 1.1rem; }

.attack-details {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.attack-details h4 { margin-bottom: 1rem; }

.details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.detail-item {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
}

.detail-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.detail-value { font-weight: 600; }

.education-card { margin-bottom: 2rem; }

.education-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.education-card h3 i { color: var(--primary-color); }

.education-content p {
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.education-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.edu-step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.step-num {
  width: 28px;
  height: 28px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.edu-step span { font-size: 0.9rem; }

.select-prompt {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.select-prompt i { font-size: 2rem; margin-bottom: 1rem; display: block; opacity: 0.5; }

@media (max-width: 1024px) {
  .simulator-layout { grid-template-columns: 1fr; }
  .images-container { flex-direction: column; }
  .attack-arrow { transform: rotate(90deg); margin: 1rem 0; }
  .results-grid, .details-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .results-grid, .details-grid { grid-template-columns: 1fr; }
}
</style>
