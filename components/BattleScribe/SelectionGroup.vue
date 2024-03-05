<script setup>
defineProps({
  selectionGroup: { type: Object, required: true },
  library: { type: Object, required: false },
});
</script>
<template>
  <div>
    {{ selectionGroup.name }}
    <template v-if="selectionGroup.selectionEntries">
      <BattleScribeSelectionEntry
        v-for="selectionEntry of selectionGroup.selectionEntries"
        :key="selectionEntry.name"
        class="ml-3"
        :selection-entry="selectionEntry"
        :selection-group="selectionGroup"
        :library="library"
      >
      </BattleScribeSelectionEntry>
    </template>
    <template v-if="selectionGroup.entryLinks">
      <BattleScribeEntryLink
        v-for="entry of selectionGroup.entryLinks"
        :key="entry.name"
        class="ml-3"
        :entry-link="entry"
        :selection-group="selectionGroup"
        :library="library"
      >
      </BattleScribeEntryLink>
    </template>
  </div>
</template>
