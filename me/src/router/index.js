import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Work from '../views/Work.vue'
import Life from '../views/Life.vue'
import Photos from '../views/Photos.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Hi',
    component: Home
  },
  {
    path: '/work',
    name: 'Work',
    component: Work
  },
  {
    path: '/life',
    name: 'Life',
    component: Life
  },
  {
    path: '/photos',
    name: 'Photos',
    component: Photos
  },
]

const router = new VueRouter({
  mode : 'hash',
  routes
})

export default router

