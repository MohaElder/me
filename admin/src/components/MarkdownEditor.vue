<template>
  <div class="markdown-editor">
    <div class="editor-pane">
      <div class="pane-header">
        <h3>Editor</h3>
        <span class="char-count">{{ localContent.length }} characters</span>
      </div>
      <textarea 
        v-model="localContent"
        @input="onInput"
        placeholder="Write your content in markdown..."
        class="markdown-textarea"
      ></textarea>
    </div>
    
    <div class="preview-pane">
      <div class="pane-header">
        <h3>Preview</h3>
      </div>
      <div class="markdown-preview" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineOptions } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

defineOptions({
  name: 'MarkdownEditor'
})

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localContent = ref(props.modelValue || '')

// Configure marked
marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('Highlight error:', err)
      }
    }
    return code
  },
  breaks: true,
  gfm: true
})

const renderedContent = computed(() => {
  try {
    return marked(localContent.value || '')
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return '<p>Error rendering markdown</p>'
  }
})

const onInput = () => {
  emit('update:modelValue', localContent.value)
  
  // Auto-save to localStorage
  const autoSaveKey = 'markdown-editor-autosave'
  localStorage.setItem(autoSaveKey, localContent.value)
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  const safeNewValue = newValue || ''
  if (safeNewValue !== localContent.value) {
    localContent.value = safeNewValue
  }
})

// Restore from localStorage on mount
const restoreAutoSave = () => {
  const autoSaveKey = 'markdown-editor-autosave'
  const saved = localStorage.getItem(autoSaveKey)
  if (saved && !localContent.value) {
    localContent.value = saved
  }
}

// Optionally call restoreAutoSave() on mount if needed
</script>

<style scoped>
.markdown-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  height: 100%;
  min-height: 600px;
}

.editor-pane, .preview-pane {
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #2a2a2a;
  border-bottom: 1px solid #333;
}

.pane-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #FFD738;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.char-count {
  color: #666;
  font-size: 0.85rem;
}

.markdown-textarea {
  flex: 1;
  padding: 1.5rem;
  background: #0a0a0a;
  border: none;
  color: #fff;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.95rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.markdown-preview {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  line-height: 1.7;
}

/* Markdown Preview Styles */
.markdown-preview :deep(h1) {
  font-size: 2rem;
  color: #FFD738;
  margin: 1.5rem 0 1rem;
  font-weight: 700;
}

.markdown-preview :deep(h2) {
  font-size: 1.6rem;
  color: #FFD738;
  margin: 1.3rem 0 0.8rem;
  font-weight: 600;
}

.markdown-preview :deep(h3) {
  font-size: 1.3rem;
  color: #fff;
  margin: 1.2rem 0 0.7rem;
  font-weight: 600;
}

.markdown-preview :deep(p) {
  margin: 1rem 0;
  color: #ccc;
}

.markdown-preview :deep(a) {
  color: #FFD738;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 215, 56, 0.3);
  transition: all 0.2s;
}

.markdown-preview :deep(a:hover) {
  border-bottom-color: #FFD738;
}

.markdown-preview :deep(code) {
  background: #2a2a2a;
  color: #FFD738;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9em;
}

.markdown-preview :deep(pre) {
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.markdown-preview :deep(pre code) {
  background: none;
  color: inherit;
  padding: 0;
}

.markdown-preview :deep(blockquote) {
  border-left: 4px solid #FFD738;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: #999;
  font-style: italic;
}

.markdown-preview :deep(ul), .markdown-preview :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
  color: #ccc;
}

.markdown-preview :deep(li) {
  margin: 0.5rem 0;
}

.markdown-preview :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  margin: 1.5rem 0;
}

.markdown-preview :deep(hr) {
  border: none;
  border-top: 1px solid #333;
  margin: 2rem 0;
}

.markdown-preview :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.markdown-preview :deep(th), .markdown-preview :deep(td) {
  border: 1px solid #333;
  padding: 0.75rem;
  text-align: left;
}

.markdown-preview :deep(th) {
  background: #2a2a2a;
  font-weight: 600;
  color: #FFD738;
}

@media (max-width: 1024px) {
  .markdown-editor {
    grid-template-columns: 1fr;
  }
  
  .editor-pane {
    min-height: 400px;
  }
  
  .preview-pane {
    min-height: 400px;
  }
}
</style>

