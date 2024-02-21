module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  "extends": [
    "@unocss",
    "@nuxt/eslint-config",
    "plugin:prettier/recommended"
  ],
  "rules": {
    "vue/multi-word-component-names": "off",
    "vue/no-v-html": "off",
    "vue/require-default-prop": "off",
    "vue/require-prop-types": "off"
  }
}
