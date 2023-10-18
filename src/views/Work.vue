
<template >
  <v-container>
    <h3 class="text-left" :style="$vuetify.display.mobile ? 'font-size: 7.8vw;' : 'font-size: 5vh'">{{
      $t("message.work.a") }} <a href="https://ucsd.edu/"><i>UCSD</i></a>{{
    $t("message.work.b") }}<a href="https://www.unops.org/"><i>UNOPS</i></a>{{ $t("message.work.c") }}</h3>
    <v-img style="margin-top: 5%; padding: 20%; box-shadow: rgba(255, 255, 255, 0.15) 0px 48px 100px 0px;"
      :style="$vuetify.display.mobile ? 'width: 100%;' : 'width: 35%;'" src="../assets/profile_pic.jpg" cover></v-img>
    <h1 class="big-title">{{ $t("message.resume") }}</h1>
    <v-btn size="x-large" variant="outlined" color="#ffd738"
      href="https://github.com/MohaElder/me/raw/main/src/assets/resume.pdf" style="margin-left: 5px">{{
        $t("message.download") }}</v-btn>
    <v-btn v-if="$i18n.locale == 'zh'" size="x-large" variant="outlined" color="#ffd738"
      href="https://github.com/MohaElder/me/raw/main/src/assets/resume_cn.pdf" style="margin-left: 5px">中文简历</v-btn>
    <v-row style="padding-left: 15px" justify="space-between">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1> {{ $t("message.skills") }} </h1>
        </v-row>
        <v-row>

          <v-col style="margin-right: -30%;">
            <v-row>
              <h4>English, Mandarin, Thai</h4>
            </v-row>
            <v-row>
              <h4>Shanghainese, ASL</h4>
            </v-row>
            <v-row :style="$vuetify.display.mobile ? 'margin-top: 15%' : 'margin-top: 5%'">
              <h4>TypeScript, C#,</h4>
            </v-row>
            <v-row>
              <h4>Python, Java, Lua,</h4>
            </v-row>
            <v-row>
              <h4>C++, C, ARM</h4>
            </v-row>
            <span v-if="$vuetify.display.mobile"><v-row style="margin-top: 15%">
                <h4>SQL, STL, DevOps, Unit Testing,</h4>
              </v-row>
              <v-row>
                <h4>Domain-Driven Design, Model-View-ViewModel,</h4>
              </v-row>
              <v-row style="margin-top: 15%">
                <h4>
                  User Research, UI
                </h4>
              </v-row>
              <v-row>
                <h4>
                  Unity3D, Wwise
                </h4>
              </v-row>
              <v-row>
                <h4>
                  Ps, Pr, Ai, Ae, Lr, Id
                </h4>
              </v-row></span>
          </v-col>
          <v-col v-if="!$vuetify.display.mobile">
            <v-row>
              <h4>SQL, STL, DevOps, Unit Testing,</h4>
            </v-row>
            <v-row>
              <h4>Domain-Driven Design, Model-View-ViewModel,</h4>
            </v-row>
            <v-row style="margin-top: 5%">
              <h4>
                User Research, UI
              </h4>
            </v-row>
            <v-row>
              <h4>
                Unity3D, Wwise
              </h4>
            </v-row>
            <v-row>
              <h4>
                Ps, Pr, Ai, Ae, Lr, Id
              </h4>
            </v-row>
          </v-col>
        </v-row>

      </v-col>
      <v-col style="padding-left: 35px" md="5">
        <v-row style="margin-top: 50px">
          <h1>{{ $t("message.contact") }}</h1>
        </v-row>
        <v-row>
          <h4>
            <a href="mailto:yoh@ucsd.edu">yoh@ucsd.edu</a>
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a href="https://github.com/MohaElder" target="_blank">GitHub</a>
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a href="https://linkedin.com/in/mohaelder" target="_blank">{{
              $t("message.linkedin")
            }}</a>
          </h4>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="padding-left: 15px">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1>{{ $t("message.education") }}</h1>
        </v-row>
        <v-row>
          <h4>{{ $t("message.ucsd") }} 🔱</h4>
        </v-row>
        <v-row>
          <h4>{{ $t("message.shsid") }}</h4>
        </v-row>
        <v-row>
          <h4>{{ $t("message.wfl") }}</h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5">
        <v-row style="margin-top: 50px">
          <h1>{{ $t("message.great_stuff") }}</h1>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.great_stuff_desc.eroducate_before") }}
            <a href="https://www.eroducate.xyz/" target="_blank">{{
              $t("message.great_stuff_desc.eroducate_link")
            }}</a>
            {{ $t("message.great_stuff_desc.eroducate_after") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.great_stuff_desc.more_club") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.great_stuff_desc.tedx_before") }}
            <a
              href="https://www.youtube.com/watch?v=tM800TIQeIs"
              target="_blank"
              style="color: white"
              >{{ $t("message.great_stuff_desc.tedx_link") }}</a
            >
            {{ $t("message.great_stuff_desc.tedx_after") }}
          </h4>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="padding-left: 15px">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1>{{ $t("message.work_experience") }}</h1>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.work_experience_desc.unops_left") }}
            <a href="https://www.unops.org/" target="_blank">{{
              $t("message.work_experience_desc.unops")
            }}</a>
            {{ $t("message.work_experience_desc.unops_right") }}🇺🇳
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.work_experience_desc.ucsd_left") }}
            <a href="https://ucsd.edu/" target="_blank">{{
              $t("message.work_experience_desc.ucsd")
            }}</a>
            {{ $t("message.work_experience_desc.ucsd_right") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.work_experience_desc.nvidia_left") }}
            <a href="https://www.nvidia.com/en-us/" target="_blank">{{
              $t("message.work_experience_desc.nvidia")
            }}</a>
            {{ $t("message.work_experience_desc.nvidia_right") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.work_experience_desc.axiom_left") }}
            {{ $t("message.work_experience_desc.axiom") }}
            {{ $t("message.work_experience_desc.axiom_right") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.work_experience_desc.sdll_left") }}
            <a href="http://vttocamp.com/" target="_blank">{{
              $t("message.work_experience_desc.sdll")
            }}</a>
            {{ $t("message.work_experience_desc.sdll_right") }}
          </h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5">
        <v-row style="margin-top: 50px">
          <h1>{{ $t("message.honors_and_news") }}</h1>
        </v-row>
        <v-row>
          <h4>
            <a href="https://www.chinathinksbig.com/" target="_blank">{{
              $t("message.honors_and_news_desc.ctb_link")
            }}</a>
            {{ $t("message.honors_and_news_desc.ctb_source") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a
              href="https://news.cgtn.com/news/3d3d674d7851544f33457a6333566d54/index.html"
              target="_blank"
              >{{ $t("message.honors_and_news_desc.cgtn_link") }}</a
            >
            - {{ $t("message.honors_and_news_desc.cgtn_source") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a
              href="https://radiichina.com/chinese-high-school-students-release-interactive-sex-education-game/"
              target="_blank"
              >Chinese {{ $t("message.honors_and_news_desc.radii_link") }}</a
            >
            - {{ $t("message.honors_and_news_desc.radii_source") }}
          </h4>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="margin-bottom: 50px; padding-left: 15px">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1>{{ $t("message.published_projects") }}</h1>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.published_projects_desc.trip_planning_before") }}
            <a href="https://lpat.netlify.app/" target="_blank">
              {{ $t("message.published_projects_desc.trip_planning_link") }}
            </a>
          </h4>
        </v-row>
        <v-row>
          <h4>{{ $t("message.published_projects_desc.voting_app") }}</h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.published_projects_desc.ocr") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.published_projects_desc.self_reliance_before") }}
            <a href="https://www.eroducate.xyz/games/" target="_blank">
              {{ $t("message.published_projects_desc.self_reliance_link") }}
            </a>
            {{ $t("message.published_projects_desc.self_reliance_after") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            {{ $t("message.published_projects_desc.sperm_dash_before") }}
            <a href="https://www.eroducate.xyz/spermdash/" target="_blank">
              {{ $t("message.published_projects_desc.sperm_dash_link") }}
            </a>
            {{ $t("message.published_projects_desc.sperm_dash_after") }}
          </h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 20px" md="5">
        <v-row style="margin-top: 50px; padding-left: 15px">
          <h1>{{ $t("message.podcast") }}</h1>
        </v-row>
        <iframe
          id="embedPlayer"
          src="https://embed.podcasts.apple.com/us/podcast/randoms-hit-radio-vol-0-tgif%E7%89%B9%E8%BE%91-%E8%8A%82%E5%BA%86%E6%96%87%E5%8C%96-%E7%AC%A6%E5%8F%B7%E5%AD%A6-%E9%9F%B3%E4%B9%90%E9%89%B4%E8%B5%8F-%E5%93%B2%E5%AD%A6-%E9%9A%8F%E4%BE%BF%E8%81%8A/id1694128032?i=1000618220058&amp;itsct=podcast_box_player&amp;itscg=30200&amp;ls=1&amp;theme=auto"
          height="175px"
          frameborder="0"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="autoplay *; encrypted-media *; clipboard-write"
          style="
            margin-top: 25px;
            width: 100%;
            max-width: 660px;
            overflow: hidden;
            border-radius: 10px;
            transform: translateZ(0px);
            animation: 2s ease 0s 6 normal none running loading-indicator;
            background-color: rgb(228, 228, 228);
          "
        ></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.big-title {
  padding-top: 5%;
  font-size: 5vh;
}

h4 {
  font-weight: 400;
}

h1 {
  font-size: 150%;
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

