
<template >
  <v-container>
    <h1 class="big-title">{{ $t("message.open_source") }}</h1>
    <p class="text-justify" style="width: 70%">
      {{ $t("message.open_source_desc") }}
    </p>

    <p class="text-justify" style="width: 70%">
      {{ $t("message.open_source_desc_2") }}
    </p>

    <p class="text-justify" style="width: 70%">
      {{ $t("message.open_source_desc_3") }}
      <a href="https://github.com/MohaElder?tab=repositories">{{ $t("message.open_source_desc_3_link") }}</a>.
    </p>

    <v-row justify="start">
      <v-col>
        <v-row style="margin-top: 50px">
          <v-col>
            <v-card max-width="700" @click="() => {
              nav('https://github.com/UNOPS/uimf-svelte');
            }
              " style="margin-bottom: 50px">
              <v-img class="white--text align-end" src="../assets/osp/uimf-svelte.png">
                <v-card-title>uimf-svelte</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  uimf-svelte is a svelte implementation of uimf components that can be created by metadata configs from
                  the backend service. All components are created by svelte and using Bootstrap for styles. This
                  combination granted this project small size and great compatibility with any environments(thanks to
                  svelte and vite), and Bootstrap gives it a clean and modern look(with full bootstrap customization
                  ability).
                </div>
              </v-card-text>
            </v-card>
            <v-card max-width="700" @click="() => {
              nav('https://github.com/MohaElder/SvelteComponents');
            }
              " style="margin-bottom: 50px">
              <v-img class="white--text align-end" src="../assets/osp/svelte.png">
                <v-card-title>use-svelte-anywhere</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  use-svelte-anywhere is a project that started from a story I was working on during work. We want to
                  slowly transition the project from Angular js to svelte, and we decided to do that with creating web
                  components with svelte and use them in Angular js. The project includes a workflow that we are using to
                  build web components and bundle them into the larger project. It contains configuration files and
                  templates that allows you to easily build upon and create your own web component for any frameworks.
                  <br>
                  In a short, this project shows you how to build universal web components with svelte using its client
                  side component api.
                </div>
              </v-card-text>
            </v-card>
            <v-card max-width="700" @click="() => {
              nav('https://github.com/MohaElder/Trip');
            }
              " style="margin-bottom: 50px">
              <v-img class="white--text align-end" src="../assets/osp/Banner.jpg">
                <v-card-title>Let's Plan A Trip</v-card-title>
              </v-img>
              <v-card-text class="text--primary">
                <div>
                  {{ $t("message.open_source_projects.lpat") }}
                </div>
              </v-card-text>
            </v-card>
            <v-card max-width="700" @click="() => {
              nav('https://github.com/MohaElder/gpa-c');
            }
              " style="margin-bottom: 50px">
              <v-img class="white--text align-end" src="../assets/osp/gpac.png">
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
            <v-card max-width="700" @click="() => {
              nav(
                'https://github.com/MohaElder/Eroducate/blob/master/README.md'
              );
            }
              " style="margin-bottom: 50px">
              <v-img class="white--text align-end" src="../assets/osp/eroducate.png">
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
            <v-card max-width="700" @click="() => {
              nav('https://github.com/MohaElder/AnnoWikiTool');
            }
              " style="margin-bottom: 50px">
              <v-img class="white--text align-end" src="../assets/osp/anno.png">
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
            <v-card max-width="700" @click="() => {
              nav('https://github.com/Eroducate/project-megabunus-portal');
            }
              " style="margin-bottom: 50px">
              <v-img class="white--text align-end" src="../assets/osp/megabunus.png">
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
  mounted() { window.scrollTo(0, 0); },
  methods: {
    nav(str) {
      window.location.href = str;
    },
  },
};
</script>

