<script setup>
const { data, pending } = await useFetch("/api/battlescribe/library");
const primaryColor = "#536766";
const search = ref("");
function searchFilter(item) {
  if (search.value && typeof search.value === "string") {
    if (item.name.toLowerCase().includes(search.value.toLowerCase())) {
      return true;
    }
    return false;
  }
  return true;
}
const roster = computed(() => {
  return {
    ...data.value.fancyscribe,
    forces: [
      {
        ...data.value.fancyscribe.forces[0],
        units: data.value.fancyscribe.forces[0].units.filter(searchFilter),
      },
    ],
  };
});
</script>

<template>
  <div>
    <div class="w-full flex print:hidden">
      <label
        for="search"
        class="peer-focus:text-primary dark:peer-focus:text-primary mb-0 flex border-2 rounded rounded-r-none border-r-none bg-transparent p-2 text-neutral-200 transition-all duration-200 ease-out peer-focus:scale-[0.8] dark:text-neutral-200 motion-reduce:transition-none peer-focus:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] peer-data-[te-input-state-active]:-translate-y-[0.9rem]"
      >
        <Icon
          name="carbon:search"
          class="my-auto"
          style="width: 32px; height: 32px"
        />
      </label>
      <input
        id="search"
        v-model="search"
        type="text"
        name="search"
        class="peer peer-focus:text-primary dark:peer-focus:text-primary block min-h-[auto] flex-grow-1 border-2 rounded rounded-l-none border-l-none bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear dark:text-neutral-200 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100"
      />
    </div>
    <!-- <template v-if="roster">
      <div
        class="[column-fill:_balance] mx-auto box-border columns-1 gap-10 after:box-inherit before:box-inherit 2xl:columns-3 sm:columns-2"
        style="
          gap: 8px;
          padding: 20px;
          border: 2px solid black;
          margin-bottom: 32px;
        "
      >
        <div v-for="unit of roster.forces[0].units" :key="unit.name">
          {{ unit.name }} {{ unit.cost.points }}
        </div>
      </div>
    </template> -->
    <FancyScribeRoster
      v-if="roster"
      :roster="roster"
      :style="{
        '--primary-color': primaryColor,
        '--primary-color-transparent': `${primaryColor}60`,
      }"
      class="print:bg-light print:text-dark"
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
