<template>
  <v-container class="work-page">
    <div class="intro-section">
      <div class="intro-content">
        <h3 class="work-intro">
          {{ $t("message.work.a") }}
          <a href="https://flick.art" target="_blank">{{ $t("message.work.b") }}</a>{{ $t("message.work.c")
          }}<a href="https://www.norra.io/" target="_blank">Norra</a>{{ $t("message.work.d")
          }}<a href="https://www.unops.org/" target="_blank">UN</a>{{ $t("message.and")
          }}<a href="https://www.nvidia.com/" target="_blank">NVIDIA</a>{{ $t("message.work.e") }}
          <a href="https://mohaelder.github.io/me/photos" target="_blank">{{ $t("message.pictures") }}</a>{{
            $t("message.work.f") }}
        </h3>
        <div class="resume-buttons">
          <v-btn rounded="xl" size="x-large" variant="outlined" color="#ffd738"
            href="https://github.com/MohaElder/me/raw/main/src/assets/yasushi_resume.pdf" class="ml-sm">{{
              $t("message.download") }}</v-btn>
          <v-btn rounded="xl" v-if="$i18n.locale == 'zh'" size="x-large" variant="outlined" color="#ffd738"
            href="https://github.com/MohaElder/me/raw/main/src/assets/resume_cn.pdf" class="ml-sm">中文简历</v-btn>

          <v-btn icon size="large" variant="text" color="#fefefe" href="mailto:calen0909@hotmail.com" target="_blank"
            class="social-icon-btn">
            <v-icon>mdi-email</v-icon>
          </v-btn>

          <v-btn icon size="large" variant="text" color="#fefefe" href="https://github.com/MohaElder" target="_blank"
            class="social-icon-btn">
            <v-icon>mdi-github</v-icon>
          </v-btn>

          <v-btn icon size="large" variant="text" color="#fefefe" href="https://linkedin.com/in/mohaelder"
            target="_blank" class="social-icon-btn">
            <v-icon>mdi-linkedin</v-icon>
          </v-btn>

          <v-btn icon size="large" variant="text" color="#fefefe" href="https://medium.com/@calen0909" target="_blank"
            class="social-icon-btn">
            <v-icon>mdi-bookshelf</v-icon>
          </v-btn>
        </div>

        <div class="social-buttons">
          <v-btn icon size="large" variant="text" color="#fefefe" href="mailto:calen0909@hotmail.com" target="_blank">
            <v-icon>mdi-email</v-icon>
          </v-btn>

          <v-btn icon size="large" variant="text" color="#fefefe" href="https://github.com/MohaElder" target="_blank">
            <v-icon>mdi-github</v-icon>
          </v-btn>

          <v-btn icon size="large" variant="text" color="#fefefe" href="https://linkedin.com/in/mohaelder"
            target="_blank">
            <v-icon>mdi-linkedin</v-icon>
          </v-btn>

          <v-btn icon size="large" variant="text" color="#fefefe" href="https://medium.com/@calen0909" target="_blank">
            <v-icon>mdi-bookshelf</v-icon>
          </v-btn>
        </div>
      </div>
      <v-img class="profile-image" src="../assets/profile_pic.jpg" cover :aspect-ratio="1">
      </v-img>
    </div>

    <div class="education-section">
      <h4 class="ucsd-bold">{{ $t("message.ucsd") }}</h4>
    </div>

    <div class="columns">
      <div v-for="section in sections" :key="section.title" class="column">
        <h1>{{ $t(section.title) }}</h1>
        <h4 v-for="item in section.items" :key="item.id">
          <i18n-t keypath="message.role_at" scope="global">
            <template #role>{{ $t(`message.entries.${item.id}.role`) }}</template>
            <template #org><a :href="item.href" target="_blank">{{ $t(`message.entries.${item.id}.org`) }}</a></template>
          </i18n-t>
        </h4>
      </div>
    </div>

    <div class="columns">
      <div class="column">
        <h1>{{ $t("message.articles") }}</h1>
        <h4><a href="https://medium.com/@calen0909/why-dont-i-like-oas-how-to-design-a-good-oa-ac2716a71682"
            target="_blank">Why don't I like OAs & how to design a good OA</a></h4>
        <h4><a
            href="https://medium.com/@calen0909/implementing-semantic-search-with-openai-postgres-and-entity-framework-4414cf516b48"
            target="_blank">Implementing Semantic Search with OpenAI, Postgres, and Entity Framework</a></h4>
      </div>

      <div class="column honors-column">
        <h1>{{ $t("message.honors_and_news") }}</h1>
        <div class="awards-grid">
          <div class="awards-row">
            <a href="https://www.photoawards.com/winner/zoom.php?eid=8-1722599429-25" target="_blank"
              class="award-link">
              <v-img src="../assets/ipa2025.png" cover class="award-image"></v-img>
            </a>
            <a href="https://www.photoawards.com/winner/zoom.php?eid=8-1722610316-25" target="_blank"
              class="award-link">
              <v-img src="../assets/ipa2025mention.png" cover class="award-image"></v-img>
            </a>
          </div>
          <div class="awards-row">
            <a href="https://ndawards.net/winners-gallery/nd-awards-2024/non-professional/photojournalism-story/hm/22290/"
              target="_blank" class="award-link">
              <v-img src="../assets/nd_awards_hm_2024.png" cover class="award-image"></v-img>
            </a>
            <a href="https://ndawards.net/winners-gallery/nd-awards-2024/non-professional/photojournalism-story/hm/22289/"
              target="_blank" class="award-link">
              <v-img src="../assets/nd_awards_hm_2024.png" cover class="award-image"></v-img>
            </a>
          </div>
        </div>
        <h4>
          <a href="https://news.cgtn.com/news/3d3d674d7851544f33457a6333566d54/index.html" target="_blank">{{
            $t("message.honors_and_news_desc.cgtn_link") }}</a>
          - {{ $t("message.honors_and_news_desc.cgtn_source") }}
        </h4>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
