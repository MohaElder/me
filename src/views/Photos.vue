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
    <p>Note: Gallery Mode is a new way to view my pictures via a three dimensional interactive interface. Feel free to
      call it Web3.0 if you like ;) <br /> It's like a little "game" embed inside this web page. It only supports
      Desktop users for now(and Pad users too), but there will be a mobile version in the near future. <br /> Gallery
      Mode costs some data, so check it out with Wi-Fi!</p>
    <p>注意: Gallery Mode 是一个全新的通过3D立体可交互界面浏览我的照片的方式。如果您想称它为Web3.0, 请便;) <br />
      它算是一个网页当中的“小游戏”。目前画廊模式只支持桌面端(和Pad端),移动端支持将在不久的将来发布。<br /> 此模式将消耗一定流量, 请保证您在Wi-Fi下体验!</p>
    <v-switch v-model="unity" color="primary" value="primary" label="GALLERY MODE"></v-switch>
    <span v-if="!unity">

      <v-row justify="center" style="padding: 30px" class="d-flex child-flex">
        <v-col style="display: flex; width: 50%; justify-content: center" v-for="img in images" v-bind:key="img">
          <v-img :aspect-ratio="5 / 4" :width="500" :src="img" contain @click="showPic(img)"></v-img>
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