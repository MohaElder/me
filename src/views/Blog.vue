<template>
  <div class="container pl-lg pr-lg pb-lg">
    <div class="mb-lg text-center head-section">
      <h1 class="blog-title">{{ blog.title }}</h1>
      <div class="sub-header">
        <button v-for="icon in icons" :key="icon" type="button" class="share-btn" :aria-label="`Share: ${icon}`"
          @click="share(icon)">
          <Icon :name="icon" />
        </button>
        <figure>
          <img class="w-full" :src="blog.img" alt="">
          <figcaption>{{ blog.img_caption }}</figcaption>
        </figure>
        <h2 class="w-full mt-sm blog-date">By MohaElder</h2>
        <h2 class="w-full blog-date">{{ blog.date }}</h2>
      </div>
    </div>
    <div class="blog-renderer" v-html="fileContent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineOptions } from 'vue'
import { useRoute } from 'vue-router'
import { blogs } from "../utils/blogLink.js"
import { stories } from "../utils/storyLink.js"
import MarkdownIt from "markdown-it"
import Icon from '../components/Icon.vue'

defineOptions({
  name: 'Blog'
})

interface BlogData {
  title: string
  article: string
  img: string
  img_caption: string
  date?: string
  color?: string
  brief?: string
}

// Type guard to check if a blog exists
const isBlogValid = (id: string): id is keyof typeof blogs => {
  return id in blogs
}

// Type guard to check if a story exists
const isStoryValid = (id: string): id is keyof typeof stories => {
  return id in stories
}

const route = useRoute()
const icons = ["link-box-variant-outline", "twitter", "linkedin", "facebook"] as const
const copied = ref(false)
const blog = ref<BlogData>({
  title: "42",
  article: "# Whoops! Seems like you have reached a nonexisting article ;)",
  img: "",
  img_caption: "",
})
const fileContent = ref<string | null>(null)

const rendered = (e: string): string => {
  const lines = e.split("\n")
  for (let i = 0; i < lines.length; i++) {
    const element = lines[i]
    if (element.includes("<img")) {
      const idx = element.indexOf("<img")
      const startPos = idx + 10
      const endPos = element.indexOf('"', startPos)
      const src = element.slice(startPos, endPos)
      const lst = element.split("")
      lst[idx + 3] += ` class='md-img' onclick='view("${src}")'`
      lines[i] = lst.join("")
    }
  }
  return lines.join("\n")
}

const getContent = () => {
  fileContent.value = "rendering "
  fetch(blog.value.article)
    .then((response) => response.text())
    .then((data) => {
      const ret = data
        .split("../assets")
        .join("https://cdn.jsdelivr.net/gh/mohaelder/me/src/assets")
      const md = new MarkdownIt("commonmark")
      fileContent.value = rendered(md.render(ret))
    })
}

const share = (name: typeof icons[number]) => {
  const link = window.location.href
  switch (name) {
    case "link-box-variant-outline":
      navigator.clipboard.writeText(link)
      break
    case "twitter":
      window.open(
        `http://twitter.com/share?text=${blog.value.title}&url=${link}`
      )
      break
    case "linkedin":
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${link}`
      )
      break
    case "facebook":
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${link}`)
      break
  }
  copied.value = true
}

onBeforeMount(() => {
  window.scrollTo(0, 0)
  const id = route.query.id as string
  const isStoryRoute = route.name === 'Story'
  
  if (isStoryRoute && isStoryValid(id)) {
    // Loading a story
    const story = stories[id]
    blog.value = {
      title: story.title,
      article: story.article,
      img: "",
      img_caption: "",
      date: "",
    }
    getContent()
  } else if (isBlogValid(id)) {
    // Loading a blog
    blog.value = blogs[id]
    getContent()
  } else {
    fileContent.value = blog.value.article
  }
})
</script>

<style scoped>
.share-btn {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #FFF;
  transition: background-color 0.2s;
}

.share-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
</style>
