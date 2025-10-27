<template>
  <div class="editor-view">
    <div class="editor-header">
      <div>
        <h1>{{ isNew ? 'New Blog' : 'Edit Blog' }}</h1>
        <p class="subtitle">{{ isNew ? 'Create a new blog post' : `Editing: ${metadata.title || route.params.id}` }}</p>
      </div>
      <div class="header-actions">
        <button @click="goBack" class="secondary">Cancel</button>
        <button @click="save" :disabled="!canSave">
          {{ isNew ? 'Create' : 'Save' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else class="editor-content">
      <div class="sidebar">
        <MetadataForm 
          v-model="metadata" 
          type="blog"
          :is-new="isNew"
        />
      </div>
      
      <div class="main-editor">
        <MarkdownEditor v-model="content" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineOptions } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogsApi, type Metadata } from '../api/client'
import MarkdownEditor from '../components/MarkdownEditor.vue'
import MetadataForm from '../components/MetadataForm.vue'
import { useToast } from '../composables/useToast'

defineOptions({
  name: 'BlogEditor'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const metadata = ref<Metadata>({
  id: '',
  title: '',
  date: '',
  color: '',
  brief: '',
  published: 'false'
})
const content = ref('')

const isNew = computed(() => route.name === 'NewBlog' || route.params.id === 'new')

const canSave = computed(() => {
  return metadata.value.id && 
         metadata.value.title && 
         content.value.trim().length > 0
})

const loadBlog = async () => {
  if (isNew.value) return
  
  try {
    loading.value = true
    const response = await blogsApi.getOne(route.params.id as string)
    metadata.value = response.data.metadata
    metadata.value.id = response.data.id
    content.value = response.data.content
  } catch (error) {
    console.error('Error loading blog:', error)
    toast.error('Failed to load blog')
    goBack()
  } finally {
    loading.value = false
  }
}

const save = async () => {
  if (!canSave.value) {
    toast.error('Please fill in all required fields (ID, Title, and Content)')
    return
  }
  
  const wasNew = isNew.value
  
  try {
    loading.value = true
    
    const saveMetadata = { ...metadata.value }
    delete saveMetadata.id // Don't include id in metadata
    
    if (isNew.value) {
      await blogsApi.create(metadata.value.id!, saveMetadata, content.value)
    } else {
      await blogsApi.update(route.params.id as string, saveMetadata, content.value)
    }
    
    // Clear autosave
    localStorage.removeItem('markdown-editor-autosave')
    
    // Reset loading before navigation
    loading.value = false
    
    // Show success message
    toast.success(wasNew ? 'Blog created successfully!' : 'Blog saved successfully!')
    
    // Navigate back
    await router.push('/')
  } catch (error) {
    loading.value = false
    console.error('Error saving blog:', error)
    toast.error('Failed to save blog')
  }
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  loadBlog()
})
</script>

<style scoped>
.editor-view {
  height: calc(100vh - 5rem);
  display: flex;
  flex-direction: column;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #333;
}

.editor-header h1 {
  font-size: 2rem;
  color: #FFD738;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #999;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
}

.editor-content {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  overflow: hidden;
}

.sidebar {
  overflow-y: auto;
}

.main-editor {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .editor-content {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
  
  .main-editor {
    min-height: 600px;
  }
}
</style>

