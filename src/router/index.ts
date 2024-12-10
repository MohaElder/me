// Composables
import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Work from '../views/Work.vue'
import Recipe from '../views/Recipe.vue'
import Photos from '../views/Photos.vue'
import Blogs from '../views/Blogs.vue'
import Blog from '../views/Blog.vue'
import IfIDie from '../views/IfIDie.vue'
import OpenSource from '../views/OpenSource.vue'
// import Guide from '../views/Guide.vue'
import NothingToLose from '../views/NothingToLose.vue'

const appRoot = '/me';

const routes = [
  {
    path: appRoot + '/',
    name: 'Hi',
    component: Home
  },
  {
    path: appRoot + '/work',
    name: 'Work',
    component: Work
  },
  {
    path: appRoot + '/opensource',
    name: 'OpenSource',
    component: OpenSource
  },
  {
    path: appRoot + '/Recipe',
    name: 'Recipe',
    component: Recipe
  },
  {
    path: appRoot + '/photos',
    name: 'Photos',
    component: Photos
  },
  {
    path: appRoot + '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: appRoot + '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: appRoot + '/final_words',
    name: 'IfIDie',
    component: IfIDie
  },
  {
    path: appRoot + '/nothing-to-lose',
    name: 'NothingToLose',
    component: NothingToLose
  },
  // {
  //   path: '/guide',
  //   name: 'Guide',
  //   component: Guide
  // },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
