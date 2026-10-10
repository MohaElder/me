<template>
  <div class="people-admin">
    <section class="list" aria-label="People">
      <header class="list-head">
        <h1>People</h1>
        <button type="button" class="btn" @click="addPerson">Add person</button>
      </header>
      <div class="people">
        <div v-for="person in content.people" :key="person.id" class="person">
          <button type="button" class="name" :aria-pressed="selected === person" @click="selected = person">
            <strong>{{ person.name || 'Unnamed' }}</strong><span>{{ person.metAt }}</span>
          </button>
          <button v-for="story in storiesOf(person)" :key="story.id" type="button" class="story"
            :aria-pressed="selected === story" @click="selected = story">
            {{ story.title }}<span v-if="!story.published"> · Draft</span>
          </button>
          <button type="button" class="story new" @click="addStory(person)">+ New story</button>
        </div>
      </div>
    </section>

    <ArticleEditor v-if="story" :key="story.id" kind="stories" :id="story.id" :title="story.title">
      <label class="wide"><span class="label">Title</span><input v-model="story.title" class="field"></label>
      <label><span class="label">Person</span>
        <select v-model="story.person" class="field">
          <option v-for="p in content.people" :key="p.id" :value="p.id">{{ p.name }} · {{ p.metAt }}</option>
        </select>
      </label>
      <div>
        <span class="label">Status</span>
        <div class="seg">
          <button type="button" :aria-pressed="story.published" @click="story.published = true">Published</button>
          <button type="button" :aria-pressed="!story.published" @click="story.published = false">Draft</button>
        </div>
      </div>
      <button type="button" class="btn delete" @click="removeStory(story)">Delete story</button>
    </ArticleEditor>

    <section v-else-if="person" class="person-form">
      <label><span class="label">Name</span><input v-model="person.name" class="field"></label>
      <label><span class="label">Where I met them</span><input v-model="person.metAt" class="field"></label>
      <p class="muted">{{ storiesOf(person).length
        ? `${storiesOf(person).length} stories. Only people with a published story appear on the site.`
        : 'No stories yet.' }}</p>
      <button v-if="!storiesOf(person).length" type="button" class="btn" @click="removePerson(person)">Delete person</button>
    </section>

    <p v-else class="muted empty">Pick a person or a story.</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ArticleEditor from './ArticleEditor.vue'
import { article, content, newId, type Person, type Story } from './store'

const selected = ref<Person | Story | null>(content.stories[0] ?? null)
const story = computed(() => selected.value && 'person' in selected.value ? selected.value : null)
const person = computed(() => selected.value && 'metAt' in selected.value ? selected.value : null)

const storiesOf = (p: Person) => content.stories.filter(s => s.person === p.id)

const addPerson = () => {
  content.people.push({ id: newId(), name: '', metAt: '' })
  selected.value = content.people.at(-1)!
}

const addStory = (p: Person) => {
  content.stories.push({ id: newId(), person: p.id, title: 'Untitled story', published: false })
  selected.value = content.stories.at(-1)!
}

const removeStory = (s: Story) => {
  if (!confirm(`Delete “${s.title}”? Its Markdown file is deleted too.`)) return
  content.stories.splice(content.stories.indexOf(s), 1)
  article.remove('stories', s.id)
  selected.value = null
}

const removePerson = (p: Person) => {
  content.people.splice(content.people.indexOf(p), 1)
  selected.value = null
}
</script>

<style scoped>
.people-admin {
  flex: 1;
  min-width: 0;
  display: flex;
}

.list {
  width: 280px;
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

.people {
  overflow-y: auto;
  padding: 8px 0;
}

.person {
  display: flex;
  flex-direction: column;
  padding-bottom: 6px;
}

.person button {
  text-align: left;
}

.name {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px 4px 16px;
  font-size: 15px;
}

.name span {
  font-size: 12px;
  color: #8A8A8A;
}

.story {
  padding: 8px 12px 8px 28px;
  font-size: 14px;
  color: #BDBDBD;
}

.story span,
.story.new {
  color: #8A8A8A;
}

.person button:hover {
  color: #FEE989;
}

.person button[aria-pressed="true"] {
  color: #FDDA3A;
  background: #141414;
}

.delete {
  align-self: end;
  justify-self: start;
}

.person-form {
  width: 420px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.person-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.person-form .btn {
  align-self: start;
}

.empty {
  padding: 24px;
}
</style>
