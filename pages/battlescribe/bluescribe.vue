<script setup>
import { uniqBy } from "lodash-es";
import { addSelection } from "~/helpers/bluescribe/utils";

const { data, pending } = await useFetch("/api/battlescribe/bluescribe");
const selected = computed(() => {
  if (search.value) {
    return searchItems.value.find((item) =>
      item.name.toLowerCase().includes(search.value.toLowerCase()),
    );
  }
});
const search = ref("");
const primaryColor = "#536766";
const bluescribe = computed(() => {
  if (selected.value) {
    const base = {};
    addSelection(
      base,
      selected.value,
      data.value.gameData,
      undefined,
      // catalogue,
    );
    return base.selections.selection[0];
  }
});

function searchFilter(item) {
  if (search.value && typeof search.value === "string") {
    if (item.name.toLowerCase().includes(search.value.toLowerCase())) {
      return true;
    }
    return false;
  }
  return true;
}

function getModelSelections(selection, modelSelections) {
  const selections = selection.selections?.selection;
  if (selections) {
    selections.forEach((s) => getModelSelections(s, modelSelections));
  }
  if (selection.type === "model") {
    modelSelections.push(selection);
  }
}

function getWeapons(selection, weapons) {
  const profiles =
    selection.profiles?.profile?.filter((p) =>
      ["Ranged Weapons", "Melee Weapons"].includes(p.typeName),
    ) ?? [];
  const selections = selection.selections?.selection ?? [];
  selections.forEach((s) => getWeapons(s, weapons));
  for (const p of profiles) {
    const characteristics = Object.fromEntries(
      (p.characteristics.characteristic ?? p.characteristics)?.map((c) => [
        c.name,
        c["#text"],
      ]),
    );
    const weapon = {
      name: p.name,
      cost: {
        points: 0,
      },
      // count: 1,
      selectionName: p.name,
      range: characteristics["Range"],
      type: characteristics["Keywords"],
      str: characteristics["S"],
      ap: characteristics["AP"],
      damage: characteristics["D"],
      attacks: characteristics["A"],
      bs: characteristics["BS"],
      ws: characteristics["WS"],
      abilities: "",
    };
    // const weapons =
    //   p.typeName === "Ranged Weapons" ? rangedWeapons : meleeWeapons;
    weapons.push(weapon);
  }
}

function parse(selection) {
  if (selection) {
    const costs = selection.costs?.cost ?? selection.costs ?? [];
    const categories =
      selection.categories?.category ?? selection.categoryLinks ?? [];
    const profiles = selection.profiles?.profile ?? selection.profiles ?? [];
    const selections = selection.selections?.selection ?? [];

    const weapons = [];
    selections.forEach((s) => getWeapons(s, weapons));
    const meleeWeapons =
      weapons.filter((weapon) => weapon.range === "Melee") ?? [];
    const rangedWeapons =
      weapons.filter((weapon) => weapon.range !== "Melee") ?? [];

    const modelSelections = [];
    selections.forEach((s) => getModelSelections(s, modelSelections));
    const childModelStats = modelSelections.flatMap((m) => parse(m).modelStats);
    const children = uniqBy(childModelStats, "name").filter(
      (m) => m.meleeWeapons?.length,
    );
    childModelStats.forEach((modelStats) => {
      meleeWeapons.push(...(modelStats.meleeWeapons ?? []));
      rangedWeapons.push(...(modelStats.rangedWeapons ?? []));
    });

    const points = costs.reduce((sum, i) => (sum += i.value), 0);
    const keywords = categories.map((c) => c.name);
    const factions = keywords.filter((c) => c.includes("Faction"));
    const abilities = {};
    profiles
      .filter((p) => !["Unit", "Model"].includes(p.typeName))
      .forEach((p) => {
        if (!abilities[p.typeName]) abilities[p.typeName] = {};
        (p.characteristics.characteristic ?? p.characteristics)?.forEach(
          (c) => {
            abilities[p.typeName][p.name] = c["#text"];
          },
        );
      });
    const modelStats = profiles
      .filter((p) => ["Unit", "Model"].includes(p.typeName))
      .map((p) => {
        const characteristics = Object.fromEntries(
          (p.characteristics.characteristic ?? p.characteristics)?.map((c) => [
            c.name,
            c["#text"],
          ]),
        );
        return {
          name: p.name,
          count: 0,
          move: characteristics["M"],
          toughness: characteristics["T"],
          wounds: characteristics["W"],
          attacks: "",
          leadership: characteristics["LD"],
          save: characteristics["SV"],
          oc: characteristics["OC"],
          rangedWeapons,
          meleeWeapons,
          upgrades: [],
          psyker: null,
          psychicPowers: [],
          explosions: [],
        };
      });
    return {
      name: selection.name,
      type: selection.type,
      meleeWeapons: uniqBy(meleeWeapons, "name"),
      rangedWeapons: uniqBy(rangedWeapons, "name"),
      abilities: abilities,
      keywords: keywords.filter((c) => !c.includes("Faction")),
      factions,
      rules: [],
      modelList: [],
      modelStats: [...modelStats, ...children],
      cost: { points },
      children,
    };
  }
}
const fancyscribe = computed(() => {
  const selection = bluescribe.value;
  return parse(selection);
});

