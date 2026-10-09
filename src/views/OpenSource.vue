<template>
  <div class="os">
    <header class="os-header">
      <h1 class="headline">{{ $t("message.open_source_desc") }}</h1>
      <a class="btn accent" href="https://github.com/MohaElder" target="_blank">
        {{ $t("message.open_source_all") }}<v-icon size="18">mdi-arrow-top-right</v-icon>
      </a>
    </header>

    <div class="index">
      <ol class="names">
        <li v-for="(project, i) in projects" :key="project.name">
          <a :href="project.href" target="_blank" :class="{ active: i === picked }" @mouseenter="picked = i"
            @focus="picked = i">
            <span class="name-row">
              <span class="num">{{ String(i + 1).padStart(2, "0") }}</span>
              <span class="name">{{ project.name }}</span>
              <span class="meta">{{ project.meta }}</span>
            </span>
            <span class="inline-desc">{{ project.desc }}</span>
          </a>
        </li>
      </ol>

      <aside class="preview">
        <img :src="current.img" :alt="current.name">
        <span class="kind">{{ current.kind }}</span>
        <span class="desc">{{ current.desc }}</span>
        <a class="btn" :href="current.href" target="_blank">
          {{ $t("message.open_source_view") }}<v-icon size="18">mdi-arrow-top-right</v-icon>
        </a>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import openenlarge from '../assets/osp/openenlarge.jpg'
import karaAlwaysOk from '../assets/osp/karaalwaysok.png'
import stocka from '../assets/osp/stocka.svg'
import uimfSvelte from '../assets/osp/uimf-svelte.png'
import trip from '../assets/osp/Banner.jpg'
import svelte from '../assets/osp/svelte.png'
import gpac from '../assets/osp/gpac.png'

const projects = [
  {
    name: 'OpenEnlarge',
    href: 'https://github.com/MohaElder/openenlarge',
    img: openenlarge,
    meta: '★ 44 · 2026',
    kind: 'Film scan editor · macOS, Windows, Linux',
    desc: 'Professional-grade film scan editor that inverts negatives through real film-and-paper chemistry.',
  },
  {
    name: 'KaraAlwaysOK',
    href: 'https://github.com/MohaElder/KaraAlwaysOK',
    img: karaAlwaysOk,
    meta: '★ 1 · 2026',
    kind: 'Karaoke app · macOS',
    desc: 'Turn any song into karaoke on your Mac. Vocals removed, lyrics synced word by word, friends sing into their phones.',
  },
  {
    name: 'stocka',
    href: 'https://github.com/MohaElder/stocka',
    img: stocka,
    meta: 'New · 2026',
    kind: 'PWA · Cloudflare Workers',
    desc: 'Photograph items as you pack, let Workers AI name them, and find any box later by code or search.',
  },
  {
    name: 'uimf-svelte',
    href: 'https://github.com/UNOPS/uimf-svelte',
    img: uimfSvelte,
    meta: '★ 2 · 2026',
    kind: 'Svelte library · UNOPS',
    desc: 'Svelte UIMF components generated from backend metadata. Used across multiple UN services.',
  },
  {
    name: "Let's Plan A Trip",
    href: 'https://github.com/MohaElder/Trip',
    img: trip,
    meta: '★ 12 · 2022',
    kind: 'Web app',
    desc: 'A collaborative trip planner that actually does trip planning.',
  },
  {
    name: 'use-svelte-anywhere',
    href: 'https://github.com/MohaElder/SvelteComponents',
    img: svelte,
    meta: '★ 2 · 2023',
    kind: 'Build toolkit',
    desc: 'Universal web components with Svelte, bundled for any framework.',
  },
  {
    name: 'gpa-c',
    href: 'https://github.com/MohaElder/gpa-c',
    img: gpac,
    meta: '★ 1 · 2022',
    kind: 'JS library',
    desc: 'Lightweight GPA calculator framework for React, Vue, WeChat Miniapp and more.',
  },
]

// Hovering or focusing a name swaps the preview.
const picked = ref(0)
const current = computed(() => projects[picked.value])

onMounted(() => window.scrollTo(0, 0))
</script>

<style scoped>
/* Same frame and 12-column grid as the Me page. */
.os {
  --accent: #FDDA3A;
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 32px 140px;
  display: flex;
  flex-direction: column;
  gap: 72px;
  color: #FEFEFE;
}

/* Blog.vue's unscoped a/h1/ol/li rules leak site-wide; pin what this page relies on. */
.os a {
  color: inherit;
  text-decoration: none;
}

.os-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  max-width: 66%;
}

.headline {
  margin: 0;
  padding: 0;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -3px;
}

.os .btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 24px;
  border: 1px solid currentColor;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.3s;
}

.os .btn.accent {
  color: var(--accent);
}

.os .btn:hover {
  color: #FEE989;
}

.index {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
  align-items: start;
}

.names {
  grid-column: 1 / span 7;
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.names li {
  margin: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.names a {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 0;
  transition: color 0.2s;
}

.name-row {
  display: flex;
  align-items: baseline;
  gap: 20px;
}

.num {
  width: 24px;
  flex-shrink: 0;
  font-size: 13px;
  color: #6F6F6F;
}

.name {
  flex-grow: 1;
  font-size: 52px;
  line-height: 1.02;
  letter-spacing: -2.5px;
}

.meta {
  font-size: 14px;
  color: #8A8A8A;
  white-space: nowrap;
}

.inline-desc {
  display: none;
  padding-left: 44px;
  font-size: 15px;
  line-height: 1.5;
  color: #9A9A9A;
}

.preview {
  grid-column: 9 / span 4;
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.preview img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.kind {
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.desc {
  font-size: 17px;
  line-height: 1.5;
  color: #CFCFCF;
}

/* The highlight tracks the preview, so it only exists where the preview does. */
@media (min-width: 861px) {
  .names a.active,
  .active .num {
    color: var(--accent);
  }
}

/* No hover on touch screens: drop the preview, show each description inline. */
@media (max-width: 860px) {
  .os {
    padding: 40px 20px 100px;
    gap: 48px;
  }

  .os-header {
    max-width: none;
  }

  .headline {
    font-size: 40px;
    letter-spacing: -2px;
  }

  .names {
    grid-column: 1 / -1;
  }

  .name {
    font-size: 32px;
    letter-spacing: -1.5px;
  }

  .inline-desc {
    display: block;
  }

  .preview {
    display: none;
  }
}
</style>
