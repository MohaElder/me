<template>
  <v-container>
    <v-img
      :class="
        $vuetify.breakpoint.width < $vuetify.breakpoint.height
          ? 'bannerImageMobile'
          : 'bannerImage'
      "
      src="../assets/drink_lab.png"
    ></v-img>
    <v-row
      :class="
        $vuetify.breakpoint.width < $vuetify.breakpoint.height
          ? 'bannerRowMobile'
          : 'bannerRow'
      "
    >
      <p
        :classstyle="
          $vuetify.breakpoint.width < $vuetify.breakpoint.height
            ? 'bannerTextMobile'
            : 'bannerText'
        "
      >
      {{ $t("message.cocktail_desc_before") }}
        <a href="mailto:calen0909@Hotmail.com">
          {{ $t("message.cocktail_desc_link") }}
        </a>  {{ $t("message.cocktail_desc_after") }}
      </p>
    </v-row>
    <div class="menu">
      <div
        style="margin-bottom: 25px"
        v-for="item in menu"
        v-bind:key="item.name"
      >
        <h3 style="text-align: center; margin-bottom: 10px">
          ~
          <a :href="item.link" style="color: white">{{
            item.name.toUpperCase()
          }}</a>
          ~
        </h3>
        <p
          class="menuItemText"
          v-for="(ingredient, index) in item.ingredients"
          v-bind:key="index"
        >
          <span>{{ ingredient }}</span>
        </p>
        <p
          :class="
            $vuetify.breakpoint.width < $vuetify.breakpoint.height
              ? 'menuDescMobile'
              : 'menuDesc'
          "
        >
          <i>{{ item.desc }}</i>
        </p>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    menu: [
      {
        name: "balboa milktea",
        link: "https://mohaelder.github.io/me/#/blog?id=2d3a604cfaf311ec9fe5acde48001122",
        ingredients: [
          "Fresh Milk 30ml",
          "Homemade Earl Gray Vodka 45ml",
          "Kahlua Coffee Liquer 15ml",
          "Simple Syrup 30ml",
          "Boba 8-10",
        ],
        desc: "A milk tea cocktail that follows the classic flavor of a milk tea. But instead of black tea,\
        the earl gray vodka is being used instead. Alcohol is able to extract more flavor from the tea, resulting in \
        a richer taste comparing to normal black tea. The vodka itself also brings up a nice tipsy feeling combining with \
        the aroma of coffee brought by Kahlua Coffee Liquer. P.S: The name Balboa is from Balboa Park in San Diego City. The name's \
        similarity to Boba and the place's diverse and historical vibe makes it a perfect choice for the drink's name.",
      },
      {
        name: "black's beach iced tea",
        link: "baidu.com",
        ingredients: [
          "Scottish Gin 30ml",
          "Tequila 15ml",
          "Vodka 15ml",
          "White Rum 15ml",
          "Triple Sec 15ml",
          "Simple Syeup 20ml",
          "Lime Juice 25ml",
          "Cola 1dash",
        ],
        desc: "The name is from Blacks Beach at La Jolla. This drink possesses a \
        stronger taste of scorrish gin comparing to Long Island Iced Tea, resulting in hints of herb. \
        The use of lime juice also makes the drink more refreshing, making me think of the chilling sunset \
        at Black's Beach.",
      },
      {
        name: "respect women",
        link: "https://mohaelder.github.io/me/#/blog?id=d6ffad89baf711eca94e68545a57002a",
        ingredients: [
          "Tequila 20ml",
          "Overproof Rum 25ml",
          "Cointreau/Triple Sec 30ml",
          "Blue Agave Syrup 15ml",
          "Chili Pepper 15ml",
        ],
        desc: "A sweet yet strong drink with radically spicy first few sips",
      },
      {
        name: "lychirui",
        link: "baidu.com",
        ingredients: [
          "Fresh Lychi 3-5",
          "Earl Gray Vodka 30ml",
          "Simple Syrup 15ml",
          "Lime Juice 20ml",
        ],
        desc: "Under development",
      },
      {
        name: "Jade Grape Juice",
        link: "https://mohaelder.github.io/me/#/blog?id=bb309f2fb17011ecbef668545a57002a",
        ingredients: [
          "Fresh Grapes 7-12",
          "Irish Whisky 30ml",
          "Rum 45ml",
          "Cointreau/Triple Sec 30ml",
        ],
        desc: "A mildly sweet drink with a hint of spiciness and fresh grapefruit",
      },
    ],
  }),
};
</script>


<style scoped>
.bannerImage {
  width: 32.5%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  margin-bottom: 3%;
}

.bannerImageMobile {
  width: 82.5%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  margin-bottom: 10%;
}

.bannerItem {
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  margin-bottom: 3%;
}

.bannerText {
  text-align: justify;
  width: 100%;
  text-indent: 4%;
}

.bannerTextMobile {
  text-align: justify;
  width: 100%;
  font-size: 2%;
}

.menu {
  margin-top: 5%;
  margin-bottom: 5%;
}

.menuItemText {
  margin-bottom: 0px;
  text-align: center;
}

.bannerRow {
  padding-left: 30%;
  padding-right: 30%;
}

.bannerRowMobile {
  padding-left: 5%;
  padding-right: 5%;
}

.menuDesc {
  text-align: center;
  margin-top: 10px;
  padding-left: 30%;
  padding-right: 30%;
}

.menuDescMobile {
  text-align: center;
  margin-top: 10px;
  padding-left: 5%;
  padding-right: 5%;
}
</style>