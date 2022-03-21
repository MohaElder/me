<template>
  <v-container>
    <v-parallax dark :src="blog.img">
      <v-row align="center" justify="center">
        <v-col
          class="text-center"
          cols="12"
          style="background-color: rgba(25, 25, 25, 0.45)"
        >
          <h1>{{ blog.title }}</h1>
          <h2>{{ blog.brief }}</h2>
        </v-col>
      </v-row>
    </v-parallax>
    <VueMarkdown :source="fileContent">{{ blog.article }}</VueMarkdown>
  </v-container>
</template>

<script>
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
  components: {},
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
          //replace the link to let it read image properly, then assign to source variable for rendering
          this.fileContent = response.body.replace(
            "../assets",
            "https://raw.githubusercontent.com/MohaElder/me/main/src/assets"
          );
        },
        (response) => {
          // error callback
          this.fileContent =
            "An error ocurred, this is probably an internet issue";
          console.log(response);
        }
      );
    },
  },
};
</script>

<style>
code {
  background-color: rgba(107, 95, 26, 0.856) !important;
}

p{
  text-indent:10%;
  line-height: 2;
}

h1{
  padding-top: 20px;
}
</style>