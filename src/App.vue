<!-- <template>
  <router-view />
</template>

<script lang="ts" setup>
  //
</script> -->

<template>
  <v-app style="overflow: hidden">
    <v-app-bar color="rgba(71, 71, 71, 0.063)" class="glassy lower-rounded">
      <v-app-bar-nav-icon v-if="$vuetify.display.mobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center" v-else>
        <span class="app-bar-item" @click="$router.push({ name: 'Hi' }).catch(() => { })"
          :style="$router.currentRoute.value.name == 'Hi' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_hi") }}</span>
          <span class="app-bar-item" @click="$router.push({ name: 'Work' }).catch(() => { })" :style="$router.currentRoute.value.name == 'Work' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_work") }}</span>
          <span class="app-bar-item" @click="$router.push({ name: 'Photos' }).catch(() => { })" :style="$router.currentRoute.value.name == 'Photos' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_photos") }}</span>
            <span class="app-bar-item" @click="$router.push({ name: 'NothingToLose' }).catch(() => { })" :style="$router.currentRoute.value.name == 'NothingToLose' ? 'color: #FDDA3A' : ''">
           Nothing to Lose</span>
          <span class="app-bar-item" @click="$router.push({ name: 'OpenSource' }).catch(() => { })" :style="$router.currentRoute.value.name == 'OpenSource' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_open_source") }}</span>
          <span class="app-bar-item" @click="$router.push({ name: 'Recipe' }).catch(() => { })" :style="$router.currentRoute.value.name == 'Recipe' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_cocktail") }}</span>
          <span class="app-bar-item" @click="$router.push({ name: 'Blogs' }).catch(() => { })" :style="$router.currentRoute.value.name == 'Blogs' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_blogs") }}</span>
          <span class="app-bar-item" @click="$router.push({ name: 'IfIDie' }).catch(() => { })" :style="$router.currentRoute.value.name == 'IfIDie' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_if_i_die") }}</span>
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
            <v-list-item-title @click="$router.push({ name: 'NothingToLose' }).catch(() => { })">Nothing to Lose</v-list-item-title>
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

    <v-footer class="glassy upper-rounded" style="padding-top: 15px" padless>
      <div tile class="white--text text-center">
        <p class="white--text pt-0" style="font-size: 12px;">
          Made with
          <vueIcon />, 🧠, and ❤️.
          <a style="color: white" href="https://github.com/MohaElder/me" target="_blank">
            source code
          </a>
        <br>
          {{ new Date().getFullYear() }} —
          <strong>MOHAELDER
            <span> {{ $t("message.statement.hashtag") }} </span>
          </strong>
        </p>
      </div>
    </v-footer>
  </v-app>
</template>

<script>

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

.app-bar-item {
  padding: 20px;
  cursor: pointer;
  transition: transform 0.5s, font-size 0.5s;
}

.app-bar-item:hover {
  transform: scale(1.05); /* Slightly enlarge */
  font-size: 1.1em; /* Increase font size to mimic bold */
}

.glassy {
  background-color: rgba(71, 71, 71, 0.063);
  backdrop-filter: blur(10px);
}

.upper-rounded {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.lower-rounded {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

p {
  font-size: 100%;
}

html,
body {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
