<template>
  <div class="people-manager">
    <div class="manager-header">
      <h1>People Management</h1>
      <button @click="createNew">+ New Person</button>
    </div>

    <div v-if="loading" class="loading">Loading people...</div>
    <div v-else-if="people.length === 0" class="empty-state">
      No people yet. Add your first person!
    </div>
    <div v-else class="people-grid">
      <div 
        v-for="person in people" 
        :key="person.id" 
        class="person-card"
      >
        <div class="card-header">
          <h3>{{ person.name }}</h3>
        </div>
        <p class="met-at">{{ person.IMetThemAt }}</p>
        <p class="story-count">{{ getStoryCount(person.id) }} stories</p>
        <div class="card-actions">
          <button @click="editPerson(person)" class="secondary">Edit</button>
          <button @click="deletePerson(person)" class="danger">Delete</button>
        </div>
      </div>
    </div>

    <!-- Modal for creating/editing person -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ editingPerson ? 'Edit Person' : 'New Person' }}</h2>
        
        <div class="form-group">
          <label>Name</label>
          <input v-model="formData.name" type="text" placeholder="Enter name" />
        </div>
        
        <div class="form-group">
          <label>I Met Them At</label>
          <input v-model="formData.IMetThemAt" type="text" placeholder="Where and when did you meet?" />
        </div>
        
        <div class="modal-actions">
          <button @click="closeModal" class="secondary">Cancel</button>
          <button @click="savePerson">{{ editingPerson ? 'Save' : 'Create' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineOptions } from 'vue'
import { useToast } from '../composables/useToast'
import { peopleApi, type Person } from '../api/client'
import { storiesApi } from '../api/client'

defineOptions({
  name: 'PeopleManager'
})

const toast = useToast()

const people = ref<Person[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingPerson = ref<Person | null>(null)
const formData = ref({
  name: '',
  IMetThemAt: ''
})
const storyCounts = ref<Record<string, number>>({})

const loadPeople = async () => {
  try {
    loading.value = true
    const response = await peopleApi.getAll()
    people.value = response.data
    await loadStoryCounts()
  } catch (error) {
    console.error('Error loading people:', error)
    toast.error('Failed to load people')
  } finally {
    loading.value = false
  }
}

const loadStoryCounts = async () => {
  try {
    const storiesResponse = await storiesApi.getAll()
    const counts: Record<string, number> = {}
    
    storiesResponse.data.forEach(story => {
      const personId = story.person || ''
      counts[personId] = (counts[personId] || 0) + 1
    })
    
    storyCounts.value = counts
  } catch (error) {
    console.error('Error loading story counts:', error)
  }
}

const getStoryCount = (personId: string) => {
  return storyCounts.value[personId] || 0
}

const createNew = () => {
  editingPerson.value = null
  formData.value = {
    name: '',
    IMetThemAt: ''
  }
  showModal.value = true
}

const editPerson = (person: Person) => {
  editingPerson.value = person
  formData.value = {
    name: person.name,
    IMetThemAt: person.IMetThemAt
  }
  showModal.value = true
}

const savePerson = async () => {
  if (!formData.value.name) {
    toast.error('Please enter a name')
    return
  }
  
  try {
    const personData = {
      name: formData.value.name,
      IMetThemAt: formData.value.IMetThemAt
    }
    
    if (editingPerson.value) {
      await peopleApi.update(editingPerson.value.id, personData)
      toast.success('Person updated successfully!')
    } else {
      // Generate ID from name
      const id = formData.value.name.toLowerCase().replace(/\s+/g, '-')
      await peopleApi.create(id, personData)
      toast.success('Person created successfully!')
    }
    
    await loadPeople()
    closeModal()
  } catch (error) {
    console.error('Error saving person:', error)
    toast.error('Failed to save person')
  }
}

const deletePerson = async (person: Person) => {
  if (!confirm(`Delete ${person.name}? This won't delete their stories.`)) {
    return
  }
  
  try {
    await peopleApi.delete(person.id)
    toast.success('Person deleted successfully!')
    await loadPeople()
  } catch (error) {
    console.error('Error deleting person:', error)
    toast.error('Failed to delete person')
  }
}

const closeModal = () => {
  showModal.value = false
  editingPerson.value = null
}

onMounted(() => {
  loadPeople()
})
</script>

<style scoped>
.people-manager {
  padding: 2rem;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.manager-header h1 {
  font-size: 2.5rem;
  color: #FFD738;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.people-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.person-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s;
}

.person-card:hover {
  border-color: #FFD738;
  transform: translateY(-2px);
}

.card-header h3 {
  font-size: 1.3rem;
  color: #FFD738;
  margin: 0;
}

.met-at {
  color: #999;
  font-size: 0.9rem;
  line-height: 1.5;
}

.story-count {
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #333;
}

.card-actions button {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.modal-content h2 {
  color: #FFD738;
  margin: 0;
  font-size: 1.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input {
  background: #0a0a0a;
  border: 1px solid #333;
  color: #fff;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #FFD738;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  flex: 1;
}
</style>

