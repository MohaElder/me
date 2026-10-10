<template>
  <div class="blog-admin">
    <section class="list" aria-label="Posts">
      <header class="list-head">
        <h1>Blog</h1>
        <button type="button" class="btn" @click="addPost">New post</button>
      </header>
      <div class="posts">
        <button v-for="p in posts" :key="p.id" type="button" class="post" :aria-pressed="selected === p"
          @click="selected = p">
          <span>{{ p.title || 'Untitled' }}</span>
          <span class="muted">{{ p.date }}{{ p.published ? '' : ' · Draft' }}</span>
        </button>
      </div>
    </section>

    <ArticleEditor v-if="selected" :key="selected.id" kind="blogs" :id="selected.id" :title="selected.title">
      <label class="wide"><span class="label">Title</span><input v-model="selected.title" class="field"></label>
      <label class="wide"><span class="label">Brief</span><input v-model="selected.brief" class="field"></label>
      <label><span class="label">Date</span><input v-model="selected.date" class="field" placeholder="2026/10/10"></label>
      <label><span class="label">Card colour</span><input v-model="selected.color" class="field" type="color"></label>
      <label><span class="label">Cover image URL</span><input v-model="selected.cover" class="field"></label>
      <label><span class="label">Cover caption</span><input v-model="selected.coverCaption" class="field"></label>
      <div>
        <span class="label">Status</span>
        <div class="seg">
          <button type="button" :aria-pressed="selected.published" @click="selected.published = true">Published</button>
          <button type="button" :aria-pressed="!selected.published" @click="selected.published = false">Draft</button>
        </div>
      </div>
      <button type="button" class="btn delete" @click="removePost(selected)">Delete post</button>
    </ArticleEditor>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ArticleEditor from './ArticleEditor.vue'
import { article, content, newId, type Post } from './store'

const posts = computed(() => [...content.blogs].sort((a, b) => (Date.parse(b.date) || Infinity) - (Date.parse(a.date) || Infinity)))
const selected = ref<Post | null>(posts.value[0] ?? null)

const addPost = () => {
  const d = new Date()
  content.blogs.push({
    id: newId(), title: 'Untitled post', date: `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`,
    brief: '', color: '#64b5f6', cover: '', coverCaption: '', published: false,
  })
  selected.value = content.blogs.at(-1)!
}

const removePost = (p: Post) => {
  if (!confirm(`Delete “${p.title}”? Its Markdown file is deleted too.`)) return
  content.blogs.splice(content.blogs.indexOf(p), 1)
  article.remove('blogs', p.id)
  selected.value = posts.value[0] ?? null
}
</script>

<style scoped>
.blog-admin {
  flex: 1;
  min-width: 0;
  display: flex;
}

.list {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1f1f1f;
}

.list-head {
  height: 72px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #1f1f1f;
}

.posts {
  overflow-y: auto;
  padding: 8px 0;
}

.post {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 16px;
  text-align: left;
  font-size: 14px;
  color: #D8D8D8;
}

.post .muted {
  font-size: 12px;
}

.post:hover {
  color: #FEE989;
}

.post[aria-pressed="true"] {
  color: #FDDA3A;
  background: #141414;
}

.delete {
  align-self: end;
  justify-self: start;
}
</style>
