<template>
  <v-container>
    <v-img :class="
      $vuetify.display.mobile
        ? 'banner-image-mobile'
        : 'banner-image'
    " src="../assets/drink_lab.png"></v-img>
    <v-row :class="
       $vuetify.display.mobile
        ? 'banner-row-mobile'
        : 'banner-row'
    ">
      <p :class="
        $vuetify.display.mobile
          ? 'banner-text-mobile'
          : 'banner-text'
      ">
        {{ $t("message.cocktail_desc_before") }}
        <a href="mailto:calen0909@Hotmail.com" class="text-primary">
          {{ $t("message.cocktail_desc_link") }}
        </a> {{ $t("message.cocktail_desc_after") }}
      </p>
      <p>Note: all drinks can be made alcohol-free</p>
    </v-row>
    <div class="menu">
      <div class="mb-lg" v-for="item in menu" v-bind:key="item.name">
        <h3 class="text-center mb-sm">
          ~
          <a :href="item.link" class="link-white">{{
            item.name.toUpperCase()
          }}</a>
          ~
        </h3>
        <p class="menuItemText" v-for="(ingredient, index) in item.ingredients" v-bind:key="index">
          <span>{{ ingredient }}</span>
        </p>
        <p :class="
           $vuetify.display.mobile
            ? 'menuDescMobile'
            : 'menuDesc'
        ">
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
        name: "balboa milktea (White Russian Twist)",
        link: "https://mohaelder.github.io/me/blog?id=2d3a604cfaf311ec9fe5acde48001122",
        ingredients: [
          "Fresh Milk 30ml",
          "Homemade Earl Gray Vodka 45ml",
          "Kahlua Coffee Liquer 15ml",
          "Simple Syrup 30ml",
          "Boba",
        ],
        desc: "A bold reinvention of the classic milk tea, infused with the elegance of earl gray vodka for a deeper, richer flavor. Enhanced with the aromatic touch of Kahlua Coffee Liqueur, this cocktail brings a perfect balance of creamy sweetness and a warm, subtle kick. Named after San Diego's historic Balboa Park, it evokes a sense of exploration and sophistication, with a playful nod to the beloved \"boba\".",
      },
      {
        name: "Earl Grey Sour (Daiquiri Twist)",
        link: "https://mohaelder.github.io/me/blog?id=bb309f2fb17011ecbef668545a57002a",
        ingredients: [
          "Homemade Earl Grey Vodka 45ml",
          "Lime Juice 25ml",
          "Simple Syrup 15ml",
        ],
        desc: "Born at the acclaimed Sober Company, once a jewel among Asia's Best 50 Bars, this cocktail experienced its prime before fading from the limelight. We've meticulously reverse-engineered this classic to revive one of our all-time favorites. Experience a harmonious blend of sweet and sour, accented with refreshing notes of lime and the deeply infused elegance of Earl Grey tea. A timeless toast to the past, reborn for your enjoyment.",
      },
      {
        name: "black's beach iced tea (Long Island Iced Tea Twist)",
        link: "baidu.com",
        ingredients: [
          "Scottish Gin 30ml",
          "Tequila 15ml",
          "Vodka 15ml",
          "White Rum 15ml",
          "Triple Sec 15ml",
          "Simple Syeup 20ml",
          "Lime Juice 25ml",
          "Cola 1 dash",
        ],
        desc: "Inspired by the serene sunsets at Black's Beach in La Jolla, this cocktail delivers a bold twist on the classic Long Island Iced Tea. Infused with robust Scottish gin, it offers a deeper, herbal profile that sets it apart. A splash of fresh lime juice adds a crisp, revitalizing note, evoking the cool, breezy evenings by the shore.",
      },
      {
        name: "blue sky (from cafe yooky) (alcohol free not available)",
        link: "baidu.com",
        ingredients: [
          "Peach Schnapps 15ml",
          "(sky) Gin 10ml",
          "(sky)Blue Curacao 10ml",
          "Overproof Rum 7ml",
          "Fresh Milk 1/2 Tbsp",
          "Salt 1 pinch",
        ],
        desc: "A visually stunning cocktail that paints a flaming rainy blue sky in your glass. Delight in the sweet, juicy essence of peach paired with the herbal depth of gin, all complemented by the soothing touch of fresh milk. This drink evokes the cozy, tranquil feeling of sitting in a café, watching the rain fall outside—a perfect blend of comfort and elegance.",
      },
      {
        name: "Johnny Silverhand",
        link: "https://mohaelder.github.io/me/#/blog?id=d6ffad89baf711eca94e68545a57002a",
        ingredients: [
          "Tequila 20ml",
          "Overproof Rum 25ml",
          "Cointreau/Triple Sec 30ml",
          "Blue Agave Syrup 15ml",
          "Chili Pepper 15ml",
        ],
        desc: "A bold, sweet, and strong cocktail that packs a punch from the very first sip. Infused with an unexpected kick of spice, this drink is inspired by Johnny Silverhand, the legendary lone wolf punk star of Cyberpunk 2077. The unique blend of sweet and fiery flavors captures the essence of his rebellious spirit and enigmatic presence.",
      },
      // {
      //   name: "Lychirui (Daiquiri Twist)",
      //   link: "baidu.com",
      //   ingredients: [
      //     "Fresh Lychi 3-5",
      //     "Earl Gray Vodka 30ml",
      //     "Simple Syrup 15ml",
      //     "Lime Juice 20ml",
      //   ],
      //   desc: "A",
      // },
      {
        name: "Jade Grape Juice",
        link: "https://mohaelder.github.io/me/blog?id=bb309f2fb17011ecbef668545a57002a",
        ingredients: [
          "Fresh Grapes 7-12",
          "Irish Whisky 30ml",
          "Rum 45ml",
          "Cointreau/Triple Sec 30ml",
        ],
        desc: "A delicate blend of mild sweetness, subtle spice, and the zest of fresh grapefruit, inspired by the legendary ancient Chinese drink praised in the verses of the great Poet Li Bai. This cocktail evokes the poetic spirit and timeless elegance of his works, inviting you to sip and savor the essence of history and myth.",
      }
    ],
  }),
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>


<style scoped>
.menu {
  margin-top: 5%;
  margin-bottom: 5%;
}

.menuItemText {
  margin-bottom: 0px;
  text-align: center;
}

.menuDesc {
  text-align: center;
  margin-top: 10px;
  padding-left: 20%;
  padding-right: 20%;
}

.menuDescMobile {
  text-align: center;
  margin-top: 10px;
  padding-left: 5%;
  padding-right: 5%;
}
</style>