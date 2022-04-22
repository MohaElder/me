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
      <p>
        Hello! Welcome to this page. This page hosts my final words. The page
        would non-periodically update until the day finally comes
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
    <h2>
      The following data is my eulogy, they are all encrypted in AES-128, and
      can be decrypted with the corresponding key
    </h2>
    <p>
      解密方式：将你收到的key粘贴在Paste key
      here处，并且点击DECRYPT按钮。如果key合法，相应的加密文本将解锁，否则不会有任何反应。
      示例key: TEST@TEST
    </p>
    <p>Instruction: Paste your key at Paste key here, then click DECRYPT button. If the key is valid, the 
      encrypted text will be unlocked, otherwise no response.
      Example key: TEST@TEST
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
          console.log(originalText);
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