
<template>
  <div class="opensource-container">
    <div class="opensource-header">
      <h1 class="opensource-title">{{ $t("message.open_source") }}</h1>
      <div class="opensource-subtitle">
        {{ $t("message.open_source_desc") }}
        <a class="opensource-link" target="_blank" href="https://github.com/MohaElder">{{ $t("message.open_source_desc_3_link") }}</a>.
      </div>
    </div>
    <div class="opensource-cards">
      <v-card max-width="700" @click="() => { nav('https://github.com/UNOPS/uimf-svelte'); }" class="mb-xl">
        <v-img class="text-white align-end" src="../assets/osp/uimf-svelte.png">
          <v-card-title>uimf-svelte</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
          <div>
            Svelte implementation of UIMF components, created by backend metadata configs. Small, fast, and compatible with any environment. Uses Bootstrap for a clean, modern look.
          </div>
        </v-card-text>
      </v-card>
      <v-card max-width="700" @click="() => { nav('https://github.com/MohaElder/SvelteComponents'); }" class="mb-xl">
        <v-img class="text-white align-end" src="../assets/osp/svelte.png">
          <v-card-title>use-svelte-anywhere</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
          <div>
            Universal web components with Svelte. Build and bundle for any framework. Includes workflow and templates for easy integration.
          </div>
        </v-card-text>
      </v-card>
      <v-card max-width="700" @click="() => { nav('https://github.com/MohaElder/Trip'); }" class="mb-xl">
        <v-img class="text-white align-end" src="../assets/osp/Banner.jpg">
          <v-card-title>Let's Plan A Trip</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
          <div>
            A collaborative trip planning tool. Plan, organize, and share your travel adventures with friends.
          </div>
        </v-card-text>
      </v-card>
      <v-card max-width="700" @click="() => { nav('https://github.com/MohaElder/gpa-c'); }" class="mb-xl">
        <v-img class="text-white align-end" src="../assets/osp/gpac.png">
          <v-card-title>gpa-c</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
          <div>
            Lightweight GPA calculator framework for JavaScript. Works with React, Vue, WeChat Miniapp, and more.
          </div>
        </v-card-text>
      </v-card>
      <v-card max-width="700" @click="() => { nav('https://github.com/MohaElder/Eroducate/blob/master/README.md'); }" class="mb-xl">
        <v-img class="text-white align-end" src="../assets/osp/eroducate.png">
          <v-card-title class="text-black">Eroducate</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
          <div>
            Guide to creating multi-ended visual novels. Introduces the FASMEC method for professional filmmaking.
          </div>
        </v-card-text>
      </v-card>
      <v-card max-width="700" @click="() => { nav('https://github.com/MohaElder/AnnoWikiTool'); }" class="mb-xl">
        <v-img class="text-white align-end" src="../assets/osp/anno.png">
          <v-card-title>Anno Wiki Tool</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
          <div>
            Python script to boost efficiency cloning Fandom wikis. Converts templates, downloads images, and more.
          </div>
        </v-card-text>
      </v-card>
      <v-card max-width="700" @click="() => { nav('https://github.com/Eroducate/project-megabunus-portal'); }" class="mb-xl">
        <v-img class="text-white align-end" src="../assets/osp/megabunus.png">
          <v-card-title class="text-black">Project Megabunus</v-card-title>
        </v-img>
        <v-card-text class="text--primary">
          <div>
            Web service for visual novel games. Portal, backend, and game client for codeless editing, live loading, translation, and more.
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({}),
  mounted() { window.scrollTo(0, 0); },
  methods: {
    nav(str) {
      window.location.href = str;
    },
  },
};
</script>

<style scoped>
.opensource-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 80px;
  padding-bottom: 60px;
}

.opensource-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  align-self: stretch;
}

.opensource-title {
  color: #FFF;
  text-align: center;
  font-family: "Helvetica Neue";
  font-size: 70px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -2.8px;
  margin: 0;
}

.opensource-subtitle {
  color: #FFF;
  text-align: center;
  font-family: "Helvetica Neue";
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -1.4px;
  padding-left: 20px;
  padding-right: 20px;
}

.opensource-cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

@media (max-width: 768px) {
  .opensource-container {
    padding-left: 16px;
    padding-right: 16px;
  }
}

.v-application a {
  color: white;
}
</style>

