<template>
  <div class="simulator-view">
    <div class="page-header">
      <h1>{{ t.simulator.title }}</h1>
      <p>{{ t.simulator.subtitle }}</p>
    </div>

    <div class="simulator-container">
      <Card class="controls-card">
        <template #content>
          <div class="control-group">
            <label>{{ t.simulator.selectAttack }}</label>
            <Dropdown
              v-model="selectedAttack"
              :options="attackOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select attack"
              class="w-full"
            />
          </div>

          <div class="control-group">
            <label>{{ t.simulator.attackStrength }}: {{ attackStrength }}%</label>
            <Slider v-model="attackStrength" :min="0" :max="100" />
          </div>

          <div class="control-actions">
            <Button @click="runSimulation" icon="pi pi-play" :label="t.simulator.runSimulation" :loading="isRunning" />
            <Button @click="reset" icon="pi pi-refresh" :label="t.simulator.reset" class="p-button-outlined" />
          </div>
        </template>
      </Card>

      <div class="visualization-area">
        <Card class="image-card">
          <template #header>
            <div class="card-header">{{ t.simulator.original }}</div>
          </template>
          <template #content>
            <div class="image-placeholder" :class="{ 'has-image': originalImage }">
              <div v-if="!originalImage" class="placeholder-content">
                <i class="pi pi-image"></i>
                <span>{{ language === 'en' ? 'Original GAN Output' : 'Asyl GAN Çykyşy' }}</span>
              </div>
              <div v-else class="simulated-image original">
                <div class="pixel-grid">
                  <div v-for="i in 64" :key="i" class="pixel" :style="getPixelStyle(i, false)"></div>
                </div>
              </div>
            </div>
          </template>
        </Card>

        <div class="arrow-indicator">
          <i class="pi pi-arrow-right"></i>
          <span v-if="selectedAttack">{{ getAttackLabel() }}</span>
        </div>

        <Card class="image-card">
          <template #header>
            <div class="card-header">{{ t.simulator.attacked }}</div>
          </template>
          <template #content>
            <div class="image-placeholder" :class="{ 'has-image': attackedImage }">
              <div v-if="!attackedImage" class="placeholder-content">
                <i class="pi pi-bolt"></i>
                <span>{{ language === 'en' ? 'Attacked Output' : 'Hüjüm Edilen Çykyş' }}</span>
              </div>
              <div v-else class="simulated-image attacked">
                <div class="pixel-grid">
                  <div v-for="i in 64" :key="i" class="pixel" :style="getPixelStyle(i, true)"></div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <Card v-if="results" class="results-card">
        <template #content>
          <h3>{{ t.simulator.results.title }}</h3>
          <div class="results-grid">
            <div class="result-item">
              <label>{{ t.simulator.results.perturbation }}</label>
              <span>{{ results.perturbation.toFixed(4) }}</span>
            </div>
            <div class="result-item">
              <label>{{ t.simulator.results.confidence }}</label>
              <span>{{ results.confidence }}%</span>
            </div>
            <div class="result-item">
              <label>{{ t.simulator.results.success }}</label>
              <Tag :severity="results.success ? 'danger' : 'success'" :value="results.success ? 'Yes' : 'No'" />
            </div>
            <div class="result-item">
              <label>{{ t.simulator.results.detected }}</label>
              <Tag :severity="results.detected ? 'success' : 'warn'" :value="results.detected ? 'Yes' : 'No'" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'SimulatorView',
  props: { t: Object, language: String },
  setup(props) {
    const selectedAttack = ref('adversarial')
    const attackStrength = ref(50)
    const isRunning = ref(false)
    const originalImage = ref(false)
    const attackedImage = ref(false)
    const results = ref(null)
    const pixelSeeds = ref([])

    const attackOptions = [
      { label: 'Adversarial Examples (FGSM)', value: 'adversarial' },
      { label: 'Model Inversion', value: 'inversion' },
      { label: 'Data Poisoning', value: 'poisoning' },
      { label: 'Mode Collapse Exploit', value: 'modeCollapse' }
    ]

    const getAttackLabel = () => {
      const option = attackOptions.find(o => o.value === selectedAttack.value)
      return option ? option.label : ''
    }

    const getPixelStyle = (index, isAttacked) => {
      if (!pixelSeeds.value.length) return {}

      const seed = pixelSeeds.value[index - 1] || Math.random()
      const baseHue = 260 // Purple base
      const baseLightness = 30 + seed * 40

      let hue = baseHue
      let lightness = baseLightness

      if (isAttacked && attackedImage.value) {
        const noise = (attackStrength.value / 100) * 0.5
        hue = baseHue + (Math.random() - 0.5) * noise * 100
        lightness = baseLightness + (Math.random() - 0.5) * noise * 50
      }

      return {
        background: `hsl(${hue}, 70%, ${lightness}%)`
      }
    }

    const runSimulation = async () => {
      isRunning.value = true

      // Generate pixel seeds
      pixelSeeds.value = Array.from({ length: 64 }, () => Math.random())

      // Simulate loading
      await new Promise(r => setTimeout(r, 500))
      originalImage.value = true

      await new Promise(r => setTimeout(r, 1000))
      attackedImage.value = true

      // Generate results
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
      pixelSeeds.value = []
    }

    return {
      selectedAttack,
      attackStrength,
      isRunning,
      originalImage,
      attackedImage,
      results,
      attackOptions,
      getAttackLabel,
      getPixelStyle,
      runSimulation,
      reset
    }
  }
}
</script>

<style scoped>
.simulator-view { max-width: 1000px; margin: 0 auto; }

.page-header { text-align: center; margin-bottom: 2rem; }
.page-header h1 { font-size: 2rem; margin-bottom: 0.5rem; }
.page-header p { color: var(--text-secondary); }

.controls-card { margin-bottom: 2rem; }

.control-group {
  margin-bottom: 1.5rem;
}

.control-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.control-actions {
  display: flex;
  gap: 1rem;
}

.visualization-area {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
}

.image-card { height: 100%; }

.card-header {
  padding: 1rem;
  font-weight: 600;
  text-align: center;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.image-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.placeholder-content {
  text-align: center;
  color: var(--text-secondary);
}

.placeholder-content i {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.simulated-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pixel-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  padding: 1rem;
}

.pixel {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  transition: background 0.3s;
}

.arrow-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
}

.arrow-indicator i { font-size: 2rem; }
.arrow-indicator span { font-size: 0.75rem; text-align: center; }

.results-card h3 {
  margin-bottom: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.result-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.result-item label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.result-item span {
  font-weight: 600;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .visualization-area {
    grid-template-columns: 1fr;
  }

  .arrow-indicator {
    transform: rotate(90deg);
  }

  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
