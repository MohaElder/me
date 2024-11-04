<template>
  <div>
    <h1 style="padding: 30px; text-align: center">
      <span style="color: #64b5f6"> {{ $t("message.share") }} </span> /
      <span style="color: #ffee58"> {{ $t("message.life") }} </span> /
      <span style="color: #ff8a65"> {{ $t("message.comments") }} </span>
    </h1>
    <v-container style="margin-top: 20px">
      <v-row>
        <v-col v-for="(item, key) in items" :key="key" :cols="$vuetify.display.mobile ? 12 : 6"
          :style="$vuetify.display.mobile ? 'padding-left: 10%; padding-right: 10%;' : ''">
          <v-card class="mx-auto" max-width="600" :color="item.color" @click="travel(key)">
            <v-img class="align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="300px" cover :src="item.img">
              <v-card-title class="text-white">{{ item.title }}</v-card-title>
            </v-img>

            <v-card-text class="text--primary">
              <span :style="
                'color: ' + (item.color == '#ffee58' ? 'black;' : 'white;')
              ">
                {{ item.brief }}</span>
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
    window.scrollTo(0, 0);
    this.items = blogs;
  },
  methods: {
    travel: function (blogId) {
      this.$router.push({ name: "Blog", query: { id: blogId } });
    },
  },
};
</script>