<template>
  <v-container style="color: white">
    <v-parallax dark :src="blog.img">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1>{{ blog.title }}</h1>
          <h2>{{ blog.brief }}</h2>
        </v-col>
      </v-row>
    </v-parallax>
    <div id="toc_holder" style="color: white"></div>
    <VueMarkdown :source="fileContent" :toc="true" toc-id="toc_holder">{{
      blog.article
    }}</VueMarkdown>
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
    fileContent: null,
  }),
  components: {
    VueMarkdown,
  },
  beforeMount() {
    {
      if (blogs[this.$route.query.id] != null) {
        this.blog = blogs[this.$route.query.id];
        this.getContent();
      } else {
        this.fileContent = this.blog.article;
      }
    }
  },
  methods: {
    getContent() {
      this.fileContent = "rendering ";
      // var self;
      this.$http.get(this.blog.article).then(
        (response) => {
          // get body data
          console.log(response);

          this.fileContent = response.body;
        },
        (response) => {
          // error callback
          this.fileContent = "An error ocurred";
          console.log(response);
        }
      );
    },
  },
};
</script>