const searchItems = computed(() => {
  const result = [];
  const categories = data.value.categories.filter(
    (category) =>
      data.value.entries[category.entryId]?.filter(searchFilter).length,
  );
  for (const category of categories) {
    result.push(...data.value.entries[category.entryId].filter(searchFilter));
  }

  return result;
});
</script>
<template>
  <div class="container">
    <div class="block w-full xl:hidden !print:hidden">
      <SearchInput
        v-if="data && data.categories"
        v-model:search="search"
        :items="searchItems"
        class="w-full"
      ></SearchInput>
    </div>
    <div class="flex flex-wrap gap-[16px]">
      <div
        class="box-border hidden w-[320px] overflow-x-hidden overflow-y-scroll border-1 p-2 xl:block !print:hidden"
        style="max-height: calc(100vh - 64px)"
      >
        <SearchInput
          v-if="data && data.categories"
          v-model:search="search"
          :items="searchItems"
        ></SearchInput>
        <template v-if="data && data.categories">
          <div
            v-for="category of data.categories.filter(
              (category) => data.entries[category.entryId]?.length,
            )"
            :key="category.name"
          >
            <strong>{{ category.name }}</strong>
            <div
              v-for="entry of data.entries[category.entryId]"
              :key="entry.id"
              class="ml-4 block btn hover:bg-gray-500/10"
              @click="search = entry.name"
            >
              {{ entry.name }}
              <span
                v-for="(cost, index) of entry.costs?.filter(
                  (i) => ![0, '0'].includes(i.value),
                )"
                :key="index"
                >{{ cost.value }}{{ cost.name }}</span
              >
            </div>
          </div>
        </template>
      </div>
      <div class="flex flex-grow-1 flex-col overflow-hidden">
        <div
          :style="{
            '--primary-color': primaryColor,
            '--primary-color-transparent': `${primaryColor}60`,
          }"
          class="relative print:bg-light print:text-dark"
        >
          <Spinner v-if="pending" class="mx-auto h-64px w-64px" />
          <span v-else-if="!data">No data found</span>
          <div
            v-if="fancyscribe && ['unit', 'model'].includes(fancyscribe.type)"
            style="display: contents"
          >
            <FancyScribeUnit
              :unit="fancyscribe"
              :show-print-options="false"
            ></FancyScribeUnit>
          </div>
          <div
            v-else
            class="flex items-center justify-center"
            style="min-height: 210mm"
          >
            Select a Data Sheet to view
          </div>
        </div>

        <div v-if="selected" class="ml-3 mt-3 border-1 p-2">
          <strong>Selection Options</strong>
          <template v-if="selected.selectionEntries">
            <BattleScribeSelectionEntry
              v-for="selectionEntry of selected.selectionEntries"
              :key="selectionEntry.name"
              class="ml-3"
              :selection-entry="selectionEntry"
            ></BattleScribeSelectionEntry>
          </template>
          <template v-if="selected.selectionEntryGroups">
            <BattleScribeSelectionGroup
              v-for="selectionGroup of selected.selectionEntryGroups"
              :key="selectionGroup.name"
              :selection-group="selectionGroup"
              class="ml-3 border"
            ></BattleScribeSelectionGroup>
          </template>
        </div>

        <!-- <pre v-if="fancyscribe">{{ fancyscribe }}</pre> -->
        <!-- <pre>{{ selected }}</pre> -->
        <!-- <pre>{{ bluescribe }}</pre> -->
      </div>
    </div>
  </div>
</template>
