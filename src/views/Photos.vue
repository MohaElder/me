<template>
  <v-container>
    <v-overlay :value="previewPic" @click="previewPic = false">
      <v-img :src="activeImage" :width="2000"></v-img>
    </v-overlay>
    <v-row justify="center" style="color: white; padding: 30px">
      <v-col
        style="display: flex; width: 50%; justify-content: center"
        v-for="img in images"
        v-bind:key="img"
        ><v-img
          :aspect-ratio="5 / 4"
          :width="500"
          :src="img"
          contain
          @click="showPic(img)"
        ></v-img
      ></v-col>
    </v-row>
  </v-container>
</template>

<script>
import { images } from "../utils/imageLink.js";

export default {
  name: "Photos",

  mounted() {
    this.images = images;
  },

  data: () => ({
    images: ["../images/_DSF4726.jpg"],
    previewPic: false,
    activeImage: "",
  }),
  methods: {
    showPic(img) {
      this.activeImage = img;
      this.previewPic = true;
    },
  },
};
</script>