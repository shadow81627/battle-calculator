<script setup>
const props = defineProps(['force'])
const { units, factionRules, rules, catalog } = props.force;
const mergedRules = { ...factionRules, ...rules };
</script>

<template>
  <div style="display: contents">
    <div style="width:282mm; height:210mm; display: flex;" v-for="(unit, index) of units" class="mx-auto">
      <FancyScribeUnit :key="unit.name" :index="index" :unit="unit" :catalog="catalog">
      </FancyScribeUnit>
    </div>

    <div style="width:282mm;" class="flex mx-auto py-6">
      <FancyScribeForceRules :rules="mergedRules" />
    </div>
  </div>
</template>
