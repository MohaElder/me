<template>
  <v-container
    style="padding-left: 10%; padding-right: 10%; padding-bottom: 7%"
  >
    <v-row style="margin-bottom: 40px">
      <v-col class="text-center head-section" cols="12">
        <h1 class="blog-title">{{ blog.title }}</h1>
        <h2 style="width: 100%" class="blog-date">Author: MohaElder</h2>
        <h2 style="width: 100%" class="blog-date">{{ blog.date }}</h2>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="white--text"
          @click="share(icon.substring(4))"
          icon
        >
          <!-- We use substring above because icons come with names of "mdi-name_of_website", by doing so, we just get the name of the link -->
          <v-icon size="24px">
            {{ icon }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <div class="blog-renderer" v-html="fileContent"></div>
  </v-container>
</template>

<script>
import { blogs } from "../utils/blogLink.js";
import MarkdownIt from "markdown-it";

export default {
  data: () => ({
    icons: [
      "mdi-link-box-variant-outline",
      "mdi-twitter",
      "mdi-linkedin",
      "mdi-facebook",
    ],
    copied: false,
    blog: {
      title: "42",
      article: "# Whoops! Seems like you have reached a nonexisting article ;)",
      img: "",
    },
    fileContent: null,
  }),
  beforeMount() {
    {
      window.scrollTo(0, 0);
      if (blogs[this.$route.query.id] != null) {
        this.blog = blogs[this.$route.query.id];
        this.getContent();
      } else {
        this.fileContent = this.blog.article;
      }
    }
  },
  methods: {
    rendered(e) {
      let lines = e.split("\n");
      for (let i = 0; i < lines.length; i++) {
        let element = lines[i];
        if (element.includes("<img")) {
          let idx = element.indexOf("<img");
          let startPos = idx + 10;
          //we find the start position of <img and treat that as idx(0th position), then we add 10 because it's set to be '<img src="'
          let endPos = element.indexOf('"', startPos);
          //we find the first occurance of " after startPos to locate the end of the link
          let src = element.slice(startPos, endPos);
          let lst = element.split("");
          lst[idx + 3] +=
            " class='md-img' onclick= 'view(" + '"' + src + '"' + ")'"; //+3 because '<img' where idx is at the position of '<'
          lines[i] = lst.join("");
        }
      }
      return lines.join("\n");
    },

    getContent() {
      this.fileContent = "rendering ";
      fetch(this.blog.article)
        .then((response) => response.text())
        .then((data) => {
          //replace the link to let it read image properly, then assign to source variable for rendering
          let ret = data
            .split("../assets")
            .join("https://cdn.jsdelivr.net/gh/mohaelder/me/src/assets");
          let md = new MarkdownIt("commonmark");
          this.fileContent = this.rendered(md.render(ret));
          console.log(this.fileContent);
        });
    },
    share(name) {
      var link = window.location.href;
      switch (name) {
        case "link-box-variant-outline":
          navigator.clipboard.writeText(link);
          break;
        case "twitter":
          window.open(
            "http://twitter.com/share?text=" + this.blog.title + "&url=" + link
          );
          break;
        case "linkedin":
          window.open(
            "https://www.linkedin.com/sharing/share-offsite/?url=" + link
          );
          break;
        case "facebook":
          window.open("https://www.facebook.com/sharer/sharer.php?u=" + link);
          break;
      }
      this.shared = true;
    },
  },
};
</script>

<style>
.blog-renderer::first-letter {
  initial-letter: 2 1;
}

.blog-renderer {
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
}

.middle {
  /* Center child horizontally*/
  display: flex;
  justify-content: center;
}

a{
  color: rgb(170, 218, 250);
}

code {
  background-color: #313131 !important;
  color: rgb(170, 218, 250);
  font-family: "Courier New", Courier, monospace;
}

h2 {
  font-weight: 900;
  font-style: italic;
  margin-bottom: 0.5rem;
}

p {
  /* text-indent: 2%; */
  line-height: 1.875rem;
  font-size: 1.25rem;
  font-weight: 300;
  margin-bottom: 0.9375rem;
}

ol {
  padding: 0.9375rem;
}

li {
  font-size: 1.0625rem;
  line-height: 1.5rem;
  margin-bottom: 0.6375rem;
}

h1 {
  padding-top: 20px;
  font-weight: 500;
  font-size: 180%;
}

blockquote {
  font-size: 130%;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-weight: 600;
  /* padding: 5px; */
}

.md-img {
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.blog-title {
  font-size: 300%;
  font-weight: 500;
  text-align: start;
}

.blog-date {
  font-size: 100%;
  font-weight: 300;
  text-align: start;
}

.head-section {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
}
</style>