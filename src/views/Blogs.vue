<template>
  <div style="color: white">
    <h1 style="padding: 30px; text-align: center">
      <span style="color: #64b5f6"> SHARE </span> /
      <span style="color: #ffee58"> LIFE </span>/
      <span style="color: #ff8a65"> COMMENTS </span>
    </h1>
    <v-container>
      <v-row dense>
        <v-col v-for="(item, key) in items" :key="key" cols="6" style="">
          <v-card class="mx-auto" max-width="600" :color="item.color">
            <v-img class="white--text align-end" height="400px" :src="item.img">
              <v-card-title>{{ item.title }}</v-card-title>
            </v-img>

            <v-card-text class="text--primary">
              <div style="color: white">{{ item.brief }}</div>
            </v-card-text>

            <v-card-actions>
              <v-btn color="white" text @click="travel(key)"> READ </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { blogs } from "../utils/blogLink.js";

export default {
  data: () => ({
    items: [
      {
        color: "#1F7087",
        img: "https://cdn.vuetifyjs.com/images/cards/foster.jpg",
        title: "Default Blog",
        brief: "Default Blog",
        id: "a3c8-8992",
      },
    ],
  }),
  beforeMount() {
    this.items = blogs;
  },
  methods: {
    travel: function (blogId) {
      this.$router.push({ name: "Blog", query: { id: blogId } });
    },
  },
};
</script>