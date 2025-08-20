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
          (isPortrait()
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
          (isPortrait()
            ? '11%;'
            : '10.5%;')
        " cols="12">
          <v-img src="@/assets/bak.png" class="bak"
            :width="isPortrait() ? '100%' : '62.5%'"></v-img>
          <h3 class="intro-text" :style="
            'font-size: ' +
            (isPortrait()
              ? '50%;'
              : '100%;') +
            'padding-left: ' +
            (isPortrait()
              ? '0%;'
              : '30%;') +
            'padding-right: ' +
            (isPortrait()
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

<script setup lang="ts">
import { ref, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { useDisplay } from 'vuetify'
import "animate.css"

const { mobile, width } = useDisplay()

const images: HTMLImageElement[] = []
const names = ["翁安志", "お やすし", "Oh Yasushi"]

const activeName = ref("翁安志")
const blur = ref("filter: blur(10px)")
const opacity = ref("opacity: 1")
const quote = ref("")
const quoteAuthor = ref("MohaElder")
const scroll_position = ref(0)

const animateCSS = (element: string, animation: string, time_interval: number, prefix = "animate__") =>
  new Promise<string>((resolve) => {
    const animationName = `${prefix}${animation}`
    const node = document.querySelector(element) as HTMLElement | null
    if (!node) {
      clearInterval(time_interval)
      resolve("Page not active")
      return
    }
    node.classList.add(`${prefix}animated`, animationName)

    function handleAnimationEnd(event: Event) {
      event.stopPropagation()
      if (node) {
        node.classList.remove(`${prefix}animated`, animationName)
      }
      resolve("Animation ended")
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true })
  })

const isPortrait = () => {
  return mobile.value
}

const calcSize = () => {
  return isPortrait()
    ? width.value * 0.14
    : width.value * 0.05
}

const loadImages = () => {
  for (let i = scroll_position.value; i < 50; i++) {
    const img = new Image()
    img.src = `https://raw.githubusercontent.com/MohaElder/me/main/src/assets/skyFrame/Frame(${i+1}).jpeg`
    images.push(img)
  }
}

const handleScroll = () => {
  let index = Math.floor(window.scrollY / 72) % 50
  if (index <= 0 && window.scrollY > 1000) {
    index = images.length - 1
  }
  const father = document.querySelector("#father")
  if (father?.children[0]) {
    father.children[0].replaceWith(images[index])
    images[index].classList.add("each-image")
    images[index].setAttribute("style", "opacity: " + index / 30)
    blur.value = "filter: blur(" + (8 - index / 7) + "px)"
    opacity.value = "opacity: " + (1 - index / 7) + ";"
  }
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll)
  window.scrollTo(0, 0)
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll)
})

onBeforeMount(() => {
  let index = 0
  const time = window.setInterval(() => {
    animateCSS("#name", "fadeIn", time as number)
    index = index + 1 === names.length ? 0 : index + 1
    activeName.value = names[index]
  }, 2500)
  loadImages()
})
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
