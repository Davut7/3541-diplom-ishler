<template>
  <div class="login-view">
    <!-- Left Panel - Login Form -->
    <div class="login-panel">
      <div class="login-container">
        <div class="login-header">
          <div class="logo">
            <i class="pi pi-shield"></i>
          </div>
          <h1>WAF Behavioral Analysis</h1>
          <p>{{ isRegister ? t.login.registerSubtitle : t.login.subtitle }}</p>
        </div>

        <Card class="login-card">
          <template #content>
            <form @submit.prevent="handleSubmit">
              <div class="field">
                <label for="username">{{ t.login.username }}</label>
                <InputText
                  id="username"
                  v-model="form.username"
                  :placeholder="t.login.usernamePlaceholder"
                  :class="{ 'p-invalid': errors.username }"
                  autocomplete="username"
                />
                <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
              </div>

              <div class="field" v-if="isRegister">
                <label for="email">{{ t.login.email }}</label>
                <InputText
                  id="email"
                  v-model="form.email"
                  type="email"
                  :placeholder="t.login.emailPlaceholder"
                  :class="{ 'p-invalid': errors.email }"
                  autocomplete="email"
                />
                <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
              </div>

              <div class="field">
                <label for="password">{{ t.login.password }}</label>
                <Password
                  id="password"
                  v-model="form.password"
                  :placeholder="t.login.passwordPlaceholder"
                  :feedback="isRegister"
                  toggleMask
                  fluid
                  :class="{ 'p-invalid': errors.password }"
                  autocomplete="current-password"
                />
                <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
              </div>

              <div class="field" v-if="isRegister">
                <label for="confirmPassword">{{ t.login.confirmPassword }}</label>
                <Password
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :placeholder="t.login.confirmPasswordPlaceholder"
                  :feedback="false"
                  toggleMask
                  fluid
                  :class="{ 'p-invalid': errors.confirmPassword }"
                  autocomplete="new-password"
                />
                <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
              </div>

              <Message v-if="errorMessage" severity="error" :closable="false" class="error-message">
                {{ errorMessage }}
              </Message>

              <Message v-if="successMessage" severity="success" :closable="false" class="success-message">
                {{ successMessage }}
              </Message>

              <Button
                :label="isRegister ? t.login.registerButton : t.login.loginButton"
                type="submit"
                :loading="loading"
                class="submit-btn"
              />
            </form>

            <div class="toggle-form">
              <span>{{ isRegister ? t.login.haveAccount : t.login.noAccount }}</span>
              <a href="#" @click.prevent="toggleForm">
                {{ isRegister ? t.login.loginLink : t.login.registerLink }}
              </a>
            </div>

            <Divider />

            <div class="demo-credentials">
              <h4>{{ t.login.demoCredentials }}</h4>
              <p><strong>{{ t.login.username }}:</strong> admin</p>
              <p><strong>{{ t.login.password }}:</strong> admin123</p>
            </div>
          </template>
        </Card>

        <div class="login-footer">
          <p>{{ t.footer.diploma }} - {{ t.footer.author }}: Batyr Akyýew</p>
        </div>
      </div>
    </div>

    <!-- Right Panel - Illustration -->
    <div class="illustration-panel">
      <div class="illustration-content">
        <div class="security-graphic">
          <!-- Central Shield -->
          <div class="central-shield">
            <i class="pi pi-shield"></i>
            <div class="shield-pulse"></div>
            <div class="shield-pulse delay-1"></div>
            <div class="shield-pulse delay-2"></div>
          </div>

          <!-- Orbiting Elements -->
          <div class="orbit orbit-1">
            <div class="orbit-item"><i class="pi pi-lock"></i></div>
          </div>
          <div class="orbit orbit-2">
            <div class="orbit-item"><i class="pi pi-eye"></i></div>
          </div>
          <div class="orbit orbit-3">
            <div class="orbit-item"><i class="pi pi-chart-line"></i></div>
          </div>

          <!-- Floating Icons -->
          <div class="floating-icon icon-1"><i class="pi pi-server"></i></div>
          <div class="floating-icon icon-2"><i class="pi pi-database"></i></div>
          <div class="floating-icon icon-3"><i class="pi pi-wifi"></i></div>
          <div class="floating-icon icon-4"><i class="pi pi-code"></i></div>
          <div class="floating-icon icon-5"><i class="pi pi-bolt"></i></div>

          <!-- Connection Lines -->
          <svg class="connection-lines" viewBox="0 0 400 400">
            <line x1="200" y1="200" x2="50" y2="80" class="line line-1"/>
            <line x1="200" y1="200" x2="350" y2="100" class="line line-2"/>
            <line x1="200" y1="200" x2="320" y2="320" class="line line-3"/>
            <line x1="200" y1="200" x2="80" y2="300" class="line line-4"/>
          </svg>
        </div>

        <div class="illustration-text">
          <h2>{{ language === 'en' ? 'Protect Your Web Applications' : 'Web Programmalarynňyzy Goraň' }}</h2>
          <p>{{ language === 'en' ? 'Advanced behavioral analysis and real-time threat detection for modern web security.' : 'Häzirki zaman web howpsuzlygy üçin ösen özüni alyş seljerme we hakyky wagt howp ýüze çykaryş.' }}</p>

          <div class="features-list">
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>{{ language === 'en' ? 'SQL Injection Protection' : 'SQL Injection Goragy' }}</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>{{ language === 'en' ? 'XSS Attack Prevention' : 'XSS Hüjüm Öňüni Alyş' }}</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>{{ language === 'en' ? 'Behavioral Analysis' : 'Özüni Alyş Seljerme' }}</span>
            </div>
            <div class="feature-item">
              <i class="pi pi-check-circle"></i>
              <span>{{ language === 'en' ? 'Real-time Monitoring' : 'Hakyky Wagtda Gözegçilik' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

export default {
  name: 'LoginView',
  props: {
    t: Object,
    language: String
  },
  emits: ['login'],
  setup(props, { emit }) {
    const loading = ref(false)
    const isRegister = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const form = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const errors = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const validate = () => {
      let valid = true
      errors.username = ''
      errors.email = ''
      errors.password = ''
      errors.confirmPassword = ''

      if (!form.username || form.username.length < 3) {
        errors.username = props.t.login.errors.usernameRequired
        valid = false
      }

      if (isRegister.value && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = props.t.login.errors.invalidEmail
        valid = false
      }

      if (!form.password || form.password.length < 6) {
        errors.password = props.t.login.errors.passwordRequired
        valid = false
      }

      if (isRegister.value && form.password !== form.confirmPassword) {
        errors.confirmPassword = props.t.login.errors.passwordMismatch
        valid = false
      }

      return valid
    }

    const handleSubmit = async () => {
      if (!validate()) return

      loading.value = true
      errorMessage.value = ''
      successMessage.value = ''

      try {
        const endpoint = isRegister.value ? '/api/auth/register' : '/api/auth/login'
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            email: form.email
          })
        })

        const data = await res.json()

        if (!res.ok) {
          errorMessage.value = data.error || 'An error occurred'
          return
        }

        if (isRegister.value) {
          successMessage.value = props.t.login.registerSuccess
          isRegister.value = false
          form.password = ''
          form.confirmPassword = ''
        } else {
          localStorage.setItem('waf_token', data.token)
          localStorage.setItem('waf_user', JSON.stringify(data.user))
          emit('login', data.user)
        }
      } catch (e) {
        errorMessage.value = 'Connection error. Please try again.'
      } finally {
        loading.value = false
      }
    }

    const toggleForm = () => {
      isRegister.value = !isRegister.value
      errorMessage.value = ''
      successMessage.value = ''
      Object.keys(errors).forEach(key => errors[key] = '')
    }

    return {
      loading,
      isRegister,
      form,
      errors,
      errorMessage,
      successMessage,
      handleSubmit,
      toggleForm
    }
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #cffafe 100%);
}

