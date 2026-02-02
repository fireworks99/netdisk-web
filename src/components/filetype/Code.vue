<template>
  <div class="code-preview" :class="{ 'loading': loading, 'error': error }">
    <!-- 状态指示 -->
    <div v-if="loading" class="status loading">
      <div class="spinner"></div>
      <span>加载代码中...</span>
    </div>

    <div v-if="error" class="status error">
      <span class="icon"><Close /></span>
      <span>{{ error }}</span>
      <button @click="loadCode" class="retry-btn">重试</button>
    </div>

    <!-- 代码预览区 -->
    <div v-if="!loading && !error" class="preview-content">
      <!-- 工具栏 -->
      <div class="toolbar">
        <span class="lang-badge">{{ languageName }}</span>
        <div class="actions">
          <button @click="copyCode" class="copy-btn" :class="{ 'copied': isCopied }"
            :title="isCopied ? '已复制!' : '复制代码'">
            <span class="icon">{{ isCopied ? '✓' : '📋' }}</span>
          </button>
          <button v-if="codeLines > 15" @click="expanded = !expanded" class="expand-btn"
            :title="expanded ? '收起' : '展开'">
            <Top v-if="expanded" />
            <Bottom v-else />
          </button>
        </div>
      </div>

      <!-- 代码显示区 -->
      <div class="code-container" :style="{ maxHeight: expanded ? 'none' : '400px' }" ref="codeContainer">
        <pre><code v-html="highlightedCode" ref="codeEl"></code></pre>
      </div>

      <!-- 底部信息 -->
      <div v-if="codeLines > 0" class="footer">
        <span class="lines">{{ codeLines }} 行</span>
        <span v-if="fileSize" class="size">{{ fileSize }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  ext: {
    type: String,
    required: true
  }
})

// 响应式状态
const loading = ref(false)
const error = ref('')
const codeContent = ref('')
const expanded = ref(false)
const isCopied = ref(false)
const codeContainer = ref(null)

// 语言映射
const languageMap = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  vue: 'html',
  py: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
  cs: 'csharp',
  go: 'go',
  rs: 'rust',
  rb: 'ruby',
  php: 'php',
  html: 'html',
  htm: 'html',
  css: 'css',
  scss: 'scss',
  less: 'less',
  json: 'json',
  yml: 'yaml',
  yaml: 'yaml',
  xml: 'xml',
  md: 'markdown',
  sql: 'sql',
  sh: 'bash',
  bash: 'bash'
}

// 计算属性
const detectedLanguage = computed(() => {
  const ext = props.ext.toLowerCase().replace(/^\./, '')
  return languageMap[ext] || ext
})

const languageName = computed(() => {
  const lang = detectedLanguage.value
  const displayNames = {
    javascript: 'JS',
    typescript: 'TS',
    python: 'Python',
    java: 'Java',
    cpp: 'C++',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS'
  }
  return displayNames[lang] || lang.toUpperCase()
})

const highlightedCode = computed(() => {
  if (!codeContent.value) return ''

  try {
    if (hljs.getLanguage(detectedLanguage.value)) {
      return hljs.highlight(codeContent.value.trim(), {
        language: detectedLanguage.value
      }).value
    }
    return hljs.highlightAuto(codeContent.value.trim()).value
  } catch (e) {
    console.warn('高亮失败:', e)
    return escapeHtml(codeContent.value)
  }
})

const codeLines = computed(() => {
  return codeContent.value ? codeContent.value.split('\n').length : 0
})

const fileSize = computed(() => {
  if (!codeContent.value) return ''
  const bytes = new Blob([codeContent.value]).size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

// 方法
async function loadCode() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(props.url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const text = await response.text()
    codeContent.value = text
  } catch (err) {
    error.value = `加载失败: ${err.message}`
    codeContent.value = ''
  } finally {
    loading.value = false
  }
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(codeContent.value)
    isCopied.value = true
    setTimeout(() => isCopied.value = false, 2000)
  } catch {
    // 降级方案
    const textarea = document.createElement('textarea')
    textarea.value = codeContent.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    isCopied.value = true
    setTimeout(() => isCopied.value = false, 2000)
  }
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// 监听与生命周期
watch(() => props.url, loadCode, { immediate: true })

onMounted(() => {
  // 添加滚动监听
  if (codeContainer.value) {
    codeContainer.value.addEventListener('scroll', () => {
      // 可添加滚动效果
    })
  }
})
</script>

<style lang="scss" scoped>
.code-preview {
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e1e4e8;
  overflow: hidden;
  margin: 16px 0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #d1d5da;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &.loading {
    min-height: 200px;
  }

  &.error {
    background: #fff5f5;
    border-color: #feb2b2;
  }
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 12px;
  color: #6c757d;

  &.error {
    color: #e53e3e;
    flex-direction: column;
    gap: 16px;

    .icon {
      font-size: 32px;
    }
  }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e9ecef;
  border-top-color: #4dabf7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 6px 16px;
  background: #4dabf7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background: #339af0;
  }
}

// 工具栏
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
}

.lang-badge {
  background: linear-gradient(135deg, #4dabf7, #339af0);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(51, 154, 240, 0.2);
}

.actions {
  display: flex;
  gap: 8px;
}

button {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;

  &:hover {
    background: #f8f9fa;
    border-color: #adb5bd;
  }

  &:active {
    transform: translateY(1px);
  }
}

.copy-btn {
  &.copied {
    background: #40c057;
    border-color: #40c057;
    color: white;
  }
}

// 代码容器
.code-container {
  overflow: auto;
  transition: max-height 0.3s ease;

  pre {
    margin: 0;
    padding: 16px;
    background: transparent !important;
  }

  code {
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 14px;
    line-height: 1.6;
    tab-size: 2;
  }
}

// 滚动条
.code-container::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.code-container::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.code-container::-webkit-scrollbar-thumb {
  background: #ced4da;
  border-radius: 5px;

  &:hover {
    background: #adb5bd;
  }
}

// 底部信息
.footer {
  padding: 8px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #868e96;

  .lines {
    font-weight: 500;
  }

  .size {
    opacity: 0.8;
  }
}
</style>