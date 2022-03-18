<template>
  <v-container style="color: white">
    <v-parallax
      dark
      :src="blog.img"
    >
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1>{{ blog.title }}</h1>
          <h2>{{ blog.brief }}</h2>
        </v-col>
      </v-row>
    </v-parallax>
    <VueMarkdown>{{ blog.article }}</VueMarkdown>
  </v-container>
</template>

<script>
import VueMarkdown from "vue-markdown";
import { blogs } from "../utils/blogLink.js";

export default {
  data: () => ({
    blog: {
      title: "42",
      brief: "This might answer everything!",
      article: "# Whoops! Seems like you have reached a nonexisting article ;)",
      img: "",
    },
  }),
  components: {
    VueMarkdown,
  },
  beforeMount() {
    {
      this.blog =
        blogs[this.$route.query.id] == null
          ? this.blog
          : blogs[this.$route.query.id];
    }
  },
};
</script>