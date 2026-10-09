// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
// import Guide from '../views/Guide.vue'
const appRoot = '/me';

const routes = [
  {
    path: '/',
    redirect: appRoot + '/'
  },
  {
    path: appRoot + '/',
    name: 'Hi',
    component: Home
  },
  {
    path: appRoot + '/work',
    name: 'Work',
    component: () => import('../views/Work.vue')
  },
  {
    path: appRoot + '/opensource',
    name: 'OpenSource',
    component: () => import('../views/OpenSource.vue')
  },
  {
    path: appRoot + '/Recipe',
    name: 'Recipe',
    component: () => import('../views/Recipe.vue')
  },
  {
    path: appRoot + '/photos',
    name: 'Photos',
    component: () => import('../views/Photos.vue')
  },
  {
    path: appRoot + '/blogs',
    name: 'Blogs',
    component: () => import('../views/Blogs.vue')
  },
  {
    path: appRoot + '/blog',
    name: 'Blog',
    component: () => import('../views/Blog.vue')
  },
  {
    path: appRoot + '/story',
    name: 'Story',
    component: () => import('../views/Blog.vue')  // Reusing Blog component for stories
  },
  {
    path: appRoot + '/final_words',
    name: 'IfIDie',
    component: () => import('../views/IfIDie.vue')
  },
  {
    path: appRoot + '/nothing-to-lose',
    name: 'NothingToLose',
    component: () => import('../views/NothingToLose.vue')
  },
  {
    path: appRoot + '/land-embodied',
    name: 'LandEmbodied',
    component: () => import('../views/LandEmbodied.vue')
  },
  {
    path: appRoot + '/art',
    name: 'Exhibitions',
    component: () => import('../views/Art.vue')
  },
  {
    path: appRoot + '/interesting-people',
    name: 'InterestingPeople',
    component: () => import('../views/InterestingPeople.vue')
  },
  {
    path: appRoot + '/letter-to-future-ai',
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
    redirect: appRoot + '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
