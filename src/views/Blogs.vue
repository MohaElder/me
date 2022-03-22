<template>
  <div>
    <h1 style="padding: 30px; text-align: center">
      <span style="color: #64b5f6"> SHARE </span> /
      <span style="color: #ffee58"> LIFE </span>/
      <span style="color: #ff8a65"> COMMENTS </span>
    </h1>
    <v-container style="margin-top: 20px">
      <v-row>
        <v-col v-for="(item, key) in items" :key="key" cols="6" style="">
          <v-card
            class="mx-auto"
            max-width="600"
            :color="item.color"
            @click="travel(key)"
          >
            <v-img class="white--text align-end" height="300px" :src="item.img">
              <v-card-title>{{ item.title }}</v-card-title>
            </v-img>

            <v-card-text class="text--primary">
              <span :style="'color: ' + (item.color == '#ffee58' ? 'black;' : 'white;')"> {{ item.brief }}</span>
            </v-card-text>
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