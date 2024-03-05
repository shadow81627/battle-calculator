<script setup>
const props = defineProps({
  selectionEntry: { type: Object, required: true },
  selectionGroup: { type: Object, required: false },
  library: { type: Object, required: false },
});
const min = computed(
  () =>
    props.selectionEntry.constraints?.find(
      (constraint) => constraint.type === "min",
    )?.value,
);
const max = computed(
  () =>
    props.selectionEntry.constraints?.find(
      (constraint) => constraint.type === "max",
    )?.value,
);
const id = computed(() => props.selectionEntry.id.split("::").pop());
const value = ref(id.value === props.selectionGroup?.defaultSelectionEntryId);
</script>
<template>
  <div>
    <input
      v-if="min && max"
      class="dark:bg-slate-800"
      :min="min"
      :max="max"
      type="number"
      :value="min"
    />
    <input v-else v-model="value" type="checkbox" />
    {{ selectionEntry.name }}

    <div v-show="value">
      <BattleScribeEntryLink
        v-for="entryLink of selectionEntry.entryLinks"
        :key="entryLink.id"
        class="ml-3"
        :entry-link="entryLink"
        :library="library"
      >
      </BattleScribeEntryLink>
      <BattleScribeSelectionEntry
        v-for="childSelectionEntry of selectionEntry.selectionEntries"
        :key="childSelectionEntry.name"
        :selection-entry="childSelectionEntry"
        :library="library"
      >
      </BattleScribeSelectionEntry>
      <BattleScribeSelectionGroup
        v-for="childSelectionGroup of selectionEntry.selectionEntryGroups"
        :key="childSelectionGroup.name"
        :selection-group="childSelectionGroup"
        :library="library"
      >
      </BattleScribeSelectionGroup>
    </div>
  </div>
</template>