/* Page frame ported from the resume (src/App.svelte .page): a capped page with
   real side margins — the resume's 9.9mm left of a 210mm sheet is ~5% — so every
   block shares one left edge. Rhythm below follows the resume's 7mm section /
   5mm heading / 10.6mm column-gap proportions. */
.v-container.work-page {
  --section-gap: 56px;
  --heading-gap: 20px;
  --column-gap: 80px;
  max-width: 1600px;
  padding: 48px clamp(24px, 5vw, 96px) 100px;
}

.intro-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--column-gap);
  margin-bottom: var(--section-gap);
}

.intro-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.work-intro {
  color: #FEFEFE;
  font-family: "Helvetica Neue";
  font-size: 50px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -3.2px;
  margin: 0;
}

.resume-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.social-buttons {
  display: none;
}

@media (max-width: 768px) {
  .social-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 10px;
  }

  .resume-buttons .social-icon-btn {
    display: none;
  }
}

.education-section {
  margin-top: var(--section-gap);
  color: #FEFEFE;
}

.education-section h4 {
  margin: 0px 0;
  font-weight: 400;
  letter-spacing: -1px;
}

.columns {
  display: flex;
  gap: var(--column-gap);
  margin-top: var(--section-gap);
}

.column {
  flex: 1;
}

.column h1 {
  margin-bottom: var(--heading-gap);
}

.column h4 {
  margin: 0px 0;
}

.honors-column h4 {
  margin: 8px 0;
}

/* .awards-grid {
  margin: 20px 0;
} */

.awards-row {
  display: flex;
  margin-bottom: 20px;
  white-space: nowrap;
}

.award-link {
  display: inline-block;
  text-decoration: none;
  margin-right: 20px;
  transition: transform 0.2s ease;
}

.award-link:hover {
  transform: scale(1.05);
}

.award-image {
  width: 15vw;
  height: auto;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.award-image:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .awards-row {
    margin-bottom: 15px;
  }

  .award-image {
    width: 40vw;
  }
}

.ucsd-bold {
  font-weight: 700 !important;
}

/* flex, not width: Vuetify's .v-responsive sets `flex: 1 1 auto` on v-img, which
   would otherwise let the photo grow and drag a square gap down the page. */
.profile-image {
  flex: 0 0 140px;
  border-radius: 0;
}

@media (max-width: 768px) {
  /* Tighten the whole rhythm at once — every block reads these. */
  .v-container.work-page {
    --section-gap: 32px;
    --column-gap: 40px;
  }

  .intro-section {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }

  .intro-content {
    width: 100%;
    text-align: center;
  }

  .work-intro {
    font-size: 40px;
    letter-spacing: -2.4px;
  }

  /* Photo leads on narrow screens, as it did before the desktop reorder. */
  .profile-image {
    order: -1;
    flex: 0 0 auto;
    width: 100%;
    max-width: 200px;
  }

  .resume-buttons {
    gap: 8px;
    flex-direction: column;
    align-items: center;
  }

  .columns {
    flex-direction: column;
  }
}

h4 {
  font-weight: 400;
  letter-spacing: -1px;
}

h1 {
  color: #FFF;
  font-family: "Helvetica Neue";
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: -1px;
  text-transform: uppercase;
}

.v-application a {
  color: white;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue'

// Mirrors the resume's two experience columns; text lives in messages.entries.
const sections = [
  {
    title: 'message.work_experience',
    items: [
      { id: 'flick', href: 'https://flick.art' },
      { id: 'norra', href: 'https://www.norra.io/' },
      { id: 'aako', href: 'https://aako.world/' },
      { id: 'unops', href: 'https://www.unops.org/' },
      { id: 'ucsd', href: 'https://ucsd.edu/' },
      { id: 'nvidia', href: 'https://www.nvidia.com/' },
    ],
  },
  {
    title: 'message.fun_experience',
    items: [
      { id: 'avian_enigma', href: 'https://store.steampowered.com/app/2784960/_/' },
      { id: 'uimf_svelte', href: 'https://github.com/UNOPS/uimf-svelte' },
      { id: 'self_reliance', href: 'https://store.steampowered.com/app/1016110/Self_Reliance/' },
      { id: 'openenlarge', href: 'https://github.com/MohaElder/openenlarge' },
      { id: 'ucla' },
      { id: 'more_club' },
    ],
  },
]

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>
