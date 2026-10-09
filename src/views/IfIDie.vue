<template>
  <div class="die">
    <header class="die-header">
      <h1 class="title">{{ $t("message.if_i_die_title") }}</h1>
      <p class="lede">{{ $t("message.if_i_die_brief") }}</p>
    </header>

    <!-- Once the letter has slid out, the envelope fades away and the full letter takes its place. -->
    <Transition name="fade" mode="out-in">
    <!-- Layers, back to front: envelope back, letter, front pocket, flap, seal. -->
    <div v-if="!unfolded" class="stage" :class="{ shake, open: letter }" aria-hidden="true">
      <div class="envelope">
        <div class="back"></div>
        <div class="paper" :class="{ open: letter }">
          <span class="paper-label">{{ $t("message.if_i_die_for_you") }}</span>
          <div class="letter-text" v-html="letterHtml"></div>
        </div>
        <div class="front"></div>
        <div class="flap" :class="{ open: letter }"></div>
        <div class="seal" :class="{ open: letter }"><v-icon size="26">mdi-lock-outline</v-icon></div>
      </div>
    </div>

    <article v-else class="letter" aria-live="polite">
      <span class="paper-label">{{ $t("message.if_i_die_for_you") }}</span>
      <div class="letter-text" v-html="letterHtml"></div>
      <span class="paper-sign">{{ $t("message.if_i_die_sign") }}</span>
    </article>
    </Transition>

    <button v-if="unfolded" class="reseal" type="button" @click="reseal">
      <v-icon size="18">mdi-email-lock-outline</v-icon>{{ $t("message.if_i_die_reseal") }}
    </button>

    <form v-if="!letter" class="key-form" @submit.prevent="unlock">
      <label for="key">{{ $t("message.if_i_die_key_label") }}</label>
      <div class="key-row">
        <input id="key" v-model="key" autocomplete="off" spellcheck="false" placeholder="TEST@TEST">
        <button type="submit">{{ $t("message.if_i_die_unlock") }}</button>
      </div>
      <span v-if="wrong" class="wrong" role="status">{{ $t("message.if_i_die_wrong") }}</span>
      <span v-else class="hint">{{ $t("message.if_i_die_example") }}</span>
    </form>

    <section class="playlist">
      <p>{{ $t("message.if_i_die_music") }}</p>
      <iframe allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" height="450"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
        src="https://embed.music.apple.com/us/playlist/play-when-im-dead/pl.u-vxy6kEjtym8Y9v"></iframe>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import CryptoJS from 'crypto-js'
import MarkdownIt from 'markdown-it'
import eulogies from '../utils/eulogies.json'

// Letters are sealed with `pnpm encrypt`, which prefixes this marker so a
// wrong key (which decrypts to garbage, or throws) is easy to tell apart.
const MARKER = 'DECRYPTED '

const key = ref('')
const letter = ref(null)
// Letters are Markdown; raw HTML is allowed since only `pnpm encrypt` can add one.
const md = new MarkdownIt({ html: true, breaks: true })
const letterHtml = computed(() => letter.value && md.render(letter.value))
const unfolded = ref(false)
const wrong = ref(false)
const shake = ref(false)

const open = (cipher) => {
  try {
    const text = CryptoJS.AES.decrypt(cipher, key.value.trim()).toString(CryptoJS.enc.Utf8)
    return text.startsWith(MARKER) ? text.slice(MARKER.length) : null
  } catch {
    return null
  }
}

const unlock = () => {
  letter.value = eulogies.map(open).find(Boolean) ?? null
  wrong.value = !letter.value
  if (letter.value) {
    setTimeout(() => (unfolded.value = true), 1500) // after seal, flap and slide finish
  } else {
    shake.value = true
    setTimeout(() => (shake.value = false), 450)
  }
}

const reseal = () => {
  key.value = ''
  letter.value = null
  unfolded.value = false
}

onMounted(() => window.scrollTo(0, 0))
</script>

<style scoped>
.die {
  --accent: #FDDA3A;
  --paper: #F6F2E9;
  max-width: 720px;
  margin: 0 auto;
  padding: 72px 24px 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  color: #FEFEFE;
  text-align: center;
}

