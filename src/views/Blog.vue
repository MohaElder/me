<template>
  <v-container>
    <v-parallax dark :src="blog.img">
      <v-row align="center" justify="start">
        <v-col
          class="text-center"
          cols="12"
          style="
            background-color: rgba(25, 25, 25, 0.45);
            display: flex;
            flex-direction: row;
            justify-content: start;
            flex-wrap: wrap;
          "
        >
          <h1 class="blog-title">{{ blog.title }}</h1>
          <h2 class="blog-brief">{{ blog.brief }}</h2>
          <h2 style="width: 100%" class="blog-date">{{ blog.date }}</h2>
          <v-btn
            color="white"
            class="white--text"
            outlined
            style="margin-top: 15px"
            @click="share()"
            small
          >
            {{ shared ? "Copied to Clipboard" : "Share" }}
            <v-icon right dark> mdi-share </v-icon>
          </v-btn>
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
    shared: false,
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
    share() {
      this.shared = true;
      navigator.clipboard.writeText(window.location.href);
    },
  },
};
</script>

<style>
code {
  background-color: rgba(0, 158, 206, 0.856) !important;
  font-family: "Courier New", Courier, monospace;
}

p {
  /* text-indent: 2%; */
  line-height: 2;
  font-size: 80%;
  font-weight: 300;
}

h1 {
  padding-top: 20px;
  font-weight: 500;
  font-size: 180%;
}

h2 {
  font-weight: 400;
}

blockquote {
  font-size: 130%;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: 600;
  /* padding: 5px; */
}

img {
  margin-top: 50px;
  margin-bottom: 50px;
  width: 50%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.blog-title {
  font-size: 300%;
  font-weight: 500;
  text-align: start;
}

.blog-brief {
  font-size: 150%;
  font-weight: 300;
  text-align: start;
}

.blog-date {
  font-size: 120%;
  font-weight: 300;
  text-align: start;
}
</style>