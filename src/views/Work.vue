<template>
  <v-container max-width="1920" style="padding-bottom: 100px;">
    <div class="intro-section">
      <v-img class="profile-image" src="../assets/profile_pic.jpg" cover :aspect-ratio="1">
      </v-img>
      <div class="intro-content">
        <h3 class="work-intro">
          {{ $t("message.work.a") }}
          <a href="https://aako.world/" target="_blank">{{ $t("message.work.b") }}</a>{{ $t("message.work.c")
          }}<a href="https://www.unops.org/" target="_blank">UN</a>{{ $t("message.and")
          }}<a href="https://www.nvidia.com/" target="_blank">NVIDIA</a>{{ $t("message.work.d") }}
          <a href="https://mohaelder.github.io/me/photos" target="_blank">{{ $t("message.pictures") }}</a>{{
            $t("message.work.e") }}
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
    </div>

    <div class="education-section">
      <h4 class="ucsd-bold">{{ $t("message.ucsd") }} </h4>
      <h4>{{ $t("message.shsid") }}</h4>
      <h4>{{ $t("message.wfl") }}</h4>
    </div>

    <div class="experience-greatstuff-row">
      <div class="experience-column">
        <h1>{{ $t("message.work_experience") }}</h1>
        <h4 class="bold-job-title">
          <span v-if="$t('message.work_experience_desc.aako_left') !== ''">{{
            $t("message.work_experience_desc.aako_left") }}, </span>
          <a href="https://aako.world/" target="_blank">{{
            $t("message.work_experience_desc.aako")
          }}</a>
          {{ $t("message.work_experience_desc.aako_right") }}
        </h4>
        <h4 class="bold-job-title">
          {{ $t("message.work_experience_desc.unops_2_left") }}
          {{ $t("message.work_experience_desc.unops_2") }}
          {{ $t("message.work_experience_desc.unops_2_right") }}
        </h4>
        <h4>
          <span v-if="$t('message.work_experience_desc.unops_left') !== ''">{{
            $t("message.work_experience_desc.unops_left") }} </span>
          {{
            $t("message.work_experience_desc.unops")
          }}
          {{ $t("message.work_experience_desc.unops_right") }}
        </h4>
        <h4>
          <span v-if="$t('message.work_experience_desc.esailab_left') !== ''">{{
            $t("message.work_experience_desc.esailab_left") }}, </span>
          {{ $t("message.work_experience_desc.esailab") }}
          {{ $t("message.work_experience_desc.esailab_right") }}
        </h4>
        <h4>
          <span v-if="$t('message.work_experience_desc.ucsd_left') !== ''">{{
            $t("message.work_experience_desc.ucsd_left") }}, </span>
          {{
            $t("message.work_experience_desc.ucsd")
          }}
          {{ $t("message.work_experience_desc.ucsd_right") }}
        </h4>

        <h4 class="bold-job-title">
          <span v-if="$t('message.work_experience_desc.nvidia_left') !== ''">{{
            $t("message.work_experience_desc.nvidia_left") }}, </span>
          {{
            $t("message.work_experience_desc.nvidia")
          }}
          {{ $t("message.work_experience_desc.nvidia_right") }}
        </h4>
        <h4>
          <span v-if="$t('message.work_experience_desc.axiom_left') !== ''">{{
            $t("message.work_experience_desc.axiom_left") }}, </span>
          {{ $t("message.work_experience_desc.axiom") }}
          {{ $t("message.work_experience_desc.axiom_right") }}
        </h4>
        <h4>
          <span v-if="$t('message.work_experience_desc.sdll_left') !== ''">{{
            $t("message.work_experience_desc.sdll_left") }}, </span>
          {{
            $t("message.work_experience_desc.sdll")
          }}
          {{ $t("message.work_experience_desc.sdll_right") }}
        </h4>
      </div>

      <div class="greatstuff-column">
        <h1>{{ $t("message.great_stuff") }}</h1>
        <h4>{{ $t("message.curator_uncommon_gallery") }}</h4>
        <h4>
          {{ $t("message.member_reporters_without_borders") }},
          <a href="https://rsf.org/en" target="_blank">Reporters Without Borders</a>
        </h4>
        <h4 class="bold-job-title">
          {{ $t("message.great_stuff_desc.ucla_before") }}
          {{ $t("message.great_stuff_desc.ucla") }}
          {{ $t("message.great_stuff_desc.ucla_after") }}
        </h4>
        <h4>
          {{ $t("message.great_stuff_desc.eroducate_before") }}
          <a href="https://www.eroducate.xyz/" target="_blank">{{
            $t("message.great_stuff_desc.eroducate_link")
          }}</a>
        </h4>
        <h4>
          {{ $t("message.great_stuff_desc.more_club") }}
        </h4>
        <h4>
          {{ $t("message.great_stuff_desc.tedx_before") }}
          <a href="https://www.youtube.com/watch?v=tM800TIQeIs" target="_blank" class="text-white">{{
            $t("message.great_stuff_desc.tedx_link") }}</a>
          {{ $t("message.great_stuff_desc.tedx_after") }}
        </h4>
      </div>
    </div>

    <div class="games-honors-row">
      <div class="games-column">
        <h1>{{ $t("message.games_open_source") }}</h1>
        <h4 class="bold-job-title">
          {{ $t("message.work_experience_desc.avian_enigma_left") }}
          <a href="https://store.steampowered.com/app/2784960/_/" target="_blank">{{
            $t("message.work_experience_desc.avian_enigma")
          }}</a>
          {{ $t("message.work_experience_desc.avian_enigma_right") }}
        </h4>
        <h4 class="bold-job-title">
          {{ $t("message.owner_uimf_svelte") }},
          <a href="https://github.com/UNOPS/uimf-svelte" target="_blank">
            Uimf-svelte
          </a>
        </h4>
        <h4>
          {{ $t("message.published_projects_desc.self_reliance_before") }}
          <a href="https://store.steampowered.com/app/1016110/Self_Reliance/" target="_blank">
            {{ $t("message.published_projects_desc.self_reliance_link") }}
          </a>
          {{ $t("message.published_projects_desc.self_reliance_after") }}
        </h4>
        <h4>
          {{ $t("message.published_projects_desc.sperm_dash_before") }}
          <a href="https://store.steampowered.com/app/1355880/SpermDash/" target="_blank">
            {{ $t("message.published_projects_desc.sperm_dash_link") }}
          </a>
          {{ $t("message.published_projects_desc.sperm_dash_after") }}
        </h4>
        <h4>
          {{ $t("message.published_projects_desc.trip_planning_before") }}
          <a href="https://lpat.netlify.app/" target="_blank">
            {{ $t("message.published_projects_desc.trip_planning_link") }}
          </a>
        </h4>

        <h1 class="articles-podcast-title">{{ $t("message.articles_podcast") }}</h1>
        <h4><a
            href="https://medium.com/@calen0909/implementing-semantic-search-with-openai-postgres-and-entity-framework-4414cf516b48"
            target="_blank">Implementing Semantic Search with OpenAI, Postgres, and Entity Framework</a></h4>
        <h4><a href="https://medium.com/@calen0909/why-dont-i-like-oas-how-to-design-a-good-oa-ac2716a71682"
            target="_blank">Why don't I like OAs & how to design a good OA</a></h4>
        <iframe id="embedPlayer"
          src="https://embed.podcasts.apple.com/us/podcast/randoms-hit-radio-vol-0-tgif%E7%89%B9%E8%BE%91-%E8%8A%82%E5%BA%86%E6%96%87%E5%8C%96-%E7%AC%A6%E5%8F%B7%E5%AD%A6-%E9%9F%B3%E4%B9%90%E9%89%88%E8%B5%8F-%E5%93%B2%E5%AD%A6-%E9%9A%8F%E4%BE%BF%E8%81%8A/id1694128032?i=1000618220058&amp;itsct=podcast_box_player&amp;itscg=30200&amp;ls=1&amp;theme=auto"
          height="175px" frameborder="0"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="autoplay *; encrypted-media *; clipboard-write" class="mt-lg w-full rounded-md" style="
             max-width: 660px;
             overflow: hidden;
             transform: translateZ(0px);
             animation: 2s ease 0s 6 normal none running loading-indicator;
             background-color: rgb(228, 228, 228);
           "></iframe>
      </div>

      <div class="honors-column">
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
          <a href="https://www.chinathinksbig.com/" target="_blank">{{
            $t("message.honors_and_news_desc.ctb_link")
          }}</a>
          {{ $t("message.honors_and_news_desc.ctb_source") }}
        </h4>
        <h4>
          <a href="https://news.cgtn.com/news/3d3d674d7851544f33457a6333566d54/index.html" target="_blank">{{
            $t("message.honors_and_news_desc.cgtn_link") }}</a>
          - {{ $t("message.honors_and_news_desc.cgtn_source") }}
        </h4>
        <h4>
          <a href="https://radiichina.com/chinese-high-school-students-release-interactive-sex-education-game/"
            target="_blank">Chinese {{ $t("message.honors_and_news_desc.radii_link") }}</a>
          - {{ $t("message.honors_and_news_desc.radii_source") }}
        </h4>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.intro-section {
  display: flex;
  align-items: flex-start;
  gap: 80px;
  align-self: stretch;
  margin-bottom: 30px;
}