/* Blog.vue's unscoped h1/p rules leak site-wide; pin what this page relies on. */
.die-header {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.title {
  margin: 0;
  padding: 0;
  font-size: 40px;
  font-weight: 400;
  letter-spacing: -2px;
}

.lede {
  margin: 0;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.6;
  color: #A8A8A8;
}

/* The envelope. The stage only grows to make room once the letter rises. */
.stage {
  position: relative;
  width: 100%;
  max-width: 520px;
  height: 300px;
  perspective: 1200px;
  transition: height 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s;
}

.stage.open {
  height: 520px;
}

.envelope {
  position: absolute;
  inset: auto 0 0;
  height: 300px;
}

.back {
  position: absolute;
  inset: 0;
  background: #CFC7B6;
}

.paper {
  position: absolute;
  inset: auto 24px 16px;
  height: 260px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  text-align: left;
  background: var(--paper);
  color: #1A1A1A;
  z-index: 1;
  transition: transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.35s;
}

.paper.open {
  transform: translateY(-200px);
}

.front {
  position: absolute;
  inset: 0;
  background: #E6DFD0;
  clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
  z-index: 2;
}

.flap {
  position: absolute;
  inset: 0 0 auto;
  height: 172px;
  background: #ECE6D9;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top;
  transition: transform 0.5s ease;
  z-index: 3;
}

.flap.open {
  transform: rotateX(180deg);
  z-index: 0;
}

.seal {
  position: absolute;
  left: 50%;
  top: 138px;
  width: 68px;
  height: 68px;
  margin-left: -34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: #1A1A1A;
  z-index: 4;
  transition: opacity 0.3s, transform 0.3s;
}

.seal.open {
  opacity: 0;
  transform: scale(0.6);
}

.shake {
  animation: shake 0.42s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(9px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(4px); }
}

.paper-label {
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7A7466;
}

.paper-sign {
  font-size: 15px;
  color: #5A5548;
}

/* The unfolded letter: real letters run long, so the full text lives here. */
.letter {
  width: 100%;
  max-width: 520px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
  background: var(--paper);
  color: #1A1A1A;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.letter-text {
  font-size: 18px;
  line-height: 1.7;
}

/* Rendered Markdown; Blog.vue's global h1/p rules would otherwise apply. */
.letter-text :deep(h1),
.letter-text :deep(h2),
.letter-text :deep(h3) {
  margin: 0 0 16px;
  padding: 0;
  font-size: 26px;
  font-weight: 500;
  font-style: normal;
  line-height: 1.3;
}

.letter-text :deep(p) {
  margin: 0 0 1em;
  font-size: inherit;
  font-weight: 400;
  line-height: inherit;
}

.letter-text :deep(> :last-child) {
  margin-bottom: 0;
}

/* The site's Helvetica Neue webfont has no real bold; fall back so emphasis shows. */
.letter-text :deep(strong) {
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 700;
}

.letter-text :deep(a) {
  color: inherit;
  text-decoration: underline;
}

.reseal {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 24px;
  border: 1px solid currentColor;
  color: #FEFEFE;
  font-size: 15px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.3s;
}

.reseal:hover {
  color: #FEE989;
}

/* The key */
.key-form {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.key-form label {
  font-size: 14px;
  color: #A8A8A8;
}

.key-row {
  display: flex;
  gap: 10px;
}

.key-row input {
  flex-grow: 1;
  min-width: 0;
  min-height: 52px;
  padding: 0 16px;
  background: #0E0E0E;
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #FEFEFE;
  font-size: 18px;
}

.key-row input:focus {
  outline: 2px solid #FEE989;
  outline-offset: 2px;
}

.key-row button {
  min-height: 52px;
  padding: 0 24px;
  background: var(--accent);
  color: #0A0A0A;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 0.3s;
}

.key-row button:hover {
  background: #FEE989;
}

.hint {
  font-size: 14px;
  color: #8A8A8A;
}

.wrong {
  font-size: 15px;
  color: #FF9B8A;
}

/* The playlist */
.playlist {
  width: 100%;
  max-width: 660px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.playlist p {
  margin: 0;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.6;
  color: #A8A8A8;
}

.playlist iframe {
  width: 100%;
  overflow: hidden;
  background: transparent;
}

@media (max-width: 600px) {
  .die {
    padding: 40px 20px 100px;
  }

  .stage {
    height: 240px;
  }

  .stage.open {
    height: 420px;
  }

  .envelope {
    height: 240px;
  }

  .paper {
    height: 200px;
    padding: 22px;
  }

  .paper.open {
    transform: translateY(-160px);
  }

  .flap {
    height: 136px;
  }

  .seal {
    top: 104px;
  }

  .letter {
    padding: 22px;
  }
}
</style>
