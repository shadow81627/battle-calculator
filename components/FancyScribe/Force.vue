<script setup>
const props = defineProps({ force: { type: Object, required: true } });
const { factionRules, rules } = props.force;
const mergedRules = { ...factionRules, ...rules };
</script>

<template>
  <div style="display: contents">
    <FancyScribeUnit
      v-for="(unit, index) of force.units"
      :key="unit.name"
      :index="index"
      :unit="unit"
      :catalog="force.catalog"
    />

    <FancyScribeForceRules :rules="mergedRules" />
  </div>
</template>
