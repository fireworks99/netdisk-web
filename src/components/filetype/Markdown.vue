<template>
  <div class="markdown-preview">
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <v-md-preview v-else :text="markdownContent" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, { Hljs: hljs });

const props = defineProps({
  url: {
    type: String,
    required: true
  }
});

const markdownContent = ref('');
const loading = ref(false);
const error = ref('');

const fetchMarkdownFile = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 1. 获取文件内容
    const response = await fetch(props.url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // 2. 读取为文本
    const content = await response.text();
    
    // 3. 存储内容用于预览
    markdownContent.value = content;
  } catch (err) {
    console.error('加载Markdown文件失败:', err);
    error.value = `加载失败: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// 监听URL变化，重新加载
watch(() => props.url, fetchMarkdownFile);

// 组件挂载时加载
onMounted(fetchMarkdownFile);
</script>

<style scoped>
.loading, .error {
  padding: 40px;
  color: #666;
}
.error {
  color: #f56c6c;
}
</style>