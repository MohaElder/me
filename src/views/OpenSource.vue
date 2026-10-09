
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
      <v-card v-for="project in projects" :key="project.name" max-width="700" :href="project.href" class="mb-xl">
        <v-img class="text-white align-end" :src="project.img" gradient="to top, rgba(0,0,0,.6), transparent 35%">
          <v-card-title>{{ project.name }}</v-card-title>
        </v-img>
        <v-card-text class="text--primary">{{ project.desc }}</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import openenlarge from '../assets/osp/openenlarge.jpg'
import uimfSvelte from '../assets/osp/uimf-svelte.png'
import karaAlwaysOk from '../assets/osp/karaalwaysok.png'
import stocka from '../assets/osp/stocka.svg'
import trip from '../assets/osp/Banner.jpg'
import svelte from '../assets/osp/svelte.png'
import gpac from '../assets/osp/gpac.png'

const projects = [
  {
    name: 'OpenEnlarge',
    href: 'https://github.com/MohaElder/openenlarge',
    img: openenlarge,
    desc: 'Professional-grade film scan editor that inverts negatives through real film-and-paper chemistry. Free for macOS, Windows, and Linux.',
  },
  {
    name: 'uimf-svelte',
    href: 'https://github.com/UNOPS/uimf-svelte',
    img: uimfSvelte,
    desc: 'Svelte implementation of UIMF components, created by backend metadata configs. Small, fast, and compatible with any environment. Used across multiple UN services.',
  },
  {
    name: 'KaraAlwaysOK',
    href: 'https://github.com/MohaElder/KaraAlwaysOK',
    img: karaAlwaysOk,
    desc: 'Turn any song into karaoke on your Mac: vocals removed, lyrics synced word by word, and friends sing into their phones as mics.',
  },
  {
    name: 'stocka',
    href: 'https://github.com/MohaElder/stocka',
    img: stocka,
    desc: "A 'what's in the box?' app: photograph items as you pack, let Workers AI name them, and find any box later by code or search.",
  },
  {
    name: "Let's Plan A Trip",
    href: 'https://github.com/MohaElder/Trip',
    img: trip,
    desc: 'A collaborative trip planning tool. Plan, organize, and share your travel adventures with friends.',
  },
  {
    name: 'use-svelte-anywhere',
    href: 'https://github.com/MohaElder/SvelteComponents',
    img: svelte,
    desc: 'Universal web components with Svelte. Build and bundle for any framework. Includes workflow and templates for easy integration.',
  },
  {
    name: 'gpa-c',
    href: 'https://github.com/MohaElder/gpa-c',
    img: gpac,
    desc: 'Lightweight GPA calculator framework for JavaScript. Works with React, Vue, WeChat Miniapp, and more.',
  },
]

onMounted(() => window.scrollTo(0, 0))
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

