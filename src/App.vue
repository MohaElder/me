<template>
  <v-app>
    <v-app-bar app color="#121212" flat dark>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.width < $vuetify.breakpoint.height"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <div class="d-flex align-center" v-else>
        <v-btn @click="$router.push({ name: 'Hi' }).catch(() => {})" text>
          <span class="mr-2">{{ $t("message.nav_hi") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Work' }).catch(() => {})" text>
          <span class="mr-2">{{ $t("message.nav_work") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'OpenSource' }).catch(() => {})" text>
          <span class="mr-2">{{ $t("message.nav_open_source") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Receipt' }).catch(() => {})" text>
          <span class="mr-2">{{ $t("message.nav_cocktail") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Photos' }).catch(() => {})" text>
          <span class="mr-2">{{ $t("message.nav_photos") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Blogs' }).catch(() => {})" text>
          <span class="mr-2">{{ $t("message.nav_blogs") }}</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'IfIDie' }).catch(() => {})" text>
          <span class="mr-2">{{ $t("message.nav_if_i_die") }}</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click="changeLanguage()"
        text
      >
        中/EN
      </v-btn>

      <v-btn
        :href="statement.link"
        target="_blank"
        text
      >
        <span v-if="$vuetify.breakpoint.width > $vuetify.breakpoint.height">
           {{statement.longName}}
        </span>
        <span v-else>  {{statement.shortName}} </span>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      bottom
      temporary
      style="background-color: #121212"
    >
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item>
            <v-list-item-title
              @click="$router.push({ name: 'Hi' }).catch(() => {})"
              >{{ $t("message.nav_hi") }}</v-list-item-title
            >
          </v-list-item>

          <v-list-item>
            <v-list-item-title
              @click="$router.push({ name: 'Work' }).catch(() => {})"
              > {{ $t("message.nav_work") }}</v-list-item-title
            >
          </v-list-item>

          <v-list-item>
            <v-list-item-title
              @click="$router.push({ name: 'OpenSource' }).catch(() => {})"
              >{{ $t("message.nav_open_source") }}</v-list-item-title
            >
          </v-list-item>

          <v-list-item>
            <v-list-item-title
              @click="$router.push({ name: 'Receipt' }).catch(() => {})"
              >{{ $t("message.nav_cocktail") }}</v-list-item-title
            >
          </v-list-item>

          <v-list-item>
            <v-list-item-title
              @click="$router.push({ name: 'Photos' }).catch(() => {})"
              >{{ $t("message.nav_photos") }}</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              @click="$router.push({ name: 'Blogs' }).catch(() => {})"
              >{{ $t("message.nav_blogs") }}</v-list-item-title
            >
          </v-list-item>
          <v-list-item>
            <v-list-item-title
              @click="$router.push({ name: 'IfIDie' }).catch(() => {})"
              >{{ $t("message.nav_if_i_die") }}</v-list-item-title
            >
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer dark padless>
      <v-card
        flat
        tile
        class="white--text text-center"
        style="background-color: #121212; width: 100%"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-4 white--text"
            @click="goTo(icon.substring(4))"
            icon
          >
            <!-- We use substring above because icons come with names of "mdi-name_of_website", by doing so, we just get the name of the link -->
            <v-icon size="24px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          Made with <v-icon size="14px"> $vueIcon </v-icon>, 🧠, and ❤️.
          <a style="color: white" href="https://github.com/MohaElder/me">
            source code
          </a>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong
            >MOHAELDER
            <span> {{statement.hashtag}} </span>
          </strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    statement: {
      longName: "不做奴才做公民",
      shortName: "不做奴才做公民",
      hashtag: "#不自由，毋宁死",
      link: "https://zh.wikipedia.org/wiki/%E5%8C%97%E4%BA%AC%E5%9B%9B%E9%80%9A%E6%A1%A5%E6%8A%97%E8%AE%AE"
    },
    icons: ["mdi-github", "mdi-linkedin", "$eroducate"],
    drawer: false,
    group: null,
  }),
  watch: {
    group() {
      this.drawer = false;
    },
  },
  mounted() {
    this.$vuetify.theme.dark = true;
  },
  methods: {
    goTo(dest) {
      console.log(dest);
      switch (dest) {
        case "github":
          window.open("https://github.com/mohaelder");
          break;
        case "linkedin":
          window.open("https://linkedin.com/in/mohaelder");
          break;
        case "ducate": //ducate because it is not mdi- prefix
          window.open("https://eroducate.xyz");
          break;
      }
    },

    changeLanguage() {
      this.$i18n.locale = this.$i18n.locale == 'en' ? 'zh' : 'en'
    }
  },
};
</script>

<style>
p {
  font-size: 100%;
}

html,
body {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
