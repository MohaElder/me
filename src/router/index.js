import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Work from '../views/Work.vue'
import Life from '../views/Life.vue'
import Photos from '../views/Photos.vue'
import Blogs from '../views/Blogs.vue'
import Blog from '../views/Blog.vue'

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
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router

