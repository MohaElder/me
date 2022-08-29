import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Work from '../views/Work.vue'
import Receipt from '../views/Receipt.vue'
import Photos from '../views/Photos.vue'
import Blogs from '../views/Blogs.vue'
import Blog from '../views/Blog.vue'
import IfIDie from '../views/IfIDie.vue'
import OpenSource from '../views/OpenSource.vue'

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
    path: '/opensource',
    name: 'OpenSource',
    component: OpenSource
  },
  {
    path: '/Receipt',
    name: 'Receipt',
    component: Receipt
  },
  {
    path: '/photos',
    name: 'Photos',
    component: Photos
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/final_words',
    name: 'IfIDie',
    component: IfIDie
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router

