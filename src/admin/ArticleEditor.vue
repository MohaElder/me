<template>
  <div class="editor">
    <section class="write">
      <div class="fields">
        <slot />
      </div>
      <label class="body"><span class="label">Markdown</span>
        <textarea v-model="text" spellcheck="true"></textarea>
      </label>
    </section>
    <section class="preview" aria-label="Preview">
      <div class="preview-head label">
        <span>Preview · as on the site</span>
        <a :href="`/me/${kind === 'stories' ? 'story' : 'blog'}?id=${id}`" target="_blank">Open page</a>
      </div>
      <article>
        <h2>{{ title }}</h2>
        <div class="blog-renderer" v-html="renderArticle(text)"></div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { renderArticle } from '../article'
import { article, type Kind } from './store'

// A story or blog post: its fields (the slot), its Markdown, and a live preview
// rendered the way the site renders it. The Markdown saves as you type.
const props = defineProps<{ kind: Kind, id: string, title: string }>()

const text = ref('')
let loaded = ''
let timer = 0
let pending: (() => void) | undefined
const flush = () => {
  clearTimeout(timer)
  pending?.()
  pending = undefined
}

watch(() => props.id, async id => {
  flush()
  text.value = loaded = await article.read(props.kind, id)
}, { immediate: true })

watch(text, value => {
  if (value === loaded) return
  const { kind, id } = props
  pending = () => article.write(kind, id, (loaded = value))
  clearTimeout(timer)
  timer = window.setTimeout(flush, 500)
})
onUnmounted(flush)
</script>

<style scoped>
.editor {
  flex: 1;
  min-width: 0;
  display: flex;
}

.write {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1f1f1f;
}

.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #1f1f1f;
}

.fields :slotted(.wide) {
  grid-column: 1 / -1;
}

.fields :slotted(label) {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
}

textarea {
  flex: 1;
  resize: none;
  padding: 14px;
  background: #050505;
  border: 1px solid #262626;
  color: #D8D8D8;
  font-family: "SF Mono", Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
}

.preview {
  width: 440px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #000;
}

.preview-head {
  height: 44px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #1f1f1f;
}

.preview-head a {
  color: #FDDA3A;
  letter-spacing: 0;
  text-transform: none;
}

article {
  flex: 1;
  overflow-y: auto;
  padding: 28px;
}

article h2 {
  margin: 0 0 16px;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.1;
}
</style>
