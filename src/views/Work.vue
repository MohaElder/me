
<template >
  <v-container>
    <h1 class="big-title">{{ $t("message.resume")}}</h1>
    <v-btn x-large outlined color="white" href="https://github.com/MohaElder/me/raw/main/src/assets/resume.pdf"
      style="margin-left: 5px">{{ $t("message.download")}}</v-btn>

    <v-row style="padding-left: 15px" justify="space-between">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1> {{ $t("message.skills") }} </h1>
        </v-row>
        <v-row>
          <h4>English, Mandarin, Spanish,</h4>
        </v-row>
        <v-row>
          <h4>Shanghainese, Asian Sign Language;</h4>
        </v-row>
        <v-row style="margin-top: 30px">
          <h4>JavaScript, TypeScript,</h4>
        </v-row>
        <v-row>
          <h4>Java, C, C++, C#,</h4>
        </v-row>
        <v-row>
          <h4>Python, Lua, ARM, Latex;</h4>
        </v-row>
        <v-row style="margin-top: 30px">
          <h4>Web, SQL, Container, CI/CD, Unix;</h4>
        </v-row>
        <v-row style="margin-top: 30px">
          <h4>Unity3D, Wwise, C4D;</h4>
        </v-row>
        <v-row style="margin-top: 30px">
          <h4>
            Adobe XD, Figma, Abstract;
          </h4>
        </v-row>
        <v-row style="margin-top: 30px">
          <h4>
            Ps, Pr, Ai, Ae, Lr, Id
          </h4>
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
            <a href="https://github.com/MohaElder">GitHub</a>
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a href="https://linkedin.com/in/mohaelder">{{ $t("message.linkedin") }}</a>
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
            <a href="https://www.eroducate.xyz/">{{ $t("message.great_stuff_desc.eroducate_link") }}</a>
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
            <a href="https://www.youtube.com/watch?v=tM800TIQeIs" style="color: white">{{ $t("message.great_stuff_desc.tedx_link") }}</a>
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
          <h4>{{ $t("message.work_experience_desc.unops") }} 🇺🇳</h4>
        </v-row>
        <v-row>
          <h4>{{ $t("message.work_experience_desc.ucsd") }}</h4>
        </v-row>
        <v-row>
          <h4>{{ $t("message.work_experience_desc.nvidia") }}</h4>
        </v-row>
        <v-row>
          <h4>{{ $t("message.work_experience_desc.axiom") }}</h4>
        </v-row>
        <v-row>
          <h4>{{ $t("message.work_experience_desc.sdll") }}</h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5">
        <v-row style="margin-top: 50px">
          <h1>{{ $t("message.honors_and_news") }}</h1>
        </v-row>
        <v-row>
          <h4>
            <a href="https://www.chinathinksbig.com/">{{ $t("message.honors_and_news_desc.ctb_link") }}</a>
            {{ $t("message.honors_and_news_desc.ctb_source") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a href="https://news.cgtn.com/news/3d3d674d7851544f33457a6333566d54/index.html">{{ $t("message.honors_and_news_desc.cgtn_link") }}</a>
            - {{ $t("message.honors_and_news_desc.cgtn_source") }}
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a href="https://radiichina.com/chinese-high-school-students-release-interactive-sex-education-game/">Chinese
              {{ $t("message.honors_and_news_desc.radii_link") }}</a>
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
          <h4>A REAL <a href="https://lpat.netlify.app/">trip planning app</a></h4>
        </v-row>
        <v-row>
          <h4>A live voting webapp for some AI projects @NVIDIA</h4>
        </v-row>
        <v-row>
          <h4>
            A game frame analyzer that does some OCR and Feature Matching using
            OpenCV @NVIDIA
          </h4>
        </v-row>
        <v-row>
          <h4>
            A
            <a href="https://www.eroducate.xyz/games/">sex-education video game</a>
            that went viral and has highest DAU of 30,000
          </h4>
        </v-row>
        <v-row>
          <h4>
            Another
            <a href="https://www.eroducate.xyz/spermdash/">sex-education video game</a>
            that not many people play, but I personally like it better
          </h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5"> </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

.big-title {
  font-size: 100px;
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
};
</script>

