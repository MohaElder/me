<template>
  <div class="home-container">
    <div id="father" class="animated-image"> <!-- :style:"blur" use this if you need blur effect in the future -->
      <img src="https://cdn.jsdelivr.net/gh/mohaelder/me/src/assets/beachFrame/frame(1).jpg" alt="" class="each-image"
        style="opacity: 0" />
    </div>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 id="name" class="foreground" :style="'font-size:' + calcSize() + 'px;' +
          'padding-top: ' +
          (this.isPortrait()
            ? '15%;'
            : '0px;')">
          {{ activeName }}
        </h1>
      </v-col>
    </v-row>
    <div>
      <v-row align="center" justify="center" :style="opacity">
        <v-col class="text-center second intro" :style="
          'top: ' +
          (this.isPortrait()
            ? '11%;'
            : '10.5%;')
        " cols="12">
          <v-img src="https://cdn.jsdelivr.net/gh/mohaelder/me/src/assets/bak.png" class="bak"
            :width="isPortrait() ? '100%' : '62.5%'"></v-img>
          <h3 class="intro-text" :style="
            'font-size: ' +
            (this.isPortrait()
              ? '50%;'
              : '100%;') +
            'padding-left: ' +
            (this.isPortrait()
              ? '0%;'
              : '30%;') +
            'padding-right: ' +
            (this.isPortrait()
              ? '0%;'
              : '30%;')
          ">
            {{ $t("message.hello") }}
          </h3>
        </v-col>
      </v-row>


      <v-row class="below">
        <a style="color: white" class="" href="https://maps.app.goo.gl/f1iggnxxYjswtCLUA">N 36°14.845', W 117°21.295'<br>
          {{ $t("message.wave_location") }}</a>

      </v-row>
    </div>
  </div>
</template>

<script>
import "animate.css";
import { useDisplay } from 'vuetify'

let images = [];
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
    opacity: "opacity: 1",
    quote: "",
    quoteAuthor: "MohaElder",
    scroll_position: 0,
  }),
  created() {
    window.addEventListener("scroll", this.handleScroll);
    window.scrollTo(0, 0);
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
    isPortrait() {
      return this.$vuetify.display.mobile
    },
    calcSize() {
      const { width } = useDisplay()

      return this.isPortrait()
        ? width.value * 0.14
        : width.value * 0.05;
    },
    loadImages() {
      for (let i = this.scroll_position; i < 50; i++) {
        let img = new Image();
        //img.src = `https://cdn.jsdelivr.net/gh/mohaelder/me/src/assets/beachFrame/frame(${i + 1}).jpg`;
        img.src = `https://raw.githubusercontent.com/MohaElder/me/main/src/assets/skyFrame/Frame(${i+1}).jpeg`;
        images.push(img);
      }
    },
    handleScroll() {
      var index = Math.floor(window.scrollY / 72) % 50;
      if (index < 0) {
        return;
      }
      // if (index >= this.scroll_position + 5) {
      //   this.scroll_position = index + 5;
      //   this.loadImages();
      // }
      var father = document.querySelector("#father");
      father?.children[0].replaceWith(images[index]);
      images[index].classList.add("each-image");
      images[index].setAttribute("style", "opacity: " + index / 30);
      this.blur = "filter: blur(" + (8 - index / 7) + "px)";
      this.opacity = "opacity: " + (1 - index / 7) + ";";
    },
  },
};
</script>

<style>
.foreground {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100%;
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
  object-fit: cover;
  filter: brightness(1.5);
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
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.intro-text {
  font-weight: 300;
  text-align: center;
  text-indent: 2%;
  line-height: 2;
}

.wave-location {
  position: absolute;
  bottom: 2%;
}

.below {
  position: absolute;
  margin: 0;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  bottom: 3%;
  font-size: 70%;
  font-weight: 300;
  width: 50%;
}
</style>
