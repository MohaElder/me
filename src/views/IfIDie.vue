<template>
  <v-container style="
      padding-left: 10%;
      padding-right: 10%;
      padding-bottom: 7%;
      padding-top: 2%;
    ">
    <v-row style="text-align: start; margin-bottom: 30px">
      <p>
        {{ $t("message.if_i_die_brief") }}
      </p>
    </v-row>
    <v-row>
      <p>

        {{ $t("message.if_i_die_music") }}

      </p>
    </v-row>
    <v-row style="margin-bottom: 30px">
      <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450"
        style="width:100%;max-width:660px;overflow:hidden;background:transparent;"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src="https://embed.music.apple.com/us/playlist/play-when-im-dead/pl.u-vxy6kEjtym8Y9v"></iframe>
    </v-row>
    <v-row>
      <p>

        {{ $t("message.if_i_die_encryption_note") }}

      </p>
    </v-row>
    <v-row>
      <p>
        {{ $t("message.if_i_die_encryption_instructions") }}
        <br />
        <span style="color: #ffd738">{{ $t("message.if_i_die_encryption_dev_note") }}</span>
      </p>
    </v-row>

    <v-row>
      <v-col><v-text-field v-model="data" label="Paste Message here" color="#ffd738"></v-text-field></v-col>
      <v-col><v-text-field v-model="key" label="Paste key here" color="#ffd738"></v-text-field></v-col>
    </v-row>
    <v-row>
      <v-btn @click="encrypt" style="margin-right: 10px">Encrypt</v-btn><v-btn color="#ffd738" style="color: black"
        @click="decrypt">Decrypt</v-btn>
    </v-row>
    <v-row>
      <div style="margin-top: 20px; overflow: hidden" v-for="data in eulogies" v-bind:key="data">
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
      sharon:
        "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",
    },
    key: "",
    data: "",
  }),
  components: {},
  beforeMount() { },
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