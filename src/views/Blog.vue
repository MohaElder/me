<template>
  <div class="container pl-lg pr-lg pb-lg">
    <div class="mb-lg text-center head-section">
      <h1 class="blog-title">{{ blog.title }}</h1>
      <div class="sub-header">
        <button v-for="icon in icons" :key="icon" type="button" class="share-btn" :aria-label="`Share: ${icon}`"
          @click="share(icon)">
          <Icon :name="icon" />
        </button>
        <figure v-if="blog.cover">
          <img class="w-full" :src="blog.cover" :alt="blog.title">
          <figcaption>{{ blog.coverCaption }}</figcaption>
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
import blogs from '../content/blogs.json'
import stories from '../content/stories.json'
import { renderArticle } from '../article'
import Icon from '../components/Icon.vue'

defineOptions({
  name: 'Blog'
})

// Each article is its own chunk, loaded when it's opened.
const bodies = import.meta.glob<string>(['../blogs/*.md', '../stories/*.md'], { query: '?raw', import: 'default' })

const route = useRoute()
const icons = ["link-box-variant-outline", "twitter", "linkedin", "facebook"] as const
const copied = ref(false)
const blog = ref<{ title: string, cover?: string, coverCaption?: string, date?: string }>({ title: "42" })
const fileContent = ref<string | null>(null)

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

onBeforeMount(async () => {
  window.scrollTo(0, 0)
  const id = route.query.id as string
  const kind = route.name === 'Story' ? 'stories' : 'blogs'
  const entry = (kind === 'stories' ? stories : blogs).find(a => a.id === id && a.published)
  const load = bodies[`../${kind}/${id}.md`]
  if (!entry || !load) {
    fileContent.value = renderArticle("# Whoops! Seems like you have reached a nonexisting article ;)")
    return
  }
  blog.value = entry
  document.title = `${entry.title} · Yasushi Oh`
  fileContent.value = renderArticle(await load())
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
