<!-- <template>
  <router-view />
</template>

<script lang="ts" setup>
  //
</script> -->

<template>
  <v-app style="overflow: hidden">
    <v-app-bar class="liquid-glass-app-bar" @mousemove="handleAppBarMouseMove" @mouseleave="handleAppBarMouseLeave">
      <v-app-bar-nav-icon v-if="$vuetify.display.mobile" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center" v-else>
        <span class="app-bar-item" @click="$router.push({ name: 'Hi' }).catch(() => { })"
          :style="$router.currentRoute.value.name == 'Hi' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_hi") }}</span>
          <span class="app-bar-item" @click="$router.push({ name: 'Work' }).catch(() => { })" :style="$router.currentRoute.value.name == 'Work' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_work") }}</span>
          <span class="app-bar-item" @click="$router.push({ name: 'Photos' }).catch(() => { })" :style="$router.currentRoute.value.name == 'Photos' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_photos") }}</span>
        <span class="app-bar-item" @click="$router.push({ name: 'Exhibitions' }).catch(() => { })" :style="$router.currentRoute.value.name == 'Exhibitions' ? 'color: #FDDA3A' : ''">
          {{ $t("message.nav_exhibitions") }}
        </span>
          <span class="app-bar-item" @click="$router.push({ name: 'OpenSource' }).catch(() => { })" :style="$router.currentRoute.value.name == 'OpenSource' ? 'color: #FDDA3A' : ''">{{
            $t("message.nav_open_source") }}</span>
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

    <v-navigation-drawer v-model="drawer" app bottom temporary class="bg-dark">
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
            <v-list-item-title @click="$router.push({ name: 'Exhibitions' }).catch(() => { })">{{ $t("message.nav_exhibitions") }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click="$router.push({ name: 'OpenSource' }).catch(() => { })">{{
              $t("message.nav_open_source")
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

    <v-footer class="liquid-glass-footer" padless @mousemove="handleFooterMouseMove" @mouseleave="handleFooterMouseLeave">
      <div tile class="text-white text-center">
        <p class="text-white pt-0 text-xs">
          Made with
          <vueIcon />, 🧠, and ❤️.
          <a class="link-white" href="https://github.com/MohaElder/me" target="_blank">
            source code
          </a>
        <br>
          {{ new Date().getFullYear() }} —
          <strong class="footer-brand">
            MOHAELDER
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
    appBarMouseX: 0,
    appBarMouseY: 0,
    footerMouseX: 0,
    footerMouseY: 0,
  }),
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    changeLanguage() {
      this.$i18n.locale = this.$i18n.locale == "en" ? "zh" : "en";
    },
    handleAppBarMouseMove(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      this.appBarMouseX = event.clientX - rect.left;
      this.appBarMouseY = event.clientY - rect.top;
    },
    handleAppBarMouseLeave() {
      this.appBarMouseX = 0;
      this.appBarMouseY = 0;
    },
    handleFooterMouseMove(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      this.footerMouseX = event.clientX - rect.left;
      this.footerMouseY = event.clientY - rect.top;
    },
    handleFooterMouseLeave() {
      this.footerMouseX = 0;
      this.footerMouseY = 0;
    }
  },
  components: { vueIcon, eroducate }
};
</script>

<style scoped>
/* Liquid Glass Effect for AppBar */
.liquid-glass-app-bar {
  position: relative;
  background: rgba(0, 0, 0, 0.25) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.liquid-glass-app-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at v-bind(appBarMouseX + 'px') v-bind(appBarMouseY + 'px'),
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 30%,
    rgba(255, 255, 255, 0.03) 60%,
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.liquid-glass-app-bar:hover::before {
  opacity: 1;
}

.liquid-glass-app-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  z-index: 0;
}

/* Liquid Glass Effect for Footer */
.liquid-glass-footer {
  position: relative;
  background: rgba(0, 0, 0, 0.25) !important;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 -8px 32px 0 rgba(0, 0, 0, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.liquid-glass-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at v-bind(footerMouseX + 'px') v-bind(footerMouseY + 'px'),
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.08) 30%,
    rgba(255, 255, 255, 0.03) 60%,
    transparent 80%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
  pointer-events: none;
}

.liquid-glass-footer:hover::before {
  opacity: 1;
}

.liquid-glass-footer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0.08) 100%
  );
  z-index: 0;
}

/* Ensure content stays above the effects */
.liquid-glass-app-bar > *,
.liquid-glass-footer > * {
  position: relative;
  z-index: 2;
}

.app-bar-item {
  padding: 20px;
  cursor: pointer;
  transition: transform 0.5s, font-size 0.5s;
}

.app-bar-item:hover {
  transform: scale(1.05); /* Slightly enlarge */
  font-size: 1.1em; /* Increase font size to mimic bold */
}

p {
  font-size: 100%;
}

html,
body {
  max-width: 100%;
  overflow-x: hidden;
}

.footer-brand {
  font-size: 0.9em;
}
</style>
