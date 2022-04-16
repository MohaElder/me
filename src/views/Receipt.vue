<template>
  <v-container>
    <v-img class="bannerImage" src="../assets/drink_lab.png"></v-img>
    <v-row style="padding-left: 30%; padding-right: 30%">
      <p style="text-align: justify; width: 100%; text-indent: 4%">
        酒鬼实验室是一个记录我瞎琢磨的鸡尾酒配发的地方。以下所有饮料不保证好喝，
        不保证安全，仅供参考。欢迎发送<a href="mailto:calen0909@Hotmail.com"
          >邮件</a
        >讨论。
      </p>
    </v-row>
    <v-row style="padding-left: 30%; padding-right: 30%">
      <p style="text-align: justify; width: 100%; text-indent: 4%">
        Alcoholic lab is a place where I take notes of the drinks that I
        developed for fun. All the drinks below are not guaranteed to be legit
        nor safe. They are just for hobby purposes. If you have some
        suggestions, please send me an
        <a href="mailto:calen0909@Hotmail.com">email</a> and we can talk!
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
          style="
            text-align: center;
            margin-top: 10px;
            padding-left: 30%;
            padding-right: 30%;
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
        name: "baboa milktea",
        link: "baidu.com",
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
        the aroma of coffee brought by Kahlua Coffee Liquer. P.S: The name Baboa is from Baboa Park in San Diego City. The name's \
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
        ingredients: ["Fresh Lychi 3-5", "Earl Gray Vodka 30ml", "Simple Syrup 15ml", "Lime Juice 20ml"],
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

.bannerItem {
  width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 2%;
  margin-bottom: 3%;
}

.menu {
  margin-top: 5%;
  margin-bottom: 5%;
}

.menuItemText {
  margin-bottom: 0px;
  text-align: center;
}
</style>