.intro-content {
  flex: 6;
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
  margin-top: 40px;
  color: #FEFEFE;
}

.education-section h4 {
  margin: 0px 0;
  font-weight: 400;
  letter-spacing: -1px;
}

.experience-greatstuff-row {
  display: flex;
  gap: 80px;
  margin-top: 20px;
}

.experience-column,
.greatstuff-column {
  flex: 1;
}

.experience-column h1,
.greatstuff-column h1 {
  margin-bottom: 10px;
}

.experience-column h4,
.greatstuff-column h4 {
  margin: 0px 0;
}

.games-honors-row {
  display: flex;
  gap: 80px;
  margin-top: 40px;
}

.games-column,
.honors-column {
  flex: 1;
}

.games-column h1,
.honors-column h1 {
  margin-bottom: 10px;
}

.games-column h4,
.honors-column h4 {
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

.articles-podcast-title {
  margin-top: 40px;
  margin-bottom: 10px;
}

.ucsd-bold {
  font-weight: 700 !important;
}

.bold-job-title {
  font-weight: 700 !important;
}

.profile-image {
  width: 5%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
  flex-shrink: 0;
  aspect-ratio: 1;
}

@media (max-width: 768px) {
  .intro-section {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }

  .intro-content {
    gap: 30px;
    width: 100%;
    text-align: center;
  }

  .work-intro {
    font-size: 40px;
    letter-spacing: -2.4px;
  }

  .profile-image {
    width: 100%;
    height: auto;
    max-width: 200px;
  }

  .resume-buttons {
    gap: 8px;
    flex-direction: column;
    align-items: center;
  }

  .education-section {
    margin-top: 30px;
  }

  .experience-greatstuff-row {
    flex-direction: column;
    gap: 40px;
    margin-top: 30px;
  }

  .games-honors-row {
    flex-direction: column;
    gap: 40px;
    margin-top: 30px;
  }

  .articles-podcast-section {
    margin-top: 30px;
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

<script>
export default {
  data: () => ({}),
  created() {
    window.scrollTo(0, 0);
  },

};
</script>
