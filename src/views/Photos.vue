<template>
  <v-container>
    <v-overlay :value="previewPic">
      <v-img :src="activeImage" :max-width="$vuetify.breakpoint.width * 0.8"
        :max-height="$vuetify.breakpoint.height * 0.8" contain @click="previewPic = false"></v-img>
      <v-btn style="margin-top: 10px" @click="download">download</v-btn>
    </v-overlay>
    <v-row justify="center" style="padding: 30px">
      <p style="width: 100%; text-align: start">
        <b>{{ $t("message.using_my_photo") }}</b>
        <br>
        {{ $t("message.photo_usage_note") }}
        <br>
        <a style="color: white"
          href="mailto:calen0909@hotmail.com?subject=Photo Commercial Usage Request&body=(Thank you for showing interest in my photo! Please address your usage and attach the photo that you want to use)">
          {{ $t("message.commercial") }}</a>
      </p>
    </v-row>
    <v-row justify="start" style="padding: 30px">
      <p style="width: 100%; text-align: start">{{ $t("message.web_gl_gallery_note") }}</p>
      <v-switch v-model="unity" color="primary" value="primary" label="GALLERY MODE"></v-switch>
    </v-row>

    <span v-if="!unity">
      <v-row justify="start" style="padding: 30px">
        <div v-for="tag in tags" v-bind:key="tag" style="margin-right: 10px;">
          <v-chip @click="appendTag(tag)">
            {{ tag }}
          </v-chip>
        </div>
        <v-btn @click="sortImages(order)" icon color="white">
          <v-icon>mdi-swap-vertical</v-icon>
        </v-btn>
      </v-row>

      <v-row justify="start" style="padding-left: 30px">
        <div v-for="tag in activeTags" v-bind:key="tag" style="margin-right: 10px;">
          <v-chip @click:close="removeTag(tag)" color="#ffd738" dark close style="color: black">
            {{ tag }}
          </v-chip>
        </div>
      </v-row>

      <v-row justify="center" style="padding: 30px" class="d-flex child-flex">
        <v-col style="display: flex; width: 50%; justify-content: center" v-for="img in images" v-bind:key="img['url']">
          <v-img :aspect-ratio="5 / 4" :width="500" :src="img['url']" contain @click="showPic(img['url'])"></v-img>
        </v-col>
      </v-row>
    </span>
    <span v-else>
      <iframe mozallowfullscreen="true" src="https://mohaelder.github.io/Gallery/" scrolling="no" frameborder="0"
        :width="$vuetify.breakpoint.width * 0.8 + 'px'" :height="$vuetify.breakpoint.height * 0.8 + 'px'"></iframe>
    </span>
  </v-container>
</template>

<script>
import { images as images_imported, tags } from "../utils/imageLink.json"

var images_sorted = []

export default {
  name: "Photos",
  mounted() {
    this.tags = tags
    this.sortImages("latest", Object.values(images_imported))

  },
  data: () => ({
    order: "",
    images: ["../images/_DSF4726.jpg"],
    tags: [],
    activeTags: [],
    previewPic: false,
    activeImage: "",
    unity: false,
  }),
  methods: {
    showPic(img) {
      this.activeImage = img
      this.previewPic = true
    },
    download() {
      window.open(this.activeImage)
    },
    sortImages(method, images = []) {
      if (images_sorted.length == 0) {
        images_sorted = images.sort(function (a, b) { return a["DateTime"] - b["DateTime"] })
        this.images = images_sorted
      }
      else {
        this.images.reverse()
      }
    },
    appendTag(name) {
      if (!this.activeTags.includes(name)) {
        this.activeTags = [
          ...this.activeTags,
          name
        ]
        this.filterImages()
      }
    },

    removeTag(name) {
      let tags = this.activeTags
      tags.splice(name, 1)
      this.activeTags = [...tags]
      this.filterImages()
    },

    filterImages() {
      let images = images_sorted.filter((img) => {
        for (let i in this.activeTags) {
          if (!img["Tags"].includes(this.activeTags[i])) {
            console.log(this.activeTags[i])
            return false
          }
        }
        return true
      })
      this.images = images;
    }
  },
};
</script>