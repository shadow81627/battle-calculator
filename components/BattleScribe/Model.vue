<script setup>
defineProps({
  model: { type: Object, required: true },
  library: { type: Object, required: true },
});
</script>
<template>
  <div>
    {{ model.name }}
    <BattleScribeCost
      v-for="cost of model.costs"
      :key="`${cost.value}-${cost.name}`"
      :cost="cost"
    >
    </BattleScribeCost>
    <template v-if="model.selectionEntryGroups">
      <BattleScribeSelectionGroup
        v-for="selectionGroup of model.selectionEntryGroups"
        :key="selectionGroup.name"
        :selection-group="selectionGroup"
        class="ml-3 border"
        :library="library"
      ></BattleScribeSelectionGroup>
    </template>
    <template v-if="model.selectionEntries">
      <BattleScribeSelectionEntry
        v-for="selectionEntry of model.selectionEntries"
        :key="selectionEntry.name"
        class="ml-3"
        :selection-entry="selectionEntry"
        :library="library"
      >
      </BattleScribeSelectionEntry>
    </template>
    <template v-if="model.entryLinks">
      <BattleScribeEntryLink
        v-for="entry of model.entryLinks"
        :key="entry.name"
        class="ml-3"
        :entry-link="entry"
        :library="library"
      >
      </BattleScribeEntryLink>
    </template>
  </div>
</template>
