<script setup>
const props = defineProps(['force'])
const { units, factionRules, rules, catalog } = props.force;
const mergedRules = { ...factionRules, ...rules };
</script>

<template>
  <div style="display: contents">

    <FancyScribeUnit v-for="(unit, index) of units" :key="unit.name" :index="index" :unit="unit" :catalog="catalog">
    </FancyScribeUnit>

    <FancyScribeForceRules :rules="mergedRules" />
  </div>
</template>
