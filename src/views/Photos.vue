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

    <Unity :unity="unityContext" width="1920px" height="1080px" />

    <v-overlay :value="previewPic">
      <v-img
        :src="activeImage"
        :max-width="$vuetify.breakpoint.width * 0.8"
        :max-height="$vuetify.breakpoint.height * 0.8"
        contain
        @click="previewPic = false"
      ></v-img>
      <v-btn style="margin-top: 10px" @click="download">download</v-btn>
    </v-overlay>
    <v-row justify="center" style="padding: 30px">
      <p style="width: 100%; text-align: start">
        <b>USING MY PHOTO</b>
        <br>
        non-commercial: Please give credit to the name "Yasushi Oh" or
        "Anzhi Weng" or "翁安志" or "お やすし" (your choice :))
        <br>
        <a
          style="color: white"
          href="mailto:calen0909@hotmail.com?subject=Photo Commercial Usage Request&body=(Thank you for showing interest in my photo! Please address your usage and attach the photo that you want to use)"
          >commercial</a
        >
      </p>
    </v-row>
    <v-row justify="center" style="padding: 30px" class="d-flex child-flex">
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
// import {createUnityInstance} from "../assets/gallery/Build/GallerOutput.loader.js";
import UnityWebgl from 'unity-webgl';

const Unity = new UnityWebgl({
  //remember to unzip the files
  loaderUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/Output.loader.js",
  dataUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/webgl.data",
  frameworkUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/build.framework.js",
  codeUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/Build/build.wasm",
  streamingAssetsUrl: "https://cdn.jsdelivr.net/gh/MohaElder/me/src/assets/gallery/StreamingAssets",
})
 
export default {
  name: "Photos",

  components: {
    Unity: UnityWebgl.vueComponent
  },

  mounted() {
    this.images = images;

    // createUnityInstance(document.querySelector("#unity-canvas"), {
    //     dataUrl: "../assets/gallery/Build/GallerOutput.data.gz",
    //     frameworkUrl: "../assets/gallery/Build/GallerOutput.framework.js.gz",
    //     codeUrl: "../assets/gallery/Build/GallerOutput.wasm.gz",
    //     streamingAssetsUrl: "../assets/gallery/StreamingAssets",
    //     companyName: "DefaultCompany",
    //     productName: "Gallery",
    //     productVersion: "0.1",
    //     // matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
    //     // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
    //   });
  },

  data: () => ({
    images: ["../images/_DSF4726.jpg"],
    previewPic: false,
    activeImage: "",
    unityContext: Unity,
  }),
  methods: {
    showPic(img) {
      this.activeImage = img;
      this.previewPic = true;
    },
    download(){
      window.open(this.activeImage);
    }
  },
};
</script>