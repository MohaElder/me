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
        <h1 id="name" style="font-size: 100px" class="foreground">
          {{ activeName }}
        </h1>
      </v-col>
    </v-row>
    <div class="second">
      <v-row align="center" justify="center">
        <v-col class="text-center second" cols="12">
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
          <h1 id="name" style=" font-size: 100px">aaaaa</h1>
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

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

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
  beforeMount() {},
  mounted() {
    var index = 0;
    setInterval(() => {
      animateCSS("#name", "fadeIn");
      index = index + 1 == names.length ? 0 : index + 1;
      this.activeName = names[index];
    }, 2500);
    this.loadImages();
  },
  methods: {
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
      images[index].setAttribute("style", "opacity: " + index / 80);
      this.blur = "filter: blur(" + (8 - index / 10) + "px)";
    },
  },
};
</script>

<style>
.foreground {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -100px; /* Negative half of height. */
  margin-left: -250px; /* Negative half of width. */
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
</style>
