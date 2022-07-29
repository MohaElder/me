<template>
  <!--
  TODO: A webgl based image viewer
  1. Video Background + 3d Foreground
  2. 3D Image Frame, frame changes based on different image aspect ratio
  3. Interactive, can switch image

  Should have multiple scenes in the future

  Scene1: Gallery
  Scene2: Sea

  Scene1: Gallery
  Light: Spotlight from upper right angle
  kaideng guandeng + yinxiao jiaohu
  
-->
  <v-container>

    <v-overlay :value="previewPic">
      <v-img :src="activeImage" :max-width="$vuetify.breakpoint.width * 0.8"
        :max-height="$vuetify.breakpoint.height * 0.8" contain @click="previewPic = false"></v-img>
      <v-btn style="margin-top: 10px" @click="download">download</v-btn>
    </v-overlay>
    <v-btn @click="unity = !unity">switch</v-btn>
    <span v-if="unity">
      <v-row justify="center" style="padding: 30px">
        <p style="width: 100%; text-align: start">
          <b>USING MY PHOTO</b>
          <br>
          non-commercial: Please give credit to the name "Yasushi Oh" or
          "Anzhi Weng" or "翁安志" or "お やすし" (your choice :))
          <br>
          <a style="color: white"
            href="mailto:calen0909@hotmail.com?subject=Photo Commercial Usage Request&body=(Thank you for showing interest in my photo! Please address your usage and attach the photo that you want to use)">commercial</a>
        </p>
      </v-row>
      <v-row justify="center" style="padding: 30px" class="d-flex child-flex">
        <v-col style="display: flex; width: 50%; justify-content: center" v-for="img in images" v-bind:key="img">
          <v-img :aspect-ratio="5 / 4" :width="500" :src="img" contain @click="showPic(img)"></v-img>
        </v-col>
      </v-row>
    </span>
    <span v-else>
      <!-- <canvas id="unity-canvas" width=960 height=600 style="width: 960px; height: 600px; background: #1F1F20"></canvas> -->
      <div style="width: 800px; height: 600px; border: 1px solid #f00">
        <canvas id="canvas" ref="canvas" style="width: 100%; height: 100%" />
      </div>
    </span>

  </v-container>
</template>

<script>
import { images } from "../utils/imageLink.js";
import UnityWebgl from 'unity-webgl'

export default {
  name: "Photos",

  components: {

  },

  mounted() {
    this.images = images;

    let UnityContext = new UnityWebgl('#canvas', {
      loaderUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/Output.loader.js",
      dataUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/Output.data",
      frameworkUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/Output.framework.js",
      codeUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/Output.wasm",
    })

    this.$once('hook:beforeDestroy', function () {
      UnityContext.destroy()
      UnityContext = null
    })
  },

  data: () => ({
    images: ["../images/_DSF4726.jpg"],
    previewPic: false,
    activeImage: "",
    unity: false,
  }),
  methods: {
    showPic(img) {
      this.activeImage = img;
      this.previewPic = true;
    },
    download() {
      window.open(this.activeImage);
    }
  },
};
</script>