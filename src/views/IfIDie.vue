<template>
  <v-container
    style="
      padding-left: 10%;
      padding-right: 10%;
      padding-bottom: 7%;
      padding-top: 2%;
    "
  >
    <v-row style="text-align: center; margin-bottom: 30px">
      <p>
        您好，欢迎访问这个页面。这个页面包含了我的遗言，以及遗嘱。本页面将会不定期更新，直至其正式生效。
      </p>
    </v-row>
    <v-row>
      <v-col
        ><v-text-field v-model="data" label="Paste Message here"></v-text-field
      ></v-col>
      <v-col
        ><v-text-field v-model="key" label="Paste key here"></v-text-field
      ></v-col>
      <v-col
        ><v-btn @click="encrypt" style="margin-right: 10px">Encrypt</v-btn
        ><v-btn @click="decrypt">Decrypt</v-btn></v-col
      >
    </v-row>
    <h2>以下数据为我的遗言，皆进行了AES-128加密，可通过相应的key解密</h2>
    <p>
      解密方式：将你收到的key粘贴在Paste key
      here处，并且点击DECRYPT按钮。如果key合法，相应的加密文本将解锁，否则不会有任何反应。
      示例key: TEST@TEST
    </p>
    <v-row>
      <div style="margin-top: 20px" v-for="data in eulogies" v-bind:key="data">
        <p v-if="data.includes('DECRYPTED')"><span v-html="data"></span></p>
        <p v-else style="overflow: hidden; text-overflow: ellipsis">
          {{ data }}
        </p>
      </div>
    </v-row>
  </v-container>
</template>

<script>
var CryptoJS = require("crypto-js");

export default {
  data: () => ({
    icons: [
      "mdi-link-box-variant-outline",
      "mdi-twitter",
      "mdi-linkedin",
      "mdi-facebook",
    ],
    copied: false,
    decrypted: "decrypted text goes here",
    eulogies: {
      test: "U2FsdGVkX1/i7ZE0XAaJYtGJMTWrSgt+1P8uUvDY8X6csMFigwQScWLkOphoE4o+d1xZ/HOkpSZJZXhBkbguL7Q5+pKEDQE45guf0BkxtjQ=",
      general:
        "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",
    },
    key: "",
    data: "",
  }),
  components: {},
  beforeMount() {},
  methods: {
    encrypt() {
      var ciphertext = CryptoJS.AES.encrypt(
        "DECRYPTED " + this.data,
        this.key
      ).toString();
      console.log(ciphertext);
    },
    decrypt() {
      var bytes, originalText;
      var that = this;
      for (var key in this.eulogies) {
        bytes = CryptoJS.AES.decrypt(this.eulogies[key], this.key);
        try {
          originalText = bytes.toString(CryptoJS.enc.Utf8);
          console.log(originalText)
          if (originalText.includes("DECRYPTED")) {
            that.eulogies[key] = originalText;
          }
        } catch (e) {
          console.warn("Failed to decrypt: " + key);
        }
      }
    },
  },
};
</script>

<style>
h1 {
  font-weight: 400;
}
</style>