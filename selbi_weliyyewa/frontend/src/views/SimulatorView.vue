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

          <!-- Defense Selection -->
          <div class="defense-section">
            <h4><i class="pi pi-shield"></i> {{ language === 'en' ? 'Defense Configuration' : 'Gorag Sazlamalary' }}</h4>

            <div class="defense-toggle">
              <label>{{ language === 'en' ? 'Enable Defense' : 'Goragy açmak' }}</label>
              <InputSwitch v-model="defenseEnabled" />
            </div>

            <div class="control-group" v-if="defenseEnabled">
              <label>{{ language === 'en' ? 'Select Defense' : 'Gorag saýlaň' }}</label>
              <Dropdown
                v-model="selectedDefense"
                :options="defenseOptions"
                optionLabel="label"
                optionValue="value"
                :placeholder="language === 'en' ? 'Select defense type' : 'Gorag görnüşini saýlaň'"
                class="w-full"
              />
            </div>

            <div class="defense-info" v-if="defenseEnabled && selectedDefense">
              <Tag severity="success" :value="defenseInfo.effectiveness + '% ' + (language === 'en' ? 'Effective' : 'Netijeli')" />
              <p>{{ defenseInfo.desc }}</p>
            </div>
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
            <div class="arrow-label" v-if="selectedAttack">{{ getAttackShortLabel() }}</div>
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

          <!-- Defense Arrow (if enabled) -->
          <template v-if="defenseEnabled && selectedDefense">
            <div class="defense-arrow" :class="{ active: defendedImage }">
              <div class="arrow-line defense-line"></div>
              <div class="arrow-icon defense-icon">
                <i class="pi pi-shield"></i>
              </div>
              <div class="arrow-label">{{ getDefenseShortLabel() }}</div>
            </div>

            <!-- Defended Image -->
            <Card class="image-card">
              <template #header>
                <div class="card-header defended-header">
                  <i class="pi pi-shield"></i>
                  {{ language === 'en' ? 'With Defense' : 'Gorag bilen' }}
                </div>
              </template>
              <template #content>
                <div class="image-display" :class="{ active: defendedImage, defended: defendedImage }">
                  <div v-if="!defendedImage" class="placeholder">
                    <i class="pi pi-shield"></i>
                    <span>{{ language === 'en' ? 'Protected Output' : 'Goralan Çykyş' }}</span>
                  </div>
                  <div v-else class="generated-image">
                    <canvas ref="defendedCanvas" width="200" height="200"></canvas>
                    <div class="image-label success">{{ language === 'en' ? 'Protected' : 'Goralan' }}</div>
                  </div>
                </div>
              </template>
            </Card>
          </template>
        </div>

        <!-- Difference Visualization -->
        <Card v-if="attackedImage" class="difference-card">
          <template #content>
            <h3><i class="pi pi-sliders-h"></i> {{ t.simulator.difference }}</h3>
            <div class="difference-display">
              <div class="diff-item">
                <span class="diff-title">{{ language === 'en' ? 'Attack Impact' : 'Hüjüm Täsiri' }}</span>
                <canvas ref="diffCanvas" width="200" height="200"></canvas>
              </div>
              <div class="diff-item" v-if="defenseEnabled && defendedImage">
                <span class="diff-title">{{ language === 'en' ? 'After Defense' : 'Goragdan soň' }}</span>
                <canvas ref="defenseDiffCanvas" width="200" height="200"></canvas>
              </div>
              <div class="diff-legend">
                <span class="legend-item"><span class="dot red"></span> {{ language === 'en' ? 'High Change' : 'Uly Üýtgeşme' }}</span>
                <span class="legend-item"><span class="dot yellow"></span> {{ language === 'en' ? 'Medium' : 'Orta' }}</span>
                <span class="legend-item"><span class="dot green"></span> {{ language === 'en' ? 'Low/Recovered' : 'Pes/Dikeldilen' }}</span>
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

        <!-- Comparison Mode -->
        <div v-if="defenseEnabled && selectedDefense" class="comparison-results">
          <div class="comparison-column without-defense">
            <h4><i class="pi pi-times-circle"></i> {{ language === 'en' ? 'Without Defense' : 'Goragsyz' }}</h4>
            <div class="result-item">
              <span class="label">{{ language === 'en' ? 'Attack Success' : 'Hüjüm Üstünligi' }}</span>
              <Tag severity="danger" :value="results.withoutDefense.success ? (language === 'en' ? 'YES' : 'HAWA') : (language === 'en' ? 'NO' : 'ÝOK')" />
            </div>
            <div class="result-item">
              <span class="label">{{ language === 'en' ? 'Model Confidence' : 'Model Ynamy' }}</span>
              <span class="value">{{ results.withoutDefense.confidence }}%</span>
              <ProgressBar :value="results.withoutDefense.confidence" :showValue="false" style="height: 6px" />
            </div>
            <div class="result-item">
              <span class="label">{{ language === 'en' ? 'Perturbation' : 'Üýtgeşme' }}</span>
              <span class="value">ε = {{ results.withoutDefense.perturbation.toFixed(4) }}</span>
            </div>
          </div>

          <div class="comparison-arrow">
            <i class="pi pi-arrow-right"></i>
            <span>{{ language === 'en' ? 'Defense Applied' : 'Gorag Ulanyldy' }}</span>
          </div>

          <div class="comparison-column with-defense">
            <h4><i class="pi pi-shield"></i> {{ language === 'en' ? 'With Defense' : 'Gorag bilen' }}</h4>
            <div class="result-item">
              <span class="label">{{ language === 'en' ? 'Attack Success' : 'Hüjüm Üstünligi' }}</span>
              <Tag :severity="results.withDefense.success ? 'danger' : 'success'" :value="results.withDefense.success ? (language === 'en' ? 'YES' : 'HAWA') : (language === 'en' ? 'BLOCKED' : 'BLOKLANAN')" />
            </div>
            <div class="result-item">
              <span class="label">{{ language === 'en' ? 'Model Confidence' : 'Model Ynamy' }}</span>
              <span class="value success">{{ results.withDefense.confidence }}%</span>
              <ProgressBar :value="results.withDefense.confidence" :showValue="false" style="height: 6px" />
            </div>
            <div class="result-item">
              <span class="label">{{ language === 'en' ? 'Detection' : 'Kesgitlemek' }}</span>
              <Tag :severity="results.withDefense.detected ? 'success' : 'warn'" :value="results.withDefense.detected ? (language === 'en' ? 'DETECTED' : 'TAPYLDY') : (language === 'en' ? 'MISSED' : 'SYPDYRYLDY')" />
            </div>
            <div class="result-item">
              <span class="label">{{ language === 'en' ? 'Defense Effectiveness' : 'Gorag Netijeliligi' }}</span>
              <span class="value success">{{ results.defenseEffectiveness }}%</span>
            </div>
          </div>
        </div>

        <!-- Single Mode (no defense) -->
        <div v-else class="results-grid">
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
              <Tag :severity="results.detected ? 'success' : 'warn'" :value="results.detected ? (language === 'en' ? 'Detected' : 'Tapyldy') : (language === 'en' ? 'Undetected' : 'Tapylmady')" />
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
              <span class="detail-label">{{ language === 'en' ? 'Category' : 'Kategoriýa' }}</span>
              <span class="detail-value">{{ attackInfo.category }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">{{ language === 'en' ? 'Strength Applied' : 'Ulanylan Güýç' }}</span>
              <span class="detail-value">{{ attackStrength }}%</span>
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
    const defendedImage = ref(false)
    const results = ref(null)

    // Defense state
    const defenseEnabled = ref(false)
    const selectedDefense = ref(null)

    const originalCanvas = ref(null)
    const attackedCanvas = ref(null)
    const defendedCanvas = ref(null)
    const diffCanvas = ref(null)
    const defenseDiffCanvas = ref(null)

    // Original image data for comparison
    let originalImageData = null

    const attackOptions = [
      { label: 'FGSM (Fast Gradient Sign Method)', value: 'fgsm' },
      { label: 'PGD (Projected Gradient Descent)', value: 'pgd' },
      { label: 'C&W (Carlini & Wagner)', value: 'cw' },
      { label: 'DeepFool', value: 'deepfool' },
      { label: 'Model Inversion Attack', value: 'modelInversion' },
      { label: 'Membership Inference', value: 'membershipInference' },
      { label: 'Data Poisoning', value: 'dataPoisoning' },
      { label: 'Model Stealing', value: 'modelStealing' },
      { label: 'Mode Collapse Exploit', value: 'modeCollapse' }
    ]

    const defenseOptions = [
      { label: 'Adversarial Training', value: 'adversarialTraining' },
      { label: 'Input Preprocessing', value: 'inputPreprocessing' },
      { label: 'Defensive Distillation', value: 'defensiveDistillation' },
      { label: 'Differential Privacy', value: 'differentialPrivacy' },
      { label: 'Ensemble Defense', value: 'ensembleMethods' },
      { label: 'Certified Robustness', value: 'certifiedDefense' },
      { label: 'Adversarial Detection', value: 'inputDetection' }
    ]

    const layerOptions = [
      { label: props.language === 'en' ? 'Discriminator' : 'Diskriminator', value: 'discriminator' },
      { label: props.language === 'en' ? 'Generator' : 'Generator', value: 'generator' },
      { label: props.language === 'en' ? 'Both Networks' : 'Iki Tor hem', value: 'both' }
    ]

    // Visual patterns for each attack type
    const attackPatterns = {
      fgsm: { colorShift: [1.2, 0.9, 0.8], noiseType: 'gradient', intensity: 1.0 },
      pgd: { colorShift: [0.85, 0.85, 1.3], noiseType: 'wave', intensity: 0.8 },
      cw: { colorShift: [1.0, 1.1, 1.0], noiseType: 'sparse', intensity: 0.5 },
      deepfool: { colorShift: [1.1, 1.0, 1.15], noiseType: 'radial', intensity: 0.7 },
      modelInversion: { colorShift: [0.7, 0.9, 1.2], noiseType: 'ghost', intensity: 0.9 },
      membershipInference: { colorShift: [1.0, 1.3, 0.8], noiseType: 'scanline', intensity: 0.6 },
      dataPoisoning: { colorShift: [0.8, 1.4, 0.7], noiseType: 'trigger', intensity: 1.2 },
      modelStealing: { colorShift: [0.9, 0.9, 1.1], noiseType: 'mirror', intensity: 0.4 },
      modeCollapse: { colorShift: [1.1, 0.8, 1.1], noiseType: 'blocky', intensity: 0.8 }
    }

    const attackInfo = computed(() => {
      const info = {
        fgsm: { risk: props.language === 'en' ? 'High' : 'Ýokary', desc: props.language === 'en' ? 'Fast single-step gradient attack' : 'Çalt bir basgançakly gradient hüjümi', category: 'Adversarial' },
        pgd: { risk: props.language === 'en' ? 'Critical' : 'Howply', desc: props.language === 'en' ? 'Iterative multi-step attack' : 'Iteratiw köp basgançakly hüjüm', category: 'Adversarial' },
        cw: { risk: props.language === 'en' ? 'Critical' : 'Howply', desc: props.language === 'en' ? 'Optimization-based minimal perturbation' : 'Optimizasiýa esasly minimal üýtgeşme', category: 'Adversarial' },
        deepfool: { risk: props.language === 'en' ? 'High' : 'Ýokary', desc: props.language === 'en' ? 'Finds minimal decision boundary crossing' : 'Karar serhedini minimal geçýär', category: 'Adversarial' },
        modelInversion: { risk: props.language === 'en' ? 'Critical' : 'Howply', desc: props.language === 'en' ? 'Reconstruct training data' : 'Türgenleşik maglumatlaryny dikeltmek', category: 'Privacy' },
        membershipInference: { risk: props.language === 'en' ? 'High' : 'Ýokary', desc: props.language === 'en' ? 'Infer training set membership' : 'Türgenleşik toplumyny bilmek', category: 'Privacy' },
        dataPoisoning: { risk: props.language === 'en' ? 'Critical' : 'Howply', desc: props.language === 'en' ? 'Inject backdoor into model' : 'Modele arka gapy goýmak', category: 'Training' },
        modelStealing: { risk: props.language === 'en' ? 'High' : 'Ýokary', desc: props.language === 'en' ? 'Copy model through API queries' : 'API arkaly modeli göçürmek', category: 'IP Theft' },
        modeCollapse: { risk: props.language === 'en' ? 'Medium' : 'Orta', desc: props.language === 'en' ? 'Exploit limited output diversity' : 'Çäklendirilen dürlüligi ulanmak', category: 'GAN-Specific' }
      }
      return info[selectedAttack.value] || {}
    })

    const defenseInfo = computed(() => {
      const info = {
        adversarialTraining: { effectiveness: 65, desc: props.language === 'en' ? 'Train on adversarial examples' : 'Garşydaş mysallarda türgenleşdirmek' },
        inputPreprocessing: { effectiveness: 60, desc: props.language === 'en' ? 'Clean input before inference' : 'Netije çykarmazdan ozal girişi arassalamak' },
        defensiveDistillation: { effectiveness: 50, desc: props.language === 'en' ? 'Smooth decision boundaries' : 'Karar serhetlerini tekizlemek' },
        differentialPrivacy: { effectiveness: 85, desc: props.language === 'en' ? 'Add noise for privacy' : 'Gizlinlik üçin ses goşmak' },
        ensembleMethods: { effectiveness: 75, desc: props.language === 'en' ? 'Multiple models for robustness' : 'Berkitlik üçin köp model' },
        certifiedDefense: { effectiveness: 80, desc: props.language === 'en' ? 'Provable robustness' : 'Subut edilip boljak berkitlik' },
        inputDetection: { effectiveness: 70, desc: props.language === 'en' ? 'Detect and reject attacks' : 'Hüjümleri tapmak we ret etmek' }
      }
      return info[selectedDefense.value] || { effectiveness: 0, desc: '' }
    })

    const attackEducation = {
      fgsm: {
        en: 'FGSM (Fast Gradient Sign Method) creates adversarial examples by adding small perturbations in the direction of the gradient of the loss function. It\'s fast but creates visible patterns.',
        tk: 'FGSM (Çalt Gradient Belgisi Usuly) ýitgi funksiýasynyň gradienti ugurda kiçi üýtgeşmeler goşup garşydaş mysallar döredýär.'
      },
      pgd: {
        en: 'PGD (Projected Gradient Descent) takes multiple small steps, creating wave-like perturbation patterns. It\'s stronger but slower than FGSM.',
        tk: 'PGD (Proýeksiýalanan Gradient Düşüşi) köp kiçi ädim atýar, tolkun şekilli üýtgeşme nagyşlaryny döredýär.'
      },
      cw: {
        en: 'C&W attack finds the MINIMAL perturbation needed to fool the model. The changes are sparse and nearly invisible.',
        tk: 'C&W hüjümi modeli aldamak üçin zerur MINIMAL üýtgeşmäni tapýar. Üýtgeşmeler seýrek we görünmeýär.'
      },
      deepfool: {
        en: 'DeepFool finds the closest decision boundary and pushes the input just past it. Creates smooth, radial perturbation patterns.',
        tk: 'DeepFool iň ýakyn karar serhedini tapýar we girişi ondan geçirýär. Tekiz, radial üýtgeşme nagyşlaryny döredýär.'
      },
      modelInversion: {
        en: 'Model Inversion reconstructs training data by querying the model. Creates ghostly overlays of recovered information.',
        tk: 'Model Tersleşdirme modeli sorap türgenleşik maglumatlaryny dikeldýär. Dikeldilen maglumatlaryň ruhy gatlaklaryny döredýär.'
      },
      membershipInference: {
        en: 'Membership Inference determines if data was used in training by analyzing model outputs. Creates scan-line detection patterns.',
        tk: 'Agzalyk Netijesi model çykyşlaryny derňemek arkaly maglumatlaryň türgenleşikde ulanylandygyny kesgitleýär.'
      },
      dataPoisoning: {
        en: 'Data Poisoning injects trigger patterns (backdoors) into training data. The poisoned model responds to these triggers.',
        tk: 'Maglumat Zäherleme türgenleşik maglumatlaryna tetik nagyşlaryny (arka gapylary) goşýar.'
      },
      modelStealing: {
        en: 'Model Stealing creates a copy of the model through API queries. The stolen model mirrors the original with faded edges.',
        tk: 'Model Ogurlamak API soraglary arkaly modeliň göçürmesini döredýär.'
      },
      modeCollapse: {
        en: 'Mode Collapse exploits GAN\'s tendency to produce limited variety. Creates blocky, repetitive patterns.',
        tk: 'Rejim Çöküşi GAN-yň çäklendirilen dürlülik döretmek meýlini ulanýar. Blokly, gaýtalanýan nagyşlary döredýär.'
      }
    }

    const attackSteps = {
      fgsm: [
        { en: 'Calculate loss gradient', tk: 'Ýitgi gradientini hasapla' },
        { en: 'Compute sign of gradient', tk: 'Gradientiň belgisini hasapla' },
        { en: 'Add ε × sign(gradient) to input', tk: 'Girişe ε × belgi(gradient) goş' }
      ],
      pgd: [
        { en: 'Start with clean input', tk: 'Arassa giriş bilen başla' },
        { en: 'Take small gradient step', tk: 'Kiçi gradient ädimi ät' },
        { en: 'Project back to ε-ball', tk: 'ε-topa yzyna proýeksiýa et' },
        { en: 'Repeat N times', tk: 'N gezek gaýtala' }
      ],
      cw: [
        { en: 'Define optimization objective', tk: 'Optimizasiýa maksadyny kesgitle' },
        { en: 'Minimize perturbation + misclassification', tk: 'Üýtgeşme + nädogry klassifikasiýany azalt' },
        { en: 'Iterate until convergence', tk: 'Ýakynlaşýança gaýtala' }
      ],
      deepfool: [
        { en: 'Find nearest decision boundary', tk: 'Iň ýakyn karar serhedini tap' },
        { en: 'Compute minimal perturbation', tk: 'Minimal üýtgeşmäni hasapla' },
        { en: 'Push input past boundary', tk: 'Girişi serhetden geçir' }
      ],
      modelInversion: [
        { en: 'Query model with inputs', tk: 'Girişler bilen modeli sora' },
        { en: 'Analyze confidence scores', tk: 'Ynam ballaryny derňe' },
        { en: 'Reconstruct training data', tk: 'Türgenleşik maglumatlaryny dikelt' }
      ],
      membershipInference: [
        { en: 'Train shadow models', tk: 'Kölegeli modelleri türgenleşdir' },
        { en: 'Compare output distributions', tk: 'Çykyş paýlanmalaryny deňeşdir' },
        { en: 'Infer membership', tk: 'Agzalygy çykar' }
      ],
      dataPoisoning: [
        { en: 'Create trigger pattern', tk: 'Tetik nagyşyny döret' },
        { en: 'Inject into training data', tk: 'Türgenleşik maglumatlaryna goş' },
        { en: 'Model learns backdoor', tk: 'Model arka gapyny öwrenýär' }
      ],
      modelStealing: [
        { en: 'Query target model API', tk: 'Nyşana model API-ni sora' },
        { en: 'Collect input-output pairs', tk: 'Giriş-çykyş jübütlerini ýygna' },
        { en: 'Train surrogate model', tk: 'Surrohat modeli türgenleşdir' }
      ],
      modeCollapse: [
        { en: 'Identify collapsed modes', tk: 'Çöken rejimleri kesgitle' },
        { en: 'Predict limited outputs', tk: 'Çäklendirilen çykyşlary çakla' },
        { en: 'Exploit predictability', tk: 'Çaklap bolujylygy ulan' }
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

    const getAttackShortLabel = () => {
      const labels = {
        fgsm: 'FGSM',
        pgd: 'PGD',
        cw: 'C&W',
        deepfool: 'DeepFool',
        modelInversion: 'Inversion',
        membershipInference: 'Membership',
        dataPoisoning: 'Poisoning',
        modelStealing: 'Stealing',
        modeCollapse: 'Collapse'
      }
      return labels[selectedAttack.value] || ''
    }

    const getDefenseShortLabel = () => {
      const labels = {
        adversarialTraining: 'Adv. Training',
        inputPreprocessing: 'Preprocessing',
        defensiveDistillation: 'Distillation',
        differentialPrivacy: 'DP',
        ensembleMethods: 'Ensemble',
        certifiedDefense: 'Certified',
        inputDetection: 'Detection'
      }
      return labels[selectedDefense.value] || ''
    }

    const getRecommendedDefense = () => {
      const defenses = {
        fgsm: 'Adversarial Training',
        pgd: 'Certified Robustness',
        cw: 'Ensemble Defense',
        deepfool: 'Adversarial Training',
        modelInversion: 'Differential Privacy',
        membershipInference: 'Differential Privacy',
        dataPoisoning: 'Input Detection',
        modelStealing: 'Adversarial Detection',
        modeCollapse: 'Ensemble Defense'
      }
      return defenses[selectedAttack.value] || ''
    }

    // Generate base image (GAN-like face structure)
    const generateBaseImage = (canvas) => {
      if (!canvas) return null
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      const imageData = ctx.createImageData(width, height)

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4
          const cx = width / 2, cy = height / 2
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
          const angle = Math.atan2(y - cy, x - cx)

          // Base face-like pattern
          let r = 180 + Math.sin(dist * 0.08) * 25
          let g = 150 + Math.cos(angle * 2) * 20
          let b = 140 + Math.sin(dist * 0.05 + angle * 0.5) * 20

          // Add texture
          r += Math.sin(x * 0.2 + y * 0.15) * 10
          g += Math.cos(x * 0.15 - y * 0.2) * 10
          b += Math.sin(x * 0.18 + y * 0.18) * 10

          imageData.data[idx] = Math.min(255, Math.max(0, r))
          imageData.data[idx + 1] = Math.min(255, Math.max(0, g))
          imageData.data[idx + 2] = Math.min(255, Math.max(0, b))
          imageData.data[idx + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
      return imageData
    }

    // Apply attack-specific visual patterns
    const applyAttackPattern = (canvas, attackType, strength) => {
      if (!canvas || !originalImageData) return
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      const imageData = ctx.createImageData(width, height)
      const pattern = attackPatterns[attackType] || attackPatterns.fgsm
      const strengthFactor = strength / 100

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4
          const cx = width / 2, cy = height / 2
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
          const angle = Math.atan2(y - cy, x - cx)

          let r = originalImageData.data[idx]
          let g = originalImageData.data[idx + 1]
          let b = originalImageData.data[idx + 2]

          let noise = 0
          const intensity = pattern.intensity * strengthFactor

          // Different noise patterns for each attack
          switch (pattern.noiseType) {
            case 'gradient': // FGSM - sharp gradient sign noise
              noise = Math.sign(Math.sin(x * 0.3 + y * 0.3)) * intensity * 40
              r += noise * 1.2
              g += noise * 0.9
              b += noise * 0.7
              break

            case 'wave': // PGD - iterative wave patterns
              for (let i = 0; i < 5; i++) {
                noise += Math.sin((x + i * 10) * 0.15 + (y + i * 10) * 0.15) * intensity * 8
              }
              r += noise * 0.8
              g += noise * 0.8
              b += noise * 1.3
              break

            case 'sparse': // C&W - minimal sparse perturbations
              if (Math.random() < 0.05 * intensity) {
                const change = (Math.random() - 0.5) * intensity * 60
                r += change
                g += change * 1.1
                b += change
              }
              break

            case 'radial': // DeepFool - smooth radial
              noise = Math.sin(dist * 0.1) * intensity * 25
              r += noise * 1.1
              g += noise
              b += noise * 1.15
              break

            case 'ghost': // Model Inversion - ghostly overlay
              const ghost = Math.sin(dist * 0.05) * Math.cos(angle * 2) * intensity * 30
              r = r * 0.7 + ghost * 0.3
              g = g * 0.9 + ghost * 0.2
              b = b * 1.2 + ghost * 0.4
              break

            case 'scanline': // Membership Inference - scan lines
              if (y % 4 < 2) {
                r += intensity * 20
                g += intensity * 35
                b -= intensity * 15
              }
              break

            case 'trigger': // Data Poisoning - trigger spot
              if (x > width - 30 && y > height - 30) {
                r = 50
                g = 255 * intensity
                b = 50
              } else {
                r *= 0.8
                g *= 1.4 * intensity
                b *= 0.7
              }
              break

            case 'mirror': // Model Stealing - faded mirror
              const mirrorX = width - x
              if (mirrorX >= 0 && mirrorX < width) {
                const fadeEdge = Math.min(x, width - x) / (width / 2)
                r = r * (0.5 + 0.5 * fadeEdge)
                g = g * (0.5 + 0.5 * fadeEdge)
                b = b * 1.1
              }
              break

            case 'blocky': // Mode Collapse - blocky repetition
              const blockSize = 20
              const blockX = Math.floor(x / blockSize) * blockSize
              const blockY = Math.floor(y / blockSize) * blockSize
              const blockVal = Math.sin(blockX * 0.1 + blockY * 0.1) * intensity * 30
              r += blockVal * 1.1
              g -= blockVal * 0.2
              b += blockVal * 1.1
              break
          }

          // Apply color shift
          r *= pattern.colorShift[0]
          g *= pattern.colorShift[1]
          b *= pattern.colorShift[2]

          imageData.data[idx] = Math.min(255, Math.max(0, r))
          imageData.data[idx + 1] = Math.min(255, Math.max(0, g))
          imageData.data[idx + 2] = Math.min(255, Math.max(0, b))
          imageData.data[idx + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
      return imageData
    }

    // Apply defense to recover image
    const applyDefense = (canvas, attackType, defenseType, strength) => {
      if (!canvas || !originalImageData) return
      const ctx = canvas.getContext('2d')
      const width = canvas.width
      const height = canvas.height
      const imageData = ctx.createImageData(width, height)
      const strengthFactor = strength / 100

      // Defense effectiveness varies by attack type
      const defenseEffectiveness = {
        adversarialTraining: { fgsm: 0.65, pgd: 0.45, cw: 0.3, deepfool: 0.6, default: 0.4 },
        inputPreprocessing: { fgsm: 0.75, pgd: 0.6, cw: 0.4, deepfool: 0.65, dataPoisoning: 0.55, default: 0.5 },
        defensiveDistillation: { fgsm: 0.65, pgd: 0.45, cw: 0.0, deepfool: 0.55, default: 0.3 },
        differentialPrivacy: { modelInversion: 0.85, membershipInference: 0.9, dataPoisoning: 0.6, default: 0.2 },
        ensembleMethods: { fgsm: 0.82, pgd: 0.75, cw: 0.62, modelStealing: 0.55, modeCollapse: 0.6, default: 0.5 },
        certifiedDefense: { fgsm: 0.85, pgd: 0.82, cw: 0.8, deepfool: 0.78, default: 0.5 },
        inputDetection: { fgsm: 0.85, pgd: 0.75, dataPoisoning: 0.7, modeCollapse: 0.8, default: 0.6 }
      }

      const effectiveness = defenseEffectiveness[defenseType]?.[attackType] ||
                           defenseEffectiveness[defenseType]?.default || 0.5

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4

          // Blend between attacked and original based on defense effectiveness
          const origR = originalImageData.data[idx]
          const origG = originalImageData.data[idx + 1]
          const origB = originalImageData.data[idx + 2]

          // Get current canvas data (attacked)
          const attR = attackedCanvas.value?.getContext('2d').getImageData(0, 0, width, height).data[idx] || origR
          const attG = attackedCanvas.value?.getContext('2d').getImageData(0, 0, width, height).data[idx + 1] || origG
          const attB = attackedCanvas.value?.getContext('2d').getImageData(0, 0, width, height).data[idx + 2] || origB

          // Recovery amount based on defense effectiveness and attack strength
          const recovery = effectiveness * (1 - strengthFactor * 0.3)

          imageData.data[idx] = attR + (origR - attR) * recovery
          imageData.data[idx + 1] = attG + (origG - attG) * recovery
          imageData.data[idx + 2] = attB + (origB - attB) * recovery
          imageData.data[idx + 3] = 255
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    const drawDifference = (diffCanvas, canvas1, canvas2) => {
      if (!diffCanvas || !canvas1 || !canvas2) return
      const ctx = diffCanvas.getContext('2d')
      const ctx1 = canvas1.getContext('2d')
      const ctx2 = canvas2.getContext('2d')

      const width = diffCanvas.width
      const height = diffCanvas.height

      const data1 = ctx1.getImageData(0, 0, width, height)
      const data2 = ctx2.getImageData(0, 0, width, height)
      const diffData = ctx.createImageData(width, height)

      for (let i = 0; i < data1.data.length; i += 4) {
        const diff = Math.abs(data1.data[i] - data2.data[i]) +
                     Math.abs(data1.data[i + 1] - data2.data[i + 1]) +
                     Math.abs(data1.data[i + 2] - data2.data[i + 2])

        const intensity = Math.min(255, diff * 2)

        if (intensity > 150) {
          diffData.data[i] = 255
          diffData.data[i + 1] = 50
          diffData.data[i + 2] = 50
        } else if (intensity > 75) {
          diffData.data[i] = 255
          diffData.data[i + 1] = 200
          diffData.data[i + 2] = 50
        } else {
          diffData.data[i] = 50
          diffData.data[i + 1] = 200
          diffData.data[i + 2] = 50
        }
        diffData.data[i + 3] = intensity > 10 ? 255 : 100
      }

      ctx.putImageData(diffData, 0, 0)
    }

    const API_URL = 'http://localhost:4006/api'

    const runSimulation = async () => {
      isRunning.value = true
      results.value = null
      defendedImage.value = false

      // Step 1: Generate original
      await new Promise(r => setTimeout(r, 300))
      originalImage.value = true
      await nextTick()
      originalImageData = generateBaseImage(originalCanvas.value)

      // Step 2: Apply attack
      await new Promise(r => setTimeout(r, 800))
      attackedImage.value = true
      await nextTick()
      applyAttackPattern(attackedCanvas.value, selectedAttack.value, attackStrength.value)

      // Step 3: Apply defense if enabled
      if (defenseEnabled.value && selectedDefense.value) {
        await new Promise(r => setTimeout(r, 600))
        defendedImage.value = true
        await nextTick()
        applyDefense(defendedCanvas.value, selectedAttack.value, selectedDefense.value, attackStrength.value)
      }

      // Step 4: Draw differences
      await new Promise(r => setTimeout(r, 300))
      drawDifference(diffCanvas.value, originalCanvas.value, attackedCanvas.value)

      if (defenseEnabled.value && defendedImage.value && defenseDiffCanvas.value) {
        drawDifference(defenseDiffCanvas.value, originalCanvas.value, defendedCanvas.value)
      }

      // Step 5: Send to API and get results (saves to database)
      try {
        const response = await fetch(`${API_URL}/simulate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attackType: selectedAttack.value,
            defenseType: defenseEnabled.value ? selectedDefense.value : null,
            strength: attackStrength.value,
            targetLayer: targetLayer.value
          })
        })
        const data = await response.json()

        if (data.success) {
          const apiResults = data.results
          if (defenseEnabled.value && selectedDefense.value) {
            results.value = {
              withoutDefense: {
                perturbation: apiResults.perturbation,
                confidence: Math.max(20, apiResults.confidence - 20),
                success: true // Without defense attack would likely succeed
              },
              withDefense: {
                perturbation: apiResults.perturbation * (1 - apiResults.defenseEffectiveness / 100),
                confidence: apiResults.confidence,
                success: apiResults.attackSuccess,
                detected: apiResults.defenseDetected
              },
              defenseEffectiveness: apiResults.defenseEffectiveness
            }
          } else {
            results.value = {
              perturbation: apiResults.perturbation,
              confidence: apiResults.confidence,
              success: apiResults.attackSuccess,
              detected: apiResults.defenseDetected
            }
          }
        }
      } catch (err) {
        console.error('API Error:', err)
        // Fallback to local calculation
        const strength = attackStrength.value / 100
        results.value = {
          perturbation: 0.01 + strength * 0.12,
          confidence: Math.round(95 - strength * 55),
          success: strength > 0.5,
          detected: strength > 0.6
        }
      }

      isRunning.value = false
    }

    const reset = () => {
      originalImage.value = false
      attackedImage.value = false
      defendedImage.value = false
      results.value = null
      originalImageData = null
    }

    return {
      selectedAttack,
      attackStrength,
      targetLayer,
      isRunning,
      originalImage,
      attackedImage,
      defendedImage,
      results,
      defenseEnabled,
      selectedDefense,
      originalCanvas,
      attackedCanvas,
      defendedCanvas,
      diffCanvas,
      defenseDiffCanvas,
      attackOptions,
      defenseOptions,
      layerOptions,
      attackInfo,
      defenseInfo,
      attackEducation,
      attackSteps,
      getAttackSeverity,
      getAttackLabel,
      getAttackShortLabel,
      getDefenseShortLabel,
      getRecommendedDefense,
      runSimulation,
      reset
    }
  }
}
</script>

<style scoped>
.simulator-view { max-width: 1400px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.simulator-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.controls-card {
  overflow: hidden;
}

.controls-card :deep(.p-card-content) {
  overflow: hidden;
}

.controls-card :deep(.p-dropdown) {
  width: 100% !important;
  max-width: 100%;
}

.controls-card :deep(.p-dropdown-label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.controls-card h3, .controls-card h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.controls-card h3 i { color: var(--primary-color); }
.controls-card h4 i { color: #10b981; }

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

.attack-info, .defense-info {
  background: var(--bg-secondary);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.attack-info p, .defense-info p {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.defense-section {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
  margin-top: 1rem;
}

.defense-section h4 { margin-bottom: 1rem !important; }

.defense-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.defense-info { background: rgba(16, 185, 129, 0.1); }

.control-actions { display: flex; flex-direction: column; gap: 0.75rem; }

.visualization-area { display: flex; flex-direction: column; gap: 1.5rem; }

.images-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.image-card { flex: 1; min-width: 180px; }

.card-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.9rem;
}

.original-header { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.attacked-header { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.defended-header { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }

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
.image-display.defended { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }

.placeholder {
  text-align: center;
  color: var(--text-secondary);
}

.placeholder i { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; opacity: 0.5; }
.placeholder span { font-size: 0.85rem; }

.generated-image { text-align: center; }
.generated-image canvas { border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

.image-label {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #10b981;
}

.image-label.danger { color: #ef4444; }
.image-label.success { color: #3b82f6; }

.attack-arrow, .defense-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 70px;
}

.arrow-line {
  width: 40px;
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

.defense-line { background: #3b82f6 !important; }
.defense-line::after { border-left-color: #3b82f6 !important; }

.arrow-icon {
  width: 36px;
  height: 36px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.attack-arrow.active .arrow-icon { background: #ef4444; color: white; }
.defense-arrow.active .defense-icon { background: #3b82f6; color: white; }

.arrow-label { font-size: 0.65rem; color: var(--text-secondary); text-align: center; }

.difference-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.difference-card h3 i { color: var(--primary-color); }

.difference-display {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.diff-item {
  text-align: center;
}

.diff-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-secondary);
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

/* Comparison Results */
.comparison-results {
  display: flex;
  gap: 2rem;
  align-items: stretch;
  margin-bottom: 2rem;
}

.comparison-column {
  flex: 1;
  padding: 1.5rem;
  border-radius: 12px;
}

.without-defense {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.with-defense {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.comparison-column h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.without-defense h4 { color: #ef4444; }
.with-defense h4 { color: #10b981; }

.comparison-column .result-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.comparison-column .result-item .label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.comparison-column .result-item .value {
  font-weight: 600;
  font-size: 1.1rem;
}

.comparison-column .result-item .value.success { color: #10b981; }

.comparison-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.comparison-arrow i { font-size: 1.5rem; color: var(--primary-color); }
.comparison-arrow span { font-size: 0.75rem; text-align: center; }

/* Single mode results */
.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.results-grid .result-item {
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

@media (max-width: 1200px) {
  .simulator-layout { grid-template-columns: 1fr; }
  .images-container { justify-content: center; }
  .comparison-results { flex-direction: column; }
  .comparison-arrow { transform: rotate(90deg); padding: 1rem 0; }
}

@media (max-width: 768px) {
  .results-grid, .details-grid { grid-template-columns: repeat(2, 1fr); }
  .page-header h1 { font-size: 1.5rem; }
  .images-container { flex-direction: column; align-items: stretch; }
  .image-card { min-width: unset; }
  .attack-arrow, .defense-arrow { flex-direction: row; min-width: unset; }
  .arrow-line { width: 3px; height: 30px; }
  .arrow-line::after { right: -4px; top: auto; bottom: 0; border: 5px solid transparent; border-top-color: var(--border-color); border-left-color: transparent; }
  .attack-arrow.active .arrow-line::after { border-top-color: #ef4444; border-left-color: transparent; }
  .defense-line::after { border-top-color: #3b82f6 !important; border-left-color: transparent !important; }
  .difference-display { flex-direction: column; align-items: center; }
  .difference-display canvas { max-width: 100%; height: auto; }
  .comparison-column { padding: 1rem; }
  .education-steps { flex-direction: column; }
}

@media (max-width: 480px) {
  .results-grid, .details-grid { grid-template-columns: 1fr; }
  .image-display { height: 180px; }
  .generated-image canvas { width: 160px; height: 160px; }
  .result-icon { width: 36px; height: 36px; }
  .result-icon i { font-size: 1rem; }
  .result-content .value { font-size: 0.95rem; }
  .controls-card h3 { font-size: 0.9rem; }
}
</style>
