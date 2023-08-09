<script lang="ts">
export default {
  setup() {
    const color = useColorMode()
    const toggle = computed(() => (color.value === 'dark' ? 'light' : 'dark'))
    return {
      toggle,
      color,
    }
  },
  methods: {
    toggleDark() {
      this.color.preference = this.toggle
    },
  },
}
</script>

<template>
  <button
    class="!outline-none"
    :aria-label="`Toggle ${toggle} mode`"
    :title="`Toggle ${toggle} mode`"
    @click="toggleDark()"
  >
    <div class="dark:i-carbon-moon i-carbon-sun" />
  </button>
</template>
