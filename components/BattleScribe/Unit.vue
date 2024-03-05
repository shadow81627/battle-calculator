<script setup>
import { omitBy, isUndefined, cloneDeep } from "lodash-es";
const props = defineProps({
  unit: { type: Object, required: true },
  library: { type: Object, required: true },
});

const randomId = () => {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  const hex4 = () => hex() + hex() + hex() + hex();
  return `${hex4()}-${hex4()}-${hex4()}-${hex4()}`;
};
const isCollective = (entry) =>
  entry.collective || entry.selectionEntries?.every(isCollective);
const collective = isCollective(props.unit);
const number = 1;
const newSelection = omitBy(
  {
    id: randomId(),
    name: props.unit.name,
    entryId: props.unit.id,
    from: props.unit.from,
    number: collective ? number : 1,
    page: props.unit.page,
    publicationId: props.unit.publicationId,
    type: props.unit.type,
    categories: { category: [] },
    costs: { cost: cloneDeep(props.unit.costs) || [] },
    profiles: { profile: [] },
    rules: { rule: [] },
  },
  isUndefined,
);
</script>
<template>
  <div>
    <div>
      {{ newSelection }}
    </div>
    {{ unit.name }}
    <BattleScribeCost
      v-for="cost of unit.costs"
      :key="`${cost.value}-${cost.name}`"
      :cost="cost"
    >
    </BattleScribeCost>
    <BattleScribeSelectionGroup
      v-for="selectionGroup of unit.selectionEntryGroups"
      :key="selectionGroup.name"
      :selection-group="selectionGroup"
      :library="library"
      class="ml-3 border"
    ></BattleScribeSelectionGroup>

    <!-- <BattleScribeModel
        v-if="target.type === 'model'"
        :model="target"
        :library="library"
        class="ml-3"
      ></BattleScribeModel> -->
  </div>
</template>
