<script setup>
// If you want to use it in setup, import from the nuxtApp.
const { $pwa } = useNuxtApp()
</script>

<template>
  <!-- You can use $pwa directly in templates! -->
  <div v-if="$pwa?.needRefresh">
    <span>
      New content available, click on reload button to update.
    </span>

    <button @click="$pwa.updateServiceWorker()">
      Reload
    </button>
  </div>
</template>
