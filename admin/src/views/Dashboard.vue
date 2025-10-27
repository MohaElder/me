<template>
  <div class="dashboard">
    <div class="sections">
      <!-- People Section with nested stories -->
      <section class="content-section">
        <div class="section-header">
          <h2>People & Stories</h2>
          <div class="header-actions">
            <button @click="createNewPerson">+ New Person</button>
            <button @click="toggleManageMode" :class="{ active: manageMode }" class="secondary">
              {{ manageMode ? 'Done' : 'Manage People' }}
            </button>
          </div>
        </div>
        
        <div v-if="loadingPeople || loadingStories" class="loading">Loading...</div>
        <div v-else-if="peopleWithStories.length === 0" class="empty-state">
          No people or stories yet. Click "+ New Person" to get started!
        </div>
        <div v-else class="people-list">
          <div 
            v-for="person in peopleWithStories" 
            :key="person.id" 
            class="person-block"
          >
            <div class="person-header" :class="{ 'manage-mode': manageMode }">
              <div class="person-info">
                <h3>
                  <transition name="fade-slide" mode="out-in">
                    <input 
                      v-if="manageMode && selectedPerson === person.id" 
                      v-model="editingPersonData.name"
                      type="text"
                      class="inline-edit"
                      @click.stop
                      key="input-name"
                    />
                    <span v-else key="text-name">{{ person.name }}</span>
                  </transition>
                </h3>
                <p class="met-at">
                  <transition name="fade-slide" mode="out-in">
                    <input 
                      v-if="manageMode && selectedPerson === person.id" 
                      v-model="editingPersonData.IMetThemAt"
                      type="text"
                      class="inline-edit"
                      @click.stop
                      key="input-met"
                    />
                    <span v-else key="text-met">{{ person.IMetThemAt }}</span>
                  </transition>
                </p>
              </div>
              <transition name="slide-left">
                <div class="person-actions" :key="manageMode ? 'manage' : 'normal'">
                  <button 
                    v-if="!manageMode"
                    @click.stop="createStoryForPerson(person.id)" 
                    class="icon-button"
                    title="New story for this person"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <button 
                    v-if="manageMode && selectedPerson === person.id"
                    @click.stop="savePerson(person.id)" 
                    class="icon-button save"
                    title="Save changes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                  <button 
                    v-if="manageMode"
                    @click.stop="selectPersonForManage(person.id, person.name, person.IMetThemAt)" 
                    class="icon-button"
                    :class="{ active: selectedPerson === person.id }"
                    title="Edit person"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </button>
                  <button 
                    v-if="manageMode"
                    @click.stop="deletePerson(person.id, person.name)" 
                    class="icon-button danger"
                    title="Delete person"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </transition>
            </div>
            
            <div v-if="person.stories.length === 0" class="no-stories">
              No stories yet for this person
            </div>
            <div v-else class="stories-grid">
              <div 
                v-for="story in person.stories" 
                :key="story.id" 
                class="story-card"
                @click="editStory(story.id)"
              >
                <div class="card-header">
                  <h4>{{ story.title || story.id }}</h4>
                  <span 
                    class="status-badge" 
                    :class="{ published: story.published === 'true' }"
                  >
                    {{ story.published === 'true' ? '✓' : '○' }}
                  </span>
                </div>
                <p class="preview">{{ story.preview || 'No preview available' }}</p>
                <div class="card-actions">
                  <button 
                    @click.stop="editStory(story.id)" 
                    class="secondary"
                  >
                    Edit
                  </button>
                  <button 
                    @click.stop="deleteStory(story.id)" 
                    class="danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Blogs Section -->
      <section class="content-section">
        <div class="section-header">
          <h2>Blogs</h2>
          <button @click="createNew('blog')">+ New Blog</button>
        </div>
        
        <div v-if="loadingBlogs" class="loading">Loading blogs...</div>
        <div v-else-if="blogs.length === 0" class="empty-state">
          No blogs yet. Create your first one!
        </div>
        <div v-else class="content-grid">
          <div 
            v-for="blog in blogs" 
            :key="blog.id" 
            class="content-card"
            @click="editBlog(blog.id)"
          >
            <div class="card-header">
              <h3>{{ blog.title || blog.id }}</h3>
              <span 
                class="status-badge" 
                :class="{ published: blog.published === 'true' }"
              >
                {{ blog.published === 'true' ? 'Published' : 'Draft' }}
              </span>
            </div>
            <p class="date">{{ blog.date || 'No date' }}</p>
            <p class="preview">{{ blog.brief || blog.preview || 'No preview available' }}</p>
            <div class="card-actions">
              <button 
                @click.stop="editBlog(blog.id)" 
                class="secondary"
              >
                Edit
              </button>
              <button 
                @click.stop="deleteBlog(blog.id)" 
                class="danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- New Person Modal -->
    <transition name="modal">
      <div v-if="showNewPersonModal" class="modal-overlay" @click="showNewPersonModal = false">
        <div class="modal-content" @click.stop>
          <h2>New Person</h2>
          
          <div class="form-group">
            <label>Name</label>
            <input v-model="newPersonData.name" type="text" placeholder="Enter name" />
          </div>
          
          <div class="form-group">
            <label>I Met Them At</label>
            <input v-model="newPersonData.IMetThemAt" type="text" placeholder="Where and when did you meet?" />
          </div>
          
          <div class="modal-actions">
            <button @click="showNewPersonModal = false" class="secondary">Cancel</button>
            <button @click="saveNewPerson">Create</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, defineOptions, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storiesApi, blogsApi, peopleApi, type Content, type Person } from '../api/client'