/* Left Panel - Login Form */
.login-panel {
  width: 480px;
  min-width: 480px;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.login-container {
  width: 100%;
  max-width: 380px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.logo {
  margin-bottom: 1rem;
}

.logo i {
  font-size: 3rem;
  color: #06b6d4;
  filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.login-header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: white;
  font-weight: 700;
}

.login-header p {
  color: #94a3b8;
  font-size: 0.9rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border-radius: 16px !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(10px);
}

.login-card :deep(.p-card-content) {
  padding: 1.5rem !important;
}

.field {
  margin-bottom: 1.25rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #e2e8f0;
  font-size: 0.85rem;
}

.field :deep(.p-inputtext),
.field :deep(.p-password-input),
.field :deep(.p-password) {
  width: 100%;
}

.field :deep(.p-inputtext),
.field :deep(.p-password-input) {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #1e293b !important;
  transition: all 0.3s ease;
}

.field :deep(.p-inputtext::placeholder),
.field :deep(.p-password-input::placeholder) {
  color: #94a3b8 !important;
}

.field :deep(.p-inputtext:focus),
.field :deep(.p-password-input:focus) {
  border-color: #06b6d4 !important;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.25) !important;
  background: #ffffff !important;
}

.submit-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.875rem !important;
  font-size: 0.95rem !important;
  font-weight: 600 !important;
  border-radius: 10px !important;
  background: linear-gradient(135deg, #06b6d4, #0891b2) !important;
  border: none !important;
  transition: all 0.3s ease !important;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(6, 182, 212, 0.35);
}

.toggle-form {
  text-align: center;
  margin-top: 1.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.toggle-form a {
  color: #06b6d4;
  text-decoration: none;
  margin-left: 0.5rem;
  font-weight: 600;
}

.toggle-form a:hover {
  text-decoration: underline;
}

:deep(.p-divider) {
  margin: 1.25rem 0;
}

:deep(.p-divider::before) {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.demo-credentials {
  text-align: center;
  padding: 1rem;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(6, 182, 212, 0.2);
}

.demo-credentials h4 {
  margin-bottom: 0.5rem;
  color: #06b6d4;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.demo-credentials p {
  margin: 0.25rem 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.demo-credentials strong {
  color: #e2e8f0;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.8rem;
}

/* Right Panel - Illustration */
.illustration-panel {
  flex: 1;
  min-width: 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #cffafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}


.illustration-panel::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%);
  animation: pulse-bg 8s ease-in-out infinite;
}

.illustration-panel::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
  animation: pulse-bg 6s ease-in-out infinite reverse;
}

@keyframes pulse-bg {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.illustration-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 500px;
}

/* Security Graphic */
.security-graphic {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto 2rem;
}

.central-shield {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 40px rgba(6, 182, 212, 0.4);
  z-index: 10;
}

.central-shield i {
  font-size: 2.5rem;
  color: white;
}

.shield-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(6, 182, 212, 0.4);
  border-radius: 50%;
  animation: shield-pulse 2s ease-out infinite;
}

.shield-pulse.delay-1 { animation-delay: 0.5s; }
.shield-pulse.delay-2 { animation-delay: 1s; }

@keyframes shield-pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.5);
    opacity: 0;
  }
}

