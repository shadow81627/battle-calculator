<script setup>
const { data, pending } = useFetch('/api/battlescribe/library')
</script>

<template>
  <section class="container">
    <h1 class="h2">
      BattleScribe Library Data
    </h1>
    <div>
      BSData organisation created this project. It's a GitHub repository of datafiles. Maintained by community, in no way endorsed by BattleScribe or any other company/publisher.
    </div>
  </section>
  <Spinner v-if="pending" class="mx-auto h-64px w-64px" />
  <span v-else-if="!data">No data found</span>
  <div v-else class="m-10">
    <BSAccordion :selections="data.data" />
  </div>
</template>
