<template>
  <div class="metadata-form">
    <h3>Metadata</h3>
    
    <div class="form-group">
      <label for="id">ID (filename)</label>
      <input 
        id="id"
        v-model="localMetadata.id" 
        type="text" 
        :disabled="!isNew"
        placeholder="e.g., my-story"
      />
      <small v-if="isNew">This will be the filename (without .md)</small>
      <small v-else>ID cannot be changed after creation</small>
    </div>
    
    <div class="form-group">
      <label for="title">Title</label>
      <input 
        id="title"
        v-model="localMetadata.title" 
        type="text" 
        placeholder="Enter title"
      />
    </div>
    
    <div v-if="type === 'story'" class="form-group">
      <label for="person">Person</label>
      <div v-if="isPersonLocked" class="person-locked">
        {{ getPersonName(localMetadata.person) }}
      </div>
      <div v-else class="person-select-wrapper">
        <select 
          id="person"
          v-model="localMetadata.person" 
          class="person-select"
        >
          <option value="">Select a person...</option>
          <option v-for="person in people" :key="person.id" :value="person.id">
            {{ person.name }}
          </option>
        </select>
        <button 
          type="button" 
          class="manage-people-btn"
          @click="openPeopleManager"
          title="Manage People"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
          </svg>
        </button>
      </div>
      <small v-if="!isPersonLocked && !people.length">No people available. <a href="#" @click.prevent="openPeopleManager">Add one</a></small>
    </div>
    
    <div v-if="type === 'blog'" class="form-group">
      <label for="date">Date</label>
      <input 
        id="date"
        v-model="localMetadata.date" 
        type="text" 
        placeholder="e.g., 2024-01-01"
      />
    </div>
    
    <div v-if="type === 'blog'" class="form-group">
      <label for="color">Color</label>
      <input 
        id="color"
        v-model="localMetadata.color" 
        type="text" 
        placeholder="e.g., #FFD738"
      />
    </div>
    
    <div v-if="type === 'blog'" class="form-group">
      <label for="brief">Brief</label>
      <textarea 
        id="brief"
        v-model="localMetadata.brief" 
        rows="3"
        placeholder="Short description"
      ></textarea>
    </div>
    
    <div class="form-group checkbox-group">
      <label>
        <input 
          v-model="publishedChecked" 
          type="checkbox"
        />
        <span>Published</span>
      </label>
      <small>Only published content appears on the main site</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, defineOptions, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Metadata, Person } from '../api/client'
import { peopleApi } from '../api/client'

defineOptions({
  name: 'MetadataForm'
})

const props = defineProps<{
  modelValue: Metadata
  type: 'story' | 'blog'
  isNew: boolean
  lockPerson?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Metadata]
}>()

const router = useRouter()
const localMetadata = ref<Metadata>({ ...props.modelValue })
const people = ref<Person[]>([])
const isPersonLocked = computed(() => props.lockPerson && !!props.modelValue.person)

const publishedChecked = computed({
  get: () => localMetadata.value.published === 'true',
  set: (value: boolean) => {
    localMetadata.value.published = value ? 'true' : 'false'
    emitUpdate()
  }
})

const emitUpdate = () => {
  emit('update:modelValue', { ...localMetadata.value })
}

// Watch local changes and emit to parent
watch(localMetadata, () => {
  emitUpdate()
}, { deep: true })

// Watch prop changes from parent, but avoid triggering if it's the same data
watch(() => props.modelValue, (newValue) => {
  // Only update if the new value is actually different
  const currentJson = JSON.stringify(localMetadata.value)
  const newJson = JSON.stringify(newValue)
  if (currentJson !== newJson) {
    localMetadata.value = { ...newValue }
  }
}, { deep: true })

// Load people for the dropdown
const loadPeople = async () => {
  try {
    const response = await peopleApi.getAll()
    people.value = response.data
  } catch (error) {
    console.error('Error loading people:', error)
  }
}

const openPeopleManager = () => {
  window.open('/people', '_blank')
}

const getPersonName = (personId: string) => {
  const person = people.value.find(p => p.id === personId)
  return person?.name || personId
}

onMounted(() => {
  if (props.type === 'story') {
    loadPeople()
  }
})
</script>

<style scoped>
.metadata-form {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
}

.metadata-form h3 {
  color: #FFD738;
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  color: #fff;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  background: #0a0a0a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #FFD738;
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-group small {
  display: block;
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: normal;
  margin-bottom: 0.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.checkbox-group span {
  color: #fff;
  font-size: 0.95rem;
}

.person-select-wrapper {
  display: flex;
  gap: 0.5rem;
}

.person-select {
  flex: 1;
}

.manage-people-btn {
  background: #2a2a2a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.manage-people-btn:hover {
  background: #3a3a3a;
  color: #FFD738;
  border-color: #FFD738;
}

.form-group a {
  color: #FFD738;
  text-decoration: underline;
}

.person-locked {
  background: #0a0a0a;
  border: 1px solid #333;
  color: #FFD738;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23fff' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}
</style>

