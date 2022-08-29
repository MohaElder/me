
<template >
  <v-container>
    <h1 class="big-title">Open Source Projects</h1>
    <p class="text-justify" style="width: 70%">
      I believe that Open Source is a must to achieve Net Neutrality and
      Democracy. In addition to accomplishing those 'Big Word' milestones, Open
      Source communities have provided millions of excellent products that
      powered our world in a civilized fashion. Therefore, I wish to become an
      active participant in this community, and hope that I could become a
      notable contributor one day.
    </p>

    <p class="text-justify" style="width: 70%">
      Below are my active open source projects. If you like them, feel free to
      give them a star. If you would like to contribute, I am more than happy to
      accept issues and PRs!
    </p>

    <p class="text-justify" style="width: 70%">
      P.S: There are also some repositories that I did not list below. Most of
      my repositories are public, they are not shown below is likely becaue
      their scale or purpose are too specific thus may not be applicable to
      become a 'project'. But many of them are also interesting! Feel free to
      check them out<a href="https://github.com/MohaElder?tab=repositories"
        >&nbsp;here</a
      >.
    </p>

    <v-row justify="start">
      <v-col>
        <v-row style="margin-top: 50px">
          <v-col>
            <v-card
              max-width="700"
              @click="
                () => {
                  nav('https://github.com/MohaElder/Trip');
                }
              "
              style="margin-bottom: 50px"
            >
              <v-img
                class="white--text align-end"
                height="200px"
                src="../assets/osp/Banner.jpg"
              >
                <v-card-title>Let's Plan A Trip</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  "Let's Plan A Trip" is a trip planner that focuses on planning
                  the trip. Unlike most other trip planning apps that emphasizes
                  on route planning, providing you a fancy map and charging you
                  for exporting their route into Google Maps, Let's Plan A
                  Trip's goal is to really help you plan a trip by providing you
                  a variety of handy tools that I the author use to plan my
                  trips in a elegant and neat format. and it's free~
                </div>
              </v-card-text>
            </v-card>
            <v-card
              max-width="700"
              @click="
                () => {
                  nav('https://github.com/MohaElder/gpa-c');
                }
              "
              style="margin-bottom: 50px"
            >
              <v-img
                class="white--text align-end"
                height="200px"
                src="../assets/osp/gpac.png"
              >
                <v-card-title>gpa-c</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  gpa-c is a light weight GPA calculator framework based on
                  JavaScript(ES6) gpa-c works for all popular frontend framworks
                  like React, Vue, Wechat Miniapp, and etc. Feel free to visit
                  other branches where you can see the author's previous version
                  of the code.
                </div>
              </v-card-text>
            </v-card>
            <v-card
              max-width="700"
              @click="
                () => {
                  nav(
                    'https://github.com/MohaElder/Eroducate/blob/master/README.md'
                  );
                }
              "
              style="margin-bottom: 50px"
            >
              <v-img
                class="white--text align-end"
                height="200px"
                src="../assets/osp/eroducate.png"
              >
                <v-card-title style="color: black">Eroducate</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  This is a guideline document that offers suggestions on
                  creating a multi-ended visual novel. It introduces an
                  innovative rename method named FASMEC that can be used in
                  professional film making.
                </div>
              </v-card-text>
            </v-card>
            <v-card
              max-width="700"
              @click="
                () => {
                  nav('https://github.com/MohaElder/AnnoWikiTool');
                }
              "
              style="margin-bottom: 50px"
            >
              <v-img
                class="white--text align-end"
                height="200px"
                src="../assets/osp/anno.png"
              >
                <v-card-title>Anno Wiki Tool</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  Anno Wiki Tool is a python script that is used to boost the
                  efficiency on cloning Anno Fandom to Anno Huiji. Technically
                  it can also be used for all the Fandom sites. It currently has
                  the following features: Convert Fandom Templates into Huiji
                  Format(Anno 1800 Building Construction Template Specific)
                  Downloading Pictures from specific sites Downloading Pictures
                  from icon site(Anno 1800 Specific) Theoretically the second
                  feature could be applied to all Fandom sites as long as they
                  all have the same class attribute and element arrangements.
                </div>
              </v-card-text>
            </v-card>
            <v-card
              max-width="700"
              @click="
                () => {
                  nav('https://github.com/Eroducate/project-megabunus-portal');
                }
              "
              style="margin-bottom: 50px"
            >
              <v-img
                class="white--text align-end"
                height="200px"
                src="../assets/osp/megabunus.png"
              >
                <v-card-title style="color: black">Project Megabunus</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  Project Megabunus's goal
                  is to build an easy-to-use web service for visual novel games
                  (like Self-Reliance). The service allows visualized codeless
                  level editing, live level loading from the game, live
                  translation, statistics, and etc. This service will include three parts:
                  frontend portal, backend server, and the game client. We hope
                  to create a complete production cycle for visual novel that
                  enable us to quickly deploy and manage contents of the game.
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
@import "https://cdnjs.cloudflare.com/ajax/libs/css-social-buttons/1.4.0/css/zocial.min.css";

.big-title {
  font-size: 50px;
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
  methods: {
    nav(str) {
      window.location.href = str;
    },
  },
};
</script>

