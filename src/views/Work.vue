
<template >
  <v-container>
    <h1 class="big-title">Resume</h1>
    <v-btn
      x-large
      outlined
      color="white"
      href="https://github.com/MohaElder/me/raw/main/src/assets/resume.pdf"
      style="margin-left: 5px"
      >Download</v-btn
    >

    <v-row style="padding-left: 15px" justify="space-between">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1>Skills</h1>
        </v-row>
        <v-row>
          <h4>English, Mandarin, Asian Sign Language</h4>
        </v-row>
        <v-row>
          <h4>Java, JavaScript, C, C#, ARM Assembly, Python, Lua</h4>
        </v-row>
        <v-row>
          <h4>Unity3D, Virtualization, Web, CI/CD, Linux, Benchmark</h4>
        </v-row>
        <v-row>
          <h4>Sketch, XD, Figma, Abstract</h4>
        </v-row>
        <v-row>
          <h4>
            Photoshop, Premiere Pro, illustrator, After Effects, FinalCut Pro
          </h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5">
        <v-row style="margin-top: 50px">
          <h1>Contact</h1>
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
            <a href="https://linkedin.com/in/mohaelder">Linkedin</a>
          </h4>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="padding-left: 15px">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1>Education</h1>
        </v-row>
        <v-row>
          <h4>UCSD 🔱</h4>
        </v-row>
        <v-row>
          <h4>Shanghai High School International Division</h4>
        </v-row>
        <v-row>
          <h4>Shanghai WFL</h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5">
        <v-row style="margin-top: 50px">
          <h1>Great Stuff</h1>
        </v-row>
        <v-row>
          <h4>
            Co-founder of
            <a href="https://www.eroducate.xyz/">Eroducate</a>, a sex-ed
            organization in China
          </h4>
        </v-row>
        <v-row>
          <h4>
            Co-founder of More Club, the greatest high school club in SHSID
            history
          </h4>
        </v-row>
        <v-row>
          <h4>
            Co-organizer of
            <a
              href="https://www.youtube.com/watch?v=tM800TIQeIs"
              style="color: white"
              >TEDxSHSID</a
            >
          </h4>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="padding-left: 15px">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1>Work Experience</h1>
        </v-row>
        <v-row>
          <h4>Instructional Assistant @ UCSD</h4>
        </v-row>
        <v-row>
          <h4>Game Performance Analyst Intern @ NVIDIA</h4>
        </v-row>
        <v-row>
          <h4>SWE Intern @ Axiom Technology Group</h4>
        </v-row>
        <v-row>
          <h4>Photography Coach @ Vigorous Youth Training Camp</h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5">
        <v-row style="margin-top: 50px">
          <h1>Honors & News</h1>
        </v-row>
        <v-row>
          <h4>
            <a href="https://www.chinathinksbig.com/"
              >Harvard China Thinks Big</a
            >
            Young Innovator Award (1 out of 30,000 Nationalwide)
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a
              href="https://news.cgtn.com/news/3d3d674d7851544f33457a6333566d54/index.html"
              >Sex education game developed by Chinese high-school</a
            >
            - CGTN
          </h4>
        </v-row>
        <v-row>
          <h4>
            <a
              href="https://radiichina.com/chinese-high-school-students-release-interactive-sex-education-game/"
              >Chinese High School Students Release Interactive Sex Education
              Game</a
            >
            - RADII
          </h4>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="margin-bottom: 50px; padding-left: 15px">
      <v-col>
        <v-row style="margin-top: 50px">
          <h1>Published Projects</h1>
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
            <a href="https://www.eroducate.xyz/games/"
              >sex-education video game</a
            >
            that went viral and has highest DAU of 30,000
          </h4>
        </v-row>
        <v-row>
          <h4>
            Another
            <a href="https://www.eroducate.xyz/spermdash/"
              >sex-education video game</a
            >
            that not many people play, but I personally like it more
          </h4>
        </v-row>
      </v-col>
      <v-col style="padding-left: 35px" md="5"> </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/css-social-buttons/1.4.0/css/zocial.min.css";

.big-title {
  font-size: 150px;
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

