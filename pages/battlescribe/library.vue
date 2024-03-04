<script setup>
const { data, pending } = await useFetch("/api/battlescribe/library");
const primaryColor = "#536766";
</script>

<template>
  <div>
    <FancyScribeRoster
      v-if="data.fancyscribe"
      :roster="data.fancyscribe"
      :style="{
        '--primary-color': primaryColor,
        '--primary-color-transparent': `${primaryColor}60`,
      }"
      class="bg-light text-dark"
    />
    <Spinner v-if="pending" class="mx-auto h-64px w-64px" />
    <span v-else-if="!data">No data found</span>
    <div v-else-if="false" class="m-10">
      <template v-if="data.catalogue">
        <!-- <BattleScribeEntryLink
          v-for="entry of data.catalogue.entryLinks"
          :key="entry.id"
          :entry-link="entry"
          :library="data.library"
        >
        </BattleScribeEntryLink> -->
      </template>

      <!-- <BattleScribeRoster
        :game-system="data.gameData.gameSystem"
        :catalogue="data.catalogue"
      ></BattleScribeRoster> -->

      <!-- <BattleScribeUnit
        v-for="unit of data.units"
        :key="unit.name"
        class="p-2"
        :unit="unit"
        :library="data.library"
      >
      </BattleScribeUnit> -->
    </div>
  </div>
</template>

<style>
@page {
  margin: 0;
  size: A4 landscape;
  page-orientation: upright;
}

.avoid-page-break {
  position: relative;
  page-break-inside: avoid;
  break-inside: avoid;
}
</style>