import { useToast } from '../composables/useToast'

defineOptions({
  name: 'Dashboard'
})

const router = useRouter()
const toast = useToast()

const stories = ref<Content[]>([])
const blogs = ref<Content[]>([])
const people = ref<Person[]>([])
const loadingStories = ref(true)
const loadingBlogs = ref(true)
const loadingPeople = ref(true)
const manageMode = ref(false)
const selectedPerson = ref<string | null>(null)
const editingPersonData = ref({ name: '', IMetThemAt: '' })
const showNewPersonModal = ref(false)
const newPersonData = ref({ name: '', IMetThemAt: '' })

// Compute people with their stories
const peopleWithStories = computed(() => {
  return people.value.map(person => ({
    ...person,
    stories: stories.value.filter(story => story.person === person.id)
  }))
})

const loadStories = async () => {
  try {
    loadingStories.value = true
    const response = await storiesApi.getAll()
    stories.value = response.data.filter(story => story.id && story.id !== 'undefined')
  } catch (error) {
    console.error('Error loading stories:', error)
    toast.error('Failed to load stories')
  } finally {
    loadingStories.value = false
  }
}

const loadBlogs = async () => {
  try {
    loadingBlogs.value = true
    const response = await blogsApi.getAll()
    blogs.value = response.data.filter(blog => blog.id && blog.id !== 'undefined')
  } catch (error) {
    console.error('Error loading blogs:', error)
    toast.error('Failed to load blogs')
  } finally {
    loadingBlogs.value = false
  }
}

const loadPeople = async () => {
  try {
    loadingPeople.value = true
    const response = await peopleApi.getAll()
    people.value = response.data
  } catch (error) {
    console.error('Error loading people:', error)
    toast.error('Failed to load people')
  } finally {
    loadingPeople.value = false
  }
}

const toggleManageMode = () => {
  manageMode.value = !manageMode.value
  if (!manageMode.value) {
    selectedPerson.value = null
  }
}

const selectPersonForManage = (id: string, name: string, metAt: string) => {
  if (selectedPerson.value === id) {
    selectedPerson.value = null
  } else {
    selectedPerson.value = id
    editingPersonData.value = { name, IMetThemAt: metAt }
  }
}

const savePerson = async (id: string) => {
  if (!editingPersonData.value.name) {
    toast.error('Name is required')
    return
  }
  
  try {
    await peopleApi.update(id, editingPersonData.value)
    toast.success('Person updated!')
    await loadPeople()
    selectedPerson.value = null
  } catch (error) {
    console.error('Error updating person:', error)
    toast.error('Failed to update person')
  }
}

const deletePerson = async (id: string, name: string) => {
  if (!confirm(`Delete ${name}? Their stories won't be deleted.`)) {
    return
  }
  
  try {
    await peopleApi.delete(id)
    toast.success('Person deleted!')
    await loadPeople()
    selectedPerson.value = null
  } catch (error) {
    console.error('Error deleting person:', error)
    toast.error('Failed to delete person')
  }
}

const createNewPerson = () => {
  showNewPersonModal.value = true
  newPersonData.value = { name: '', IMetThemAt: '' }
}

