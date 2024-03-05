<script setup>
import { uniqBy } from "lodash-es";
import { addSelection } from "~/helpers/bluescribe/utils";

const { data, pending } = await useFetch("/api/battlescribe/bluescribe");
const selected = ref();
const search = ref();
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
</script>
<template>
  <div class="container flex">
    <div
      class="min-w-[200px] overflow-y-scroll border-1 p-2"
      style="max-height: calc(100vh - 64px)"
    >
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
      <Spinner v-if="pending" class="mx-auto h-64px w-64px" />
      <template v-else-if="data && data.categories">
        <div
          v-for="category of data.categories.filter(
            (category) =>
              data.entries[category.entryId]?.filter(searchFilter).length,
          )"
          :key="category.name"
        >
          <strong>{{ category.name }}</strong>
          <div
            v-for="entry of data.entries[category.entryId].filter(searchFilter)"
            :key="entry.id"
            class="ml-4 block btn hover:bg-gray-500/10"
            @click="selected = entry"
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
      <span v-else-if="!data">No data found</span>
    </div>
    <div class="flex flex-grow-1 flex-col overflow-hidden">
      <div
        :style="{
          '--primary-color': primaryColor,
          '--primary-color-transparent': `${primaryColor}60`,
        }"
        class="relative bg-light text-dark"
      >
        <div
          v-if="fancyscribe && ['unit', 'model'].includes(fancyscribe.type)"
          style="display: contents"
        >
          <FancyScribeUnit :unit="fancyscribe"></FancyScribeUnit>
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
</template>
