<template>
  <v-container class="letter" v-html="html"></v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import MarkdownIt from 'markdown-it'
import en from '../letters/future-ai.en.md?raw'
import zh from '../letters/future-ai.zh.md?raw'

const { locale } = useI18n()
const md = new MarkdownIt()
const letters = { en: md.render(en), zh: md.render(zh) }
const html = computed(() => (locale.value === 'zh' ? letters.zh : letters.en))
</script>

<style scoped>
.letter {
  max-width: 900px;
  padding: 40px 24px 100px;
  color: #fff;
}

.letter :deep(h1) {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1.1;
  margin-bottom: 8px;
}

.letter :deep(h3) {
  color: #ffd738;
  font-size: 24px;
  margin: 40px 0 16px;
}

.letter :deep(strong) {
  font-weight: 700;
}

.letter :deep(li) {
  font-size: 1.25rem;
  line-height: 1.875rem;
}

.letter :deep(ol),
.letter :deep(ul) {
  padding-left: 24px;
  margin-bottom: 15px;
}

.letter :deep(hr) {
  margin: 40px 0;
  border-color: #9d9d9d;
}

@media (max-width: 768px) {
  .letter :deep(h1) {
    font-size: 36px;
    letter-spacing: -1.2px;
  }
}
</style>
