/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vuetify's stylesheet entry has no type declaration (TS 6 checks side-effect imports).
declare module 'vuetify/styles'
