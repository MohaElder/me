<template>
  <div>
    <h1 class="blogs-title">
      <span class="text-secondary">{{ $t("message.share") }}</span> /
      <span class="text-primary">{{ $t("message.life") }}</span> /
      <span class="text-accent">{{ $t("message.comments") }}</span>
    </h1>
    <v-container class="mt-md">
      <v-row>
        <v-col v-for="(item, key) in items" :key="key" :cols="$vuetify.display.mobile ? 12 : 6"
          :class="$vuetify.display.mobile ? 'pl-lg pr-lg' : ''">
          <v-card class="mx-auto" max-width="600" :color="item.color" @click="travel(item.id)">
            <v-img class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="300px" cover :src="item.img">
              <v-card-title class="text-white">{{ item.title }}</v-card-title>
            </v-img>

            <v-card-text class="text--primary">
              <span :style="
                'color: ' + (item.color == '#ffee58' ? 'black;' : 'white;')
              ">
                {{ item.brief }}</span>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, defineOptions } from 'vue'
import { useRouter } from 'vue-router'
import { blogs } from "../utils/blogLink.js"

defineOptions({
  name: 'Blogs'
})

interface BlogItem {
  color: string
  img: string
  title: string
  brief: string
  id: string
}

const router = useRouter()
const items = ref<BlogItem[]>([{
  color: "#1F7087",
  img: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
  title: "Default Blog",
  brief: "Default Blog",
  id: "a3c8-8992",
}])

const travel = (blogId: string) => {
  router.push({ name: "Blog", query: { id: blogId } })
}

onBeforeMount(() => {
  window.scrollTo(0, 0)
  items.value = Object.entries(blogs).map(([id, blog]) => ({
    ...blog,
    id
  }))
})
</script>

<style>
.blogs-title {
  font-family: "Helvetica Neue";
  font-size: 70px;
  font-weight: 700;
  letter-spacing: -2.8px;
  text-align: center;
  margin-bottom: 40px;
}

@media (max-width: 768px) {
  .blogs-title {
    font-size: 24px;
    letter-spacing: -0.8px;
  }
}
</style>