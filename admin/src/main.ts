import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import StoryEditor from './views/StoryEditor.vue'
import BlogEditor from './views/BlogEditor.vue'
import PeopleManager from './views/PeopleManager.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/stories/new',
      name: 'NewStory',
      component: StoryEditor
    },
    {
      path: '/stories/:id',
      name: 'EditStory',
      component: StoryEditor
    },
    {
      path: '/blogs/new',
      name: 'NewBlog',
      component: BlogEditor
    },
    {
      path: '/blogs/:id',
      name: 'EditBlog',
      component: BlogEditor
    },
    {
      path: '/people',
      name: 'PeopleManager',
      component: PeopleManager
    }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')

