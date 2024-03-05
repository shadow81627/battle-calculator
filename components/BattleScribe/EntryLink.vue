<script setup>
const props = defineProps({
  entryLink: { type: Object, required: true },
  library: { type: Object, required: false },
  selectionGroup: { type: Object, required: false },
});
const min = computed(
  () =>
    props.entryLink.constraints?.find((constraint) => constraint.type === "min")
      ?.value,
);
const max = computed(
  () =>
    props.entryLink.constraints?.find((constraint) => constraint.type === "max")
      ?.value,
);

const targetTypeKey =
  props.entryLink.type === "selectionEntryGroup"
    ? "sharedSelectionEntryGroups"
    : "sharedSelectionEntries";
const target = props.library?.[targetTypeKey].find(
  (item) => item.id === props.entryLink.targetId,
);
const value =
  props.entryLink.id === props.selectionGroup?.defaultSelectionEntryId;
</script>
<template>
  <div>
    <template v-if="entryLink.type !== 'selectionEntryGroup'">
      <input
        v-if="min && max"
        class="dark:bg-slate-800"
        :min="min"
        :max="max"
        type="number"
        :value="min"
      />
      <input v-else type="checkbox" :checked="value" />
      {{ entryLink.name }}
    </template>

    <template v-if="target">
      <!-- Target -->
      <!-- <pre>{{ target }}</pre> -->
      <BattleScribeModel
        v-if="target.type === 'model'"
        :model="target"
        :library="library"
        class="ml-3"
      ></BattleScribeModel>

      <BattleScribeUnit
        v-if="target.type === 'unit'"
        :unit="target"
        :library="library"
        class="ml-3"
      ></BattleScribeUnit>

      <BattleScribeSelectionGroup
        v-if="entryLink.type === 'selectionEntryGroup'"
        :selection-group="target"
        :library="library"
      >
      </BattleScribeSelectionGroup>
      <BattleScribeUpgrade
        v-if="target.type === 'upgrade'"
        :upgrade="target"
        :library="library"
        class="ml-3"
      ></BattleScribeUpgrade>
    </template>
  </div>
</template>
