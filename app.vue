<script setup lang="ts">
import { appName } from "~/constants";

useHead({
  title: appName,
});
</script>

<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator />
  <Body class="dark:bg-dark dark:text-light !print:bg-light !print:text-dark">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Body>
</template>
