<template>
  <v-container>
    <v-overlay :value="previewPic" @click="previewPic = false">
      <v-img :src="activeImage" :max-width="$vuetify.breakpoint.width * 0.8" :max-height="$vuetify.breakpoint.height * 0.8"></v-img>
    </v-overlay>
    <v-row justify="center" style="color: white; padding: 30px">
      <h3 style="text-align: start; width: 100%">To use my photo:</h3>
      <div style="width: 100%; text-align: start">
        <b>non-commercial:</b> Please give credit to the name "Yasushi Oh" or
        "Anzhi Weng" or "翁安志" or "お やすし" (your choice :))
      </div>
      <b style="width: 100%; text-align: start"
        ><a
          style="color: white;"
          href="mailto:calen0909@hotmail.com?subject=Photo Commercial Usage Request&body=(Thank you for showing interest in my photo! Please address your usage and attach the photo that you want to use)"
          >commercial</a
        ></b
      >
    </v-row>
    <v-row justify="center" style="color: white; padding: 30px" class="d-flex child-flex">
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