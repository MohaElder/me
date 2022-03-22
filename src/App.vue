<template>
  <v-app>
    <v-app-bar app color="black" flat dark>
      <div class="d-flex align-center">
        <v-btn @click="$router.push({ name: 'Hi' }).catch(() => {})" text>
          <span class="mr-2">Hi</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Work' }).catch(() => {})" text>
          <span class="mr-2">Work</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Life' }).catch(() => {})" text>
          <span class="mr-2">Life</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Photos' }).catch(() => {})" text>
          <span class="mr-2">Photos</span>
        </v-btn>
        <v-btn @click="$router.push({ name: 'Blogs' }).catch(() => {})" text>
          <span class="mr-2">Blogs</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://crowdsurf.ucsd.edu/campaigns/support-for-those-impacted-by-the-crisis-in-ukraine#/"
        target="_blank"
        text
      >
        <span class="mr-2"
          >Support the people of <span style="color: #0057b7">Ukr</span
          ><span style="color: #ffdd00">aine</span> &
          <span style="color: #0072ce">Rus</span
          ><span style="color: #ef3340">sia</span></span
        >
      </v-btn>
    </v-app-bar>

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
            <span> #FuckWars</span>
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
    icons: ["mdi-github", "mdi-linkedin", "$eroducate"],
  }),
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
  },
};
</script>

<style scoped>
p {
  font-size: 100%;
}
</style>
