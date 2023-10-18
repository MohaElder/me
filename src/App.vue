<!-- <template>
  <router-view />
</template>

<script lang="ts" setup>
  //
</script> -->

<template>
  <v-app style="overflow: hidden">
    <v-app-bar app flat dark>
      <v-app-bar-nav-icon v-if="$vuetify.display.mobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <div class="d-flex align-center" v-else>
        <v-btn @click="$router.push({ name: 'Hi' }).catch(() => { })" text>
          <span class="mr-2">{{ $t("message.nav_hi") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Work' }).catch(() => { })" text>
          <span class="mr-2">{{ $t("message.nav_work") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Photos' }).catch(() => { })" text>
          <span class="mr-2">{{ $t("message.nav_photos") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'OpenSource' }).catch(() => { })" text>
          <span class="mr-2">{{ $t("message.nav_open_source") }}</span>
      </v-btn>
      <v-btn @click="$router.push({ name: 'Recipe' }).catch(() => { })" text>
          <span class="mr-2">{{ $t("message.nav_cocktail") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Blogs' }).catch(() => { })" text>
          <span class="mr-2">{{ $t("message.nav_blogs") }}</span>
        </v-btn>
        <!-- <v-btn @click="$router.push({ name: 'Guide' }).catch(() => {})" text>
                  <span class="mr-2">{{ $t("message.nav_guide") }}</span>
                </v-btn> -->
        <v-btn @click="$router.push({ name: 'IfIDie' }).catch(() => { })" text>
          <span class="mr-2">{{ $t("message.nav_if_i_die") }}</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="changeLanguage()" text>
        中/EN
      </v-btn>

      <v-btn :href="$t('message.statement.link')" target="_blank">
        <span v-if="$vuetify.display.mobile">
          {{ $t("message.statement.shortName") }}
        </span>
        <span v-else> {{ $t("message.statement.longName") }} </span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app bottom temporary style="background-color: #121212">
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item>
            <v-list-item-title @click="$router.push({ name: 'Hi' }).catch(() => { })">{{
              $t("message.nav_hi")
            }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="$router.push({ name: 'Work' }).catch(() => { })"> {{
              $t("message.nav_work")
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="$router.push({ name: 'Photos' }).catch(() => { })">{{
              $t("message.nav_photos")
            }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="$router.push({ name: 'OpenSource' }).catch(() => { })">{{
              $t("message.nav_open_source")
            }}</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="$router.push({ name: 'Recipe' }).catch(() => { })">{{
              $t("message.nav_cocktail")
            }}</v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title @click="$router.push({ name: 'Blogs' }).catch(() => { })">{{
            $t("message.nav_blogs")
          }}</v-list-item-title>
          </v-list-item>
          <!-- <v-list-item>
                    <v-list-item-title
                      @click="$router.push({ name: 'Guide' }).catch(() => {})"
                      >{{ $t("message.nav_guide") }}</v-list-item-title
                    >
                  </v-list-item> -->
          <v-list-item>
            <v-list-item-title @click="$router.push({ name: 'IfIDie' }).catch(() => { })">{{
              $t("message.nav_if_i_die")
            }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer dark padless style="padding-top: 1%;">
      <v-card flat tile class="white--text text-center">
        <v-card-text class="white--text pt-0">
          Made with
          <vueIcon />, 🧠, and ❤️.
          <a style="color: white" href="https://github.com/MohaElder/me" target="_blank">
            source code
          </a>
        </v-card-text>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong>MOHAELDER
            <span> {{ $t("message.statement.hashtag") }} </span>
          </strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts">

import vueIcon from './components/vue-icon.vue'
import eroducate from './components/eroducate.vue';

export default {
  name: "App",
  data: () => ({
    icons: ["mdi-github", "mdi-linkedin",],
    drawer: false,
    group: null,
  }),
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.$i18n.locale == "en" ? "zh" : "en";
    }
  },
  components: { vueIcon, eroducate }
};
</script>

<style scoped>
p {
  font-size: 100%;
}

html,
body {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
