<template>
  <v-app>
    <v-app-bar app color="black" flat dark>
      <div class="d-flex align-center">
        <v-btn
          @click="$router.push({ name: 'Hi'}).catch(()=>{})"
          text
        >
          <span class="mr-2">Hi</span>
        </v-btn>
        <v-btn
          @click="$router.push({ name: 'Work'}).catch(()=>{})"
          text
        >
          <span class="mr-2">Work</span>
        </v-btn>
        <v-btn
          @click="$router.push({ name: 'Life'}).catch(()=>{})"
          text
        >
          <span class="mr-2">Life</span>
        </v-btn>
        <v-btn
          @click="$router.push({ name: 'Photos'}).catch(()=>{})"
          text
        >
          <span class="mr-2">Photos</span>
        </v-btn>
      </div>

      <v-spacer></v-spacer>

      <!-- <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
    </v-app-bar>

    <v-main style="background-color:black">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style scoped>

</style>
