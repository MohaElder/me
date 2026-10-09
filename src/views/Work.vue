<template>
  <div class="me">
    <header class="grid hero">
      <div class="hero-text">
        <h1 class="headline">
          {{ $t("message.work.a") }}<a href="https://flick.art" target="_blank">{{ $t("message.work.b") }}</a>{{
            $t("message.work.c") }}<a href="https://www.norra.io/" target="_blank">Norra</a>{{ $t("message.work.d")
          }}<a href="https://www.unops.org/" target="_blank">UN</a>{{ $t("message.and")
          }}<a href="https://www.nvidia.com/" target="_blank">NVIDIA</a>{{ $t("message.work.e") }}
          <router-link :to="{ name: 'Photos' }">{{ $t("message.pictures") }}</router-link>{{ $t("message.work.f") }}
        </h1>
        <div class="actions">
          <a class="resume-btn" href="https://github.com/MohaElder/me/raw/main/src/assets/yasushi_resume.pdf">
            {{ $t("message.download") }}<Icon name="arrow-down" :size="18" />
          </a>
          <a v-if="locale == 'zh'" class="resume-btn"
            href="https://github.com/MohaElder/me/raw/main/src/assets/resume_cn.pdf">
            中文简历<Icon name="arrow-down" :size="18" />
          </a>
          <nav class="links">
            <a href="mailto:calen0909@hotmail.com">{{ $t("message.email") }}</a>
            <a href="https://github.com/MohaElder" target="_blank">GitHub</a>
            <a href="https://linkedin.com/in/mohaelder" target="_blank">{{ $t("message.linkedin") }}</a>
            <a href="https://medium.com/@calen0909" target="_blank">{{ $t("message.medium") }}</a>
          </nav>
        </div>
      </div>
      <img class="hero-photo" src="../assets/profile_pic.jpg" alt="Yasushi laughing with a thumbs up">
    </header>

    <section class="grid section">
      <h2 class="section-label">{{ $t("message.education") }}</h2>
      <div class="section-body row">
        <span>{{ $t("message.ucsd") }}</span><span class="aside">2024</span>
      </div>
    </section>

    <section v-for="section in sections" :key="section.title" class="grid section">
      <h2 class="section-label">{{ $t(section.title) }}</h2>
      <div class="section-body">
        <div v-for="item in section.items" :key="item.id" class="entry">
          <a :href="item.href" target="_blank">{{ $t(`message.entries.${item.id}.org`) }}</a>
          <span class="entry-role">{{ $t(`message.entries.${item.id}.role`) }}</span>
          <span class="aside" :class="{ current: !item.year }">{{ item.year ?? $t("message.present") }}</span>
          <span class="entry-desc">{{ $t(`message.entries.${item.id}.desc`) }}</span>
        </div>
      </div>
    </section>

    <section class="grid section">
      <h2 class="section-label">{{ $t("message.articles") }}</h2>
      <div class="section-body list">
        <div class="row">
          <a class="underline" href="https://medium.com/@calen0909/why-dont-i-like-oas-how-to-design-a-good-oa-ac2716a71682"
            target="_blank">Why don't I like OAs & how to design a good OA</a><span class="aside">Medium</span>
        </div>
        <div class="row">
          <a class="underline"
            href="https://medium.com/@calen0909/implementing-semantic-search-with-openai-postgres-and-entity-framework-4414cf516b48"
            target="_blank">Implementing Semantic Search with OpenAI, Postgres, and Entity Framework</a><span
            class="aside">Medium</span>
        </div>
      </div>
    </section>

    <section class="grid section">
      <h2 class="section-label">{{ $t("message.honors_and_news") }}</h2>
      <div class="section-body list honors">
        <div class="awards">
          <a v-for="award in awards" :key="award.href" :href="award.href" target="_blank" class="award">
            <img :src="award.img" :alt="$t(award.caption)">
            <span>{{ $t(award.caption) }}</span>
          </a>
        </div>
        <div class="row">
          <a class="underline" href="https://news.cgtn.com/news/3d3d674d7851544f33457a6333566d54/index.html"
            target="_blank">{{ $t("message.honors_and_news_desc.cgtn_link") }}</a><span class="aside">{{
              $t("message.honors_and_news_desc.cgtn_source") }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Icon from '../components/Icon.vue'
import { onMounted } from 'vue'
import { locale } from '../i18n'
import analogSparks2025 from '../assets/analog_sparks_2025.png'
import ipa2026Selection from '../assets/ipa2026_selection.png'
import ipa2025 from '../assets/ipa2025.png'
import ipa2025Mention from '../assets/ipa2025mention.png'
import ndAwards2024 from '../assets/nd_awards_hm_2024.png'

// Mirrors the resume; text lives in messages.entries. No year = current.
const sections = [
  {
    title: 'message.work_experience',
    items: [
      { id: 'flick', href: 'https://flick.art' },
      { id: 'norra', href: 'https://www.norra.io/', year: 2025 },
      { id: 'aako', href: 'https://aako.world/', year: 2024 },
      { id: 'unops', href: 'https://www.unops.org/', year: 2023 },
      { id: 'ucsd', href: 'https://ucsd.edu/', year: 2022 },
      { id: 'nvidia', href: 'https://www.nvidia.com/', year: 2020 },
    ],
  },
  {
    title: 'message.fun_experience',
    items: [
      { id: 'openenlarge', href: 'https://github.com/MohaElder/openenlarge' },
      { id: 'avian_enigma', href: 'https://store.steampowered.com/app/2784960/_/', year: 2024 },
      { id: 'ucla', year: 2024 },
      { id: 'uimf_svelte', href: 'https://github.com/UNOPS/uimf-svelte', year: 2023 },
      { id: 'self_reliance', href: 'https://store.steampowered.com/app/1016110/Self_Reliance/', year: 2018 },
      { id: 'more_club', year: 2017 },
    ],
  },
]

const awards = [
  { caption: 'message.awards.ipa_2026', img: ipa2026Selection, href: 'https://www.photoawards.com/social/zoom.php?eid=8-1722623105-26' },
  { caption: 'message.awards.analog_sparks', img: analogSparks2025, href: 'https://www.analogsparksawards.com/winner/zoom.php?eid=3-6335-25' },
  { caption: 'message.awards.ipa_2nd', img: ipa2025, href: 'https://www.photoawards.com/winner/zoom.php?eid=8-1722599429-25' },
  { caption: 'message.awards.ipa_hm', img: ipa2025Mention, href: 'https://www.photoawards.com/winner/zoom.php?eid=8-1722610316-25' },
  { caption: 'message.awards.nd_hm', img: ndAwards2024, href: 'https://ndawards.net/winners-gallery/nd-awards-2024/non-professional/photojournalism-story/hm/22290/' },
  { caption: 'message.awards.nd_hm', img: ndAwards2024, href: 'https://ndawards.net/winners-gallery/nd-awards-2024/non-professional/photojournalism-story/hm/22289/' },
]

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* One 12-column grid for the whole page: labels take 3 columns, content 9,
   so every section shares the same two left edges. */
.me {
  --accent: #FDDA3A;
  --aside: #9a9a9a;
  max-width: 1280px;
  margin: 0 auto;
  padding: 80px 32px 140px;
  display: flex;
  flex-direction: column;
  gap: 88px;
  color: #FEFEFE;
}

/* Blog.vue's unscoped a/h1/h2 rules leak site-wide; pin what this page relies on. */
.me a {
  color: inherit;
  text-decoration: none;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
}

.me a[href]:hover {
  color: #FEE989;
}

.me .underline,
.headline a {
  text-decoration: underline;
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
}

.hero {
  align-items: start;
}

.hero-text {
  grid-column: 1 / span 8;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.headline {
  margin: 0;
  padding: 0;
  font-size: 56px;
  font-weight: 400;
  line-height: 1.08;
  letter-spacing: -3px;
}

.hero-photo {
  grid-column: 10 / span 3;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: 62% 50%;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 32px;
}

.me .resume-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 24px;
  border: 1px solid currentColor;
  color: var(--accent);
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 15px;
}

.section {
  padding-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.section-label {
  grid-column: 1 / span 3;
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  font-style: normal;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.section-body {
  grid-column: 4 / span 9;
  font-size: 20px;
  letter-spacing: -0.5px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.aside {
  flex-shrink: 0;
  padding-top: 4px;
  font-size: 15px;
  letter-spacing: 0;
  color: var(--aside);
}

.aside.current {
  color: var(--accent);
}

.entry {
  display: grid;
  grid-template-columns: minmax(0, 4fr) minmax(0, 4fr) minmax(0, 1fr);
  column-gap: 24px;
  row-gap: 6px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.entry:first-child {
  padding-top: 0;
}

.entry:last-child {
  border-bottom: none;
}

.entry .aside {
  text-align: right;
}

.entry-role {
  color: #CFCFCF;
}

.entry-desc {
  grid-column: 1 / span 2;
  font-size: 15px;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--aside);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.honors {
  gap: 32px;
}

.awards {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 20px;
}

.award {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;
  line-height: 1.4;
  letter-spacing: 0;
  color: #CFCFCF;
}

.award img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
}

@media (max-width: 860px) {
  .me {
    padding: 40px 20px 100px;
    gap: 56px;
  }

  .hero-text,
  .hero-photo,
  .section-label,
  .section-body {
    grid-column: 1 / -1;
  }

  /* Photo leads on narrow screens. */
  .hero-photo {
    grid-row: 1;
    max-width: 200px;
    margin-bottom: 24px;
  }

  .headline {
    font-size: 40px;
    letter-spacing: -2px;
  }

  .section-label {
    margin-bottom: 16px;
  }

  /* Org and year share a line; role drops below. */
  .entry {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .entry-role {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .entry-desc {
    grid-column: 1 / -1;
  }

  .awards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