const saveNewPerson = async () => {
  if (!newPersonData.value.name) {
    toast.error('Name is required')
    return
  }
  
  try {
    const id = newPersonData.value.name.toLowerCase().replace(/\s+/g, '-')
    await peopleApi.create(id, newPersonData.value)
    toast.success('Person created!')
    await loadPeople()
    showNewPersonModal.value = false
  } catch (error) {
    console.error('Error creating person:', error)
    toast.error('Failed to create person')
  }
}

const createStoryForPerson = (personId: string) => {
  router.push({ path: '/stories/new', query: { person: personId } })
}

const editStory = (id: string) => {
  router.push(`/stories/${id}`)
}

const editBlog = (id: string) => {
  router.push(`/blogs/${id}`)
}

const createNew = (type: 'blog') => {
  router.push('/blogs/new')
}

const deleteStory = async (id: string) => {
  if (!confirm('Are you sure you want to delete this story?')) {
    return
  }
  
  try {
    await storiesApi.delete(id)
    toast.success('Story deleted!')
    await loadStories()
  } catch (error) {
    console.error('Error deleting story:', error)
    toast.error('Failed to delete story')
  }
}

const deleteBlog = async (id: string) => {
  if (!confirm('Are you sure you want to delete this blog?')) {
    return
  }
  
  try {
    await blogsApi.delete(id)
    toast.success('Blog deleted!')
    await loadBlogs()
  } catch (error) {
    console.error('Error deleting blog:', error)
    toast.error('Failed to delete blog')
  }
}

onMounted(() => {
  loadStories()
  loadBlogs()
  loadPeople()
})

// Reload data when navigating back to dashboard
onActivated(() => {
  loadStories()
  loadBlogs()
  loadPeople()
})
</script>

<style scoped>
.sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.content-section {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #333;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #fff;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.empty-state a {
  color: #FFD738;
  text-decoration: underline;
  cursor: pointer;
}

/* People List Styles */
.people-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.person-block {
  background: #0a0a0a;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 1.5rem;
}

.person-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #444;
}

.person-info h3 {
  font-size: 1.5rem;
  color: #FFD738;
  margin: 0 0 0.25rem 0;
}

.met-at {
  color: #999;
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
}

.icon-button {
  background: transparent;
  border: 1px solid #444;
  color: #999;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-button:hover {
  background: #2a2a2a;
  color: #FFD738;
  border-color: #FFD738;
}

.icon-button.active {
  background: #FFD738;
  color: #0a0a0a;
  border-color: #FFD738;
}

.icon-button.save {
  border-color: #28a745;
  color: #28a745;
}

.icon-button.save:hover {
  background: #28a745;
  color: #fff;
}

.icon-button.danger {
  border-color: #dc3545;
  color: #dc3545;
}

.icon-button.danger:hover {
  background: #dc3545;
  color: #fff;
}

.person-actions {
  display: flex;
  gap: 0.5rem;
}

.inline-edit {
  background: #0a0a0a;
  border: 1px solid #FFD738;
  color: #fff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: inherit;
  font-weight: inherit;
  font-style: inherit;
  width: 100%;
}

.inline-edit:focus {
  outline: none;
  border-color: #FFD738;
}

.person-header.manage-mode {
  background: rgba(255, 215, 56, 0.05);
  padding: 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.no-stories {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.story-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.story-card:hover {
  border-color: #FFD738;
  transform: translateY(-2px);
}

.story-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.story-card .card-header h4 {
  font-size: 1.1rem;
  color: #fff;
  flex: 1;
  line-height: 1.3;
  margin: 0;
}

/* Blog Grid Styles */
.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.content-card {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.content-card:hover {
  border-color: #FFD738;
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.card-header h3 {
  font-size: 1.2rem;
  color: #fff;
  flex: 1;
  line-height: 1.3;
  margin: 0;
}

.status-badge {
  background: #444;
  color: #999;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.status-badge.published {
  background: #28a745;
  color: #fff;
}

.date {
  color: #FFD738;
  font-size: 0.9rem;
  font-weight: 500;
}

.preview {
  color: #999;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

button.secondary.active {
  background: #FFD738;
  color: #0a0a0a;
  border-color: #FFD738;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content {
  transform: scale(0.95) translateY(-20px);
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.25s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

@media (max-width: 768px) {
  .stories-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header,
  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>
