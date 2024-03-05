<script setup>
import { addSelection } from "~/helpers/bluescribe/utils";

const { data, pending } = await useFetch("/api/battlescribe/bluescribe");
const selected = ref();
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

function parse(selection) {
  if (selection) {
    const costs = selection.costs.cost ?? selection.costs;
    const categories = selection.categories.category ?? selection.categoryLinks;
    const profiles = selection.profiles.profile ?? selection.profiles;
    const selections = selection.selections?.selection;

    const meleeWeapons = [];
    const rangedWeapons = [];
    selections
      .filter((s) => s.type === "upgrade")
      .forEach((s) =>
        s.profiles.profile?.forEach((p) => {
          if (["Ranged Weapons", "Melee Weapons"].includes(p.typeName)) {
            const characteristics = Object.fromEntries(
              (p.characteristics.characteristic ?? p.characteristics)?.map(
                (c) => [c.name, c["#text"]],
              ),
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
            const weapons =
              p.typeName === "Ranged Weapons" ? rangedWeapons : meleeWeapons;
            weapons.push(weapon);
          }
        }),
      );

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
      meleeWeapons,
      rangedWeapons,
      abilities: abilities,
      keywords: keywords.filter((c) => !c.includes("Faction")),
      factions,
      rules: [],
      modelList: [],
      modelStats,
      cost: { points },
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
    <div class="border-1 p-2">
      <Spinner v-if="pending" class="mx-auto h-64px w-64px" />
      <template v-else-if="data && data.categories">
        <div
          v-for="category of data.categories.filter(
            (category) => data.entries[category.entryId],
          )"
          :key="category.name"
        >
          <strong>{{ category.name }}</strong>
          <div
            v-for="entry of data.entries[category.entryId]"
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
      <template v-if="selected">
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
      </template>
      <div
        :style="{
          '--primary-color': primaryColor,
          '--primary-color-transparent': `${primaryColor}60`,
        }"
        class="relative bg-light text-dark"
      >
        <div v-if="fancyscribe" style="display: contents">
          <FancyScribeUnit :unit="fancyscribe"></FancyScribeUnit>
        </div>
      </div>

      <pre>{{ fancyscribe }}</pre>
      <!-- <pre>{{ selected }}</pre> -->
      <pre>{{ bluescribe }}</pre>
    </div>
  </div>
</template>
