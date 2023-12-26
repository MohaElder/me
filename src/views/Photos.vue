<template>
  <v-container>
    <v-overlay scrim="black" class="align-center justify-center black-overlay" v-model="previewPic">
      <v-img class="mx-auto" :src="activeImage['url']" :lazy-src="activeImage['thumbnail']"
        :width="$vuetify.display.width * 0.8" :height="$vuetify.display.height * 0.8" contain @click="previewPic = false">
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
          </div>
        </template>
      </v-img>
      <div class="image-info-box">
        <p class="camera-text">Camera: {{ activeImage['Camera'] }}</p>
        <v-btn color="primary" @click="downloadDialog = true">download</v-btn>
      </div>
    </v-overlay>
    <v-row v-if="!isPortrait()" justify="start" style="padding: 30px">
      <div class="galleryModeWrapper">
        <span class="aSkyFullOfStars">A <span
            :style="unity ? 'transition: color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);' : 'color:#6987B2; transition: color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);'">SKY</span>
          FULL OF <span
            :style="unity ? 'transition: color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);' : 'color:#FDDA3A; transition: color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);'">STARS</span></span>
        <div class="toggleWrapper">
          <input type="checkbox" class="dn" id="dn" v-model="unity" />
          <label for="dn" class="toggle">
            <span class="toggle__handler">
              <!-- SVG or image for the night state -->
              <img src="../assets/moon.svg" alt="Night" class="icon-night-style icon-night" />
              <!-- SVG or image for the day state -->
              <img src="../assets/pipe.svg" alt="Day" class="icon-day-style icon-day" />
            </span>
          </label>
        </div>
        <span class="notAPipe">Ceci n'est pas une <span
            :style="!unity ? 'transition: color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);' : 'color:#FDDA3A; transition: color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);'">galerie</span></span>
      </div>
    </v-row>


    <v-dialog v-model="downloadDialog" width="auto">
      <v-card>
        <v-card-title>{{ $t("message.using_my_photo") }}</v-card-title>
        <v-card-text>
          {{ $t("message.photo_usage_note") }}
          <br>
          <a style="color: white"
            href="mailto:calen0909@hotmail.com?subject=Photo Commercial Usage Request&body=(Thank you for showing interest in my photo! Please address your usage and attach the photo that you want to use)">
            {{ $t("message.commercial") }}</a>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="download">{{ $t("message.download_picture") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <transition name="fade">
      <span v-if="!unity">
        <v-row justify="start" class="chip-wrapper" :style="isPortrait()? 'width:100%' : 'width: 50%;'">
          <div v-for="tag in tags" v-bind:key="tag" class="chip">
            <v-chip @click="appendTag(tag)">
              {{ tag }}
            </v-chip>
          </div>
          <v-btn @click="sortImages(false, order)" icon="mdi-swap-vertical">
          </v-btn>
        </v-row>
        <v-row justify="start" class="chip-wrapper" :style="isPortrait()? 'width:100%' : 'width: 50%;'">
          <div v-for="tag in activeTags" v-bind:key="tag" class="chip">
            <v-chip @click:close="removeTag(tag)" color="primary" closable>
              {{ tag }}
            </v-chip>
          </div>
        </v-row>

        <div class="image-gallery">
          <div v-for="img in images" v-bind:key="img['url']" class="image-container">
            <img v-lazy="img['thumbnail']" @click="showPic(img)" class="gallery-image" />
          </div>
        </div>

        <!-- <v-row justify="center" class="d-flex child-flex">
        <v-col style="display: flex; width: 50%; justify-content: center" v-for="img in images" v-bind:key="img['url']">
          <v-img :aspect-ratio="5 / 4" :width="500" :src="img['thumbnail']" contain @click="showPic(img)"></v-img>
        </v-col>
      </v-row> -->

      </span>
      <span v-else>
        <iframe id="fullscreen-iframe" mozallowfullscreen="true" src="https://mohaelder.github.io/Gallery/" scrolling="no"
          frameborder="0"></iframe>
      </span>
    </transition>
  </v-container>
</template>

<style scoped>
.image-info-box {
  display: flex;
  animation: fadeIn;
  animation-duration: 3s;
  flex-wrap: wrap;
  flex-direction: row-reverse;
}
</style>

<script>
import { images as images_imported, tags } from "../utils/imageLink.json"
import 'animate.css';

var images_sorted = []

export default {
  name: "Photos",
  mounted() {
    window.scrollTo(0, 0);
    this.tags = tags.sort();
    this.images = Object.values(images_imported);
    this.sortImages(true, this.images)
  },
  data: () => ({
    order: "",
    images: ["../images/_DSF4726.jpg"],
    tags: [],
    activeTags: [],
    previewPic: false,
    activeImage: "",
    unity: false,
    downloadDialog: false,
    // showLoadingOverlay: false,
  }),
  // watch: {
  //   unity(newVal, oldVal) {
  //     // this.showLoadingOverlay = true;
  //     // setTimeout(() => {
  //     //   this.showLoadingOverlay = false;
  //     // }, 2000);
  //   }
  // },
  methods: {
    isPortrait() {
      return this.$vuetify.display.mobile
    },
    showPic(img) {
      this.activeImage = img
      this.previewPic = true
    },
    getDate(timestamp) {
      let date = new Date(timestamp)
      return date.getFullYear() +
        "/" + (date.getMonth() + 1) +
        "/" + date.getDate()
    },
    download() {
      this.downloadDialog = false;
      window.open(this.activeImage['url']);
    },
    sortImages(AlwaysNewToOld = false, images = []) {
      if (images_sorted.length == 0 || AlwaysNewToOld) {
        images_sorted = images.sort(function (a, b) { return b["DateTime"] - a["DateTime"] })
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

<style lang="scss" >
.toggleWrapper {
  overflow: hidden;
  transform: scale(0.85);

  input {
    position: absolute;
    left: -99em;
  }
}

.toggle {
  cursor: pointer;
  display: inline-block;
  position: relative;
  width: 90px;
  height: 50px;
  background-color: #385886;
  border-radius: 90px - 6;
  transition: background-color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

.toggle__handler {
  display: inline-block;
  position: relative;
  z-index: 1;
  top: 3px;
  left: 3px;
  width: 50px - 6;
  height: 50px - 6;
  background-color: transparent;
  border-radius: 50px;
  transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: rotate(-45deg);

  .icon-night-style {
    transition: opacity 0.4s ease;
    position: absolute;
    top: -20%;
    left: -20%;
    width: 190%;
    height: auto; // adjust as needed
  }

  .icon-day-style {
    transition: opacity 0.4s ease;
    position: absolute;
    top: 0;
    right: 0;
    width: 170%; // adjust as needed
    height: auto; // adjust as needed
  }

  .icon-night {
    opacity: 1; // visible by default
  }

  .icon-day {
    opacity: 0; // hidden by default
    display: none; // ensure it's not visible initially
  }
}

input:checked+.toggle .toggle__handler {
  .icon-night {
    opacity: 0;
    display: none; // hide night image
  }

  .icon-day {
    opacity: 1;
    display: block; // show day image
  }
}


input:checked {
  +.toggle {
    background-color: #ffffff;

    &:before {
      color: #749ED7;
    }

    &:after {
      color: #ffffff;
    }

    .toggle__handler {
      background-color: transparent;
      transform: translate3d(40px, 0, 0) rotate(0);

      .crater {
        opacity: 1;
      }
    }
  }
}

.aSkyFullOfStars {
  color: #FFF;
  font-size: 18px;
  font-style: normal;
  line-height: normal;
  letter-spacing: 2.5px;
}

.notAPipe {
  color: #FFF;
  font-family: La Belle Aurore;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.galleryModeWrapper {
  padding-left: 5px;
  display: flex;
  align-items: center;
  gap: 23px;
}

.chip-wrapper {
  padding-left: 30px;
  flex-wrap: wrap;
}

.chip {
  margin-right: 10px;
  margin-bottom: 10px;
}

#fullscreen-iframe {
  width: 80vw;
  /* 100% of the viewport width */
  height: 100vh;
  /* 100% of the viewport height */
  border-radius: 25px;
  /* Adjust the px value to increase or decrease the roundness */
  border: none;
  /* This should be at least as large as the largest blur radius of the shadow. */
  background: transparent;
}

.image-gallery {
  padding-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-container {
  margin: 5px;
  flex-grow: 1;
}

.gallery-image {
  width: 100%;
  height: auto;
  cursor: pointer;
  object-fit: cover;
  /* Optional: if you want images to cover the area */
}

.camera-text {
  margin-top: 5px;
  color: #ffffff;
  width: 100%;
  text-align: end;
  font-size: 1.1rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

</style>