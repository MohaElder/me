<template>
  <v-container class="pl-lg pr-lg pb-lg">
    <v-row class="mb-lg">
      <v-col class="text-center head-section" cols="12">
        <h1 class="blog-title">{{ blog.title }}</h1>
        <div class="sub-header">
          <v-btn v-for="icon in icons" :key="icon" class="text-white" @click="share(icon.substring(4))" icon>
            <!-- We use substring above because icons come with names of "mdi-name_of_website", by doing so, we just get the name of the link -->
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
          <figure>
            <v-img class="w-full" :src="blog.img"></v-img>
            <figcaption>{{ blog.img_caption }}</figcaption>
          </figure>
          <h2 class="w-full mt-sm blog-date">By MohaElder</h2>
          <h2 class="w-full blog-date">{{ blog.date }}</h2>
        </div>
      </v-col>
    </v-row>
    <div class="blog-renderer" v-html="fileContent"></div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineOptions } from 'vue'
import { useRoute } from 'vue-router'
import { blogs } from "../utils/blogLink.js"
import MarkdownIt from "markdown-it"

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

const route = useRoute()
const icons = ref([
  "mdi-link-box-variant-outline",
  "mdi-twitter",
  "mdi-linkedin",
  "mdi-facebook",
])
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

const share = (name: string) => {
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
  if (isBlogValid(id)) {
    blog.value = blogs[id]
    getContent()
  } else {
    fileContent.value = blog.value.article
  }
})
</script>

<style>
figcaption {
  color: var(--color-content-quaternary, #b7b7b7);
  font-family: nyt-imperial, georgia, 'times new roman', times, serif;
  margin: 10px 0px 10px;
  text-align: left; 
}

.sub-header {
  width: 100%;
  border-top: 1px solid #9d9d9d;
  padding-top: 20px;
  display: flex;
  align-items: start;
  flex-wrap: wrap;
}

.middle {
  /* Center child horizontally*/
  display: flex;
  justify-content: center;
}

a {
  color: rgb(170, 218, 250);
}

code {
  background-color: #313131 !important;
  color: rgb(170, 218, 250);
  font-family: "Courier New", Courier, monospace;
}

h2 {
  font-weight: 900;
  font-style: italic;
  margin-bottom: 0.5rem;
}

p {
  /* text-indent: 2%; */
  line-height: 1.875rem;
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 0.9375rem;
}

ol {
  padding: 0.9375rem;
}

li {
  font-size: 1.0625rem;
  line-height: 1.5rem;
  margin-bottom: 0.6375rem;
}

h1 {
  padding-top: 20px;
  margin-bottom: 1.875rem;
  font-weight: 500;
  font-size: 180%;
}

blockquote {
  font-size: 130%;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: 600;
  /* padding: 5px; */
}

.md-img {
  margin-top: 20px;
  width: 100%;
}

.head-section {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>