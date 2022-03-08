<template>
  <div class="home-container">
    <div
      class="background-pic"
    >
    </div>
    <v-row align="center" justify="center">
      <v-col class="text-center" cols="12">
        <h1 id="name" style="color: white; font-size: 100px" class="foreground">
          {{ activeName }}
        </h1>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import "animate.css";
// @ is an alias to /src

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
    names: ["翁安志", "お やすし", "Yasushi Oh"],
    activeName: "翁安志",
  }),
  beforeMount() {
    var index = 0;
    setInterval(() => {
      animateCSS("#name", "fadeIn");
      index = index + 1 == this.names.length ? 0 : index + 1;
      this.activeName = this.names[index];
    }, 2500);
  },
};
</script>

<style scoped>
.foreground {
  z-index: 1;
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.background-pic {
  /* Add the blur effect */
  filter: blur(4px);
  -webkit-filter: blur(4px);

  /* Full height */
  height: 100%;
  background-image: url("https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg");

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.home-container {
  height: 100%;
}

* {
  box-sizing: border-box;
}

</style>