/* Orbits */
.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 1px dashed rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  animation: orbit-rotate 20s linear infinite;
}

.orbit-1 {
  width: 180px;
  height: 180px;
  margin: -90px 0 0 -90px;
}

.orbit-2 {
  width: 240px;
  height: 240px;
  margin: -120px 0 0 -120px;
  animation-duration: 25s;
  animation-direction: reverse;
}

.orbit-3 {
  width: 300px;
  height: 300px;
  margin: -150px 0 0 -150px;
  animation-duration: 30s;
}

@keyframes orbit-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-item {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.orbit-item i {
  font-size: 0.9rem;
  color: #0891b2;
}

/* Floating Icons */
.floating-icon {
  position: absolute;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: float-icon 4s ease-in-out infinite;
}

.floating-icon i {
  font-size: 1.1rem;
  color: #0891b2;
}

.icon-1 { top: 10%; left: 10%; animation-delay: 0s; }
.icon-2 { top: 5%; right: 15%; animation-delay: 0.5s; }
.icon-3 { bottom: 15%; left: 5%; animation-delay: 1s; }
.icon-4 { bottom: 10%; right: 10%; animation-delay: 1.5s; }
.icon-5 { top: 50%; right: 0; animation-delay: 2s; }

@keyframes float-icon {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

/* Connection Lines */
.connection-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.line {
  stroke: rgba(6, 182, 212, 0.2);
  stroke-width: 1;
  stroke-dasharray: 5, 5;
  animation: dash 20s linear infinite;
}

@keyframes dash {
  to { stroke-dashoffset: -100; }
}

/* Illustration Text */
.illustration-text {
  position: relative;
  z-index: 5;
}

.illustration-text h2 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.illustration-text p {
  color: #64748b;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: left;
  max-width: 280px;
  margin: 0 auto;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.feature-item i {
  color: #06b6d4;
  font-size: 1.1rem;
}

.feature-item span {
  color: #334155;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 1024px) {
  .illustration-panel {
    display: none;
  }

  .login-panel {
    width: 100%;
    min-width: auto;
  }
}

@media (max-width: 500px) {
  .login-panel {
    padding: 1.25rem;
  }

  .login-container {
    max-width: 100%;
  }

  .login-header h1 {
    font-size: 1.25rem;
  }

  .login-header p {
    font-size: 0.8rem;
  }

  .logo i {
    font-size: 2.5rem;
  }

  .login-card :deep(.p-card-content) {
    padding: 1rem !important;
  }

  .field {
    margin-bottom: 1rem;
  }

  .field :deep(.p-inputtext),
  .field :deep(.p-password-input) {
    padding: 0.65rem 0.85rem;
    font-size: 0.9rem;
  }

  .submit-btn {
    padding: 0.75rem !important;
    font-size: 0.9rem !important;
  }

  .toggle-form {
    font-size: 0.8rem;
  }

  .demo-credentials {
    padding: 0.75rem;
  }

  .demo-credentials p {
    font-size: 0.8rem;
  }
}
</style>
