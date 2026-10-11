// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import { titleOf } from '../seo'
// import Guide from '../views/Guide.vue'

const routes = [
  {
    path: '/',
    name: 'Hi',
    component: Home
  },
  {
    path: '/work',
    name: 'Work',
    component: () => import('../views/Work.vue')
  },
  {
    path: '/opensource',
    name: 'OpenSource',
    component: () => import('../views/OpenSource.vue')
  },
  {
    path: '/Recipe',
    name: 'Recipe',
    component: () => import('../views/Recipe.vue')
  },
  {
    path: '/photos',
    name: 'Photos',
    component: () => import('../views/Photos.vue')
  },
  {
    path: '/series/:id',
    name: 'Series',
    component: () => import('../views/SeriesPage.vue')
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: () => import('../views/Blogs.vue')
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue')
  },
  {
    path: '/story',
    name: 'Story',
    component: () => import('../views/Blog.vue')  // Reusing Blog component for stories
  },
  {
    path: '/final_words',
    name: 'IfIDie',
    component: () => import('../views/IfIDie.vue')
  },
  {
    path: '/nothing-to-lose',
    name: 'NothingToLose',
    component: () => import('../views/NothingToLose.vue')
  },
  {
    path: '/land-embodied',
    name: 'LandEmbodied',
    component: () => import('../views/LandEmbodied.vue')
  },
  {
    path: '/art',
    name: 'Exhibitions',
    component: () => import('../views/Art.vue')
  },
  {
    path: '/interesting-people',
    name: 'InterestingPeople',
    component: () => import('../views/InterestingPeople.vue')
  },
  {
    path: '/letter-to-future-ai',
    name: 'LetterToFutureAI',
    component: () => import('../views/LetterToFutureAI.vue')
  },
  // {
  //   path: '/guide',
  //   name: 'Guide',
  //   component: Guide
  // },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(to => {
  document.title = titleOf(to.path.slice(1).replace(/\/$/, ''))
})

export default router
