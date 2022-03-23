<template>
  <div class="home-container">
    <div id="father" class="animated-image" :style="blur">
      <img
        src="../assets/beachFrame/frame (1).jpg"
        alt=""
        class="each-image"
        :style="opacity"
      />
    </div>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1
          id="name"
          class="foreground"
          :style="'font-size:' + calcSize() + 'px'"
        >
          {{ activeName }}
        </h1>
      </v-col>
    </v-row>
    <div class="second">
      <v-row align="center" justify="center">
        <v-col class="text-center second intro" :style="'top: ' +
              ($vuetify.breakpoint.width < $vuetify.breakpoint.height
                ? '11.5%;'
                : '10.5%;')" cols="12">
          <v-img src="../assets/bak.png" class="bak"></v-img>
          <h3
            class="intro-text"
            :style="
              'font-size: ' +
              ($vuetify.breakpoint.width < $vuetify.breakpoint.height
                ? '50%;'
                : '100%;') +
              'padding-left: ' +
              ($vuetify.breakpoint.width < $vuetify.breakpoint.height
                ? '10%;'
                : '30%;') +
              'padding-right: ' +
              ($vuetify.breakpoint.width < $vuetify.breakpoint.height
                ? '10%;'
                : '30%;')"
          >
            Hi, I'm glad that you are here. If you are interested in my
            profesional background, please press WORK; if you are interested in
            knowing me more, please press LIFE; if you are interested in the
            pictures that I took, please press PHOTOS; if you are interested in
            my writings, please press BLOGS. Have a wonderful day and please
            scroll down to feel some beautiful waves🌊
          </h3>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import "animate.css";
//import { printf } from "../utils/dev.js";
// @ is an alias to /src

var images = [];
const names = ["翁安志", "お やすし", "Yasushi Oh"];

const animateCSS = (element, animation, time_interval, prefix = "animate__") =>
  // We create a Promise and return it
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);
    if (node == null) {
      clearInterval(time_interval);
      resolve("Page not active");
    }
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

export default {
  name: "Home",
  components: {},
  data: () => ({
    activeName: "翁安志",
    blur: "filter: blur(10px)",
    opacity: "opacity: 0",
  }),
  created() {
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  beforeMount() {
    var index = 0;
    var time = setInterval(() => {
      animateCSS("#name", "fadeIn", time);
      index = index + 1 == names.length ? 0 : index + 1;
      this.activeName = names[index];
    }, 2500);
    this.loadImages();
  },
  methods: {
    calcSize() {
      return this.$vuetify.breakpoint.width < this.$vuetify.breakpoint.height
        ? this.$vuetify.breakpoint.width * 0.08
        : this.$vuetify.breakpoint.width * 0.05;
    },
    loadImages() {
      for (let i = 1; i < 108; i++) {
        let img = new Image();
        img.src = require("../assets/beachFrame/frame (" + i + ").jpg");
        images.push(img);
      }
    },
    handleScroll() {
      var index = Math.floor(window.scrollY / 72) % 108;
      var father = document.querySelector("#father");
      father.children[0].replaceWith(images[index]);
      images[index].classList.add("each-image");
      images[index].setAttribute("style", "opacity: " + index / 30);
      this.blur = "filter: blur(" + (8 - index / 7) + "px)";
    },
  },
};
</script>

<style>
.foreground {
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
}

.animated-image {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.each-image {
  width: 100%;
  height: 100%;
}

.second {
  z-index: 1;
}

.home-container {
  height: 500vh;
}

* {
  box-sizing: border-box;
}

.intro {
  width: 95%;
  margin: 0;
  position: absolute;
  left: 50.5%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}

.bak {
  width: 62.5%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.intro-text {
  font-weight: 300;
  text-align: justify;
  text-indent: 2%;
  line-height: 2;
}
</style>
