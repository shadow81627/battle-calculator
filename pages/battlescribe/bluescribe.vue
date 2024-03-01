<script setup>
import {
  refreshRoster,
  createRoster,
  addForce,
  findId,
  addSelection,
  sumCosts,
  getMaxCount,
  gatherCatalogues,
  getCatalogue,
} from "~/helpers/bluescribe/utils";
import { getEntry } from "~/helpers/bluescribe/validate";
import { Create40kRoster10th } from "~/server/fancyscribe-parse";
import _ from "lodash";
import xmlData from "~/helpers/bluescribe/xmlData";
// import { JSDOM } from "jsdom";

const { data, pending } = await useFetch("/api/battlescribe/bluescribe");

const buildIndex = (gameData) => {
  const ids = {};

  function coallate(x, file) {
    if (x.id) {
      ids[x.id] = x;
      file.ids = file.ids || {};
      file.ids[x.id] = x;
    }

    for (const attr in x) {
      if (x[attr] instanceof Array) {
        x[attr].forEach((x) => {
          x.__type = containerTags[attr];
          coallate(x, file);
        });
      }
    }
  }

  Object.values(_.omit(gameData, ["gameSystem", "ids"])).forEach((x) =>
    coallate(x, x),
  );

  return ids;
};
data.value.gameData.ids = buildIndex(data.value.gameData);

data.value.catalogue.ids = {};
data.value.library.ids = {};
data.value.gameData.ids = {};
function index(x, root) {
  if (x.id) {
    root.ids[x.id] = x;
  }
  delete x.import;
  for (const attr in x) {
    if (/^\s*$/s.test(x[attr])) {
      delete x[attr];
    }
    if (x[attr] instanceof Array) {
      if (attr === "selectionEntryGroups") {
        x[attr].forEach((group) =>
          group.selectionEntries?.forEach((entry) => (entry.from = "group")),
        );
      }
      x[attr].forEach((item) => index(item, root));
      if (attr.startsWith("shared")) {
        delete x[attr];
      }
    }
  }
}

data.value.gameData.gameSystem.ids = {};
index(data.value.gameData.gameSystem, data.value.gameData.gameSystem);
delete data.value.gameData.gameSystem[data.value.gameData.gameSystem.id];

index(data.value.catalogue, data.value.catalogue);
delete data.value.catalogue.ids[data.value.catalogue.id];
index(data.value.library, data.value.library);
delete data.value.library.ids[data.value.library.id];
index(data.value.gameData, data.value.gameData);
delete data.value.gameData.ids[data.value.gameData.id];

const newRoster = createRoster("test", data.value.gameData.gameSystem);
const forceId = "bb9d-299a-ed60-2d8a";
const factionId = "b0ae-12a5-c84-ea45";
data.value.gameData.catalogues = {
  [forceId]: data.value.gameData,
  [factionId]: data.value.catalogue,
  "5a44-f048-114b-e3ff": data.value.library,
};
addForce(newRoster, forceId, factionId, data.value.gameData);

let roster = refreshRoster(newRoster, data.value.gameData);

const path = "forces.force.0";
const entries = {};
const parseEntry = (entryLink) => {
  const entry = getEntry(roster, path, entryLink.id, data.value.gameData);
  if (!entry.hidden && getMaxCount(entry) !== 0) {
    const primary =
      _.find(entry.categoryLinks, "primary")?.targetId || "(No Category)";
    entries[primary] = entries[primary] || [];
    entries[primary].push(entry);
  }
};
const catalogue = getCatalogue(roster, path, data.value.gameData);
gatherCatalogues(catalogue, data.value.gameData).forEach((c) => {
  c.entryLinks?.forEach(parseEntry);
  c.selectionEntries?.forEach(parseEntry);
});

// const entry = findId(
//   data.value.gameData,
//   data.value.library,
//   // "2299-bed9-3e-2b60",
//   // "a9d-55c1-3d24-fa25",
//   "6c81-9fe6-c714-88e8",
// );

// entry.entryLinks?.forEach(parseEntry);
// entry.selectionEntries?.forEach(parseEntry);

for (const catEntry in entries) {
  entries[catEntry].forEach((entry) => {
    addSelection(
      roster.forces.force[0],
      entry,
      data.value.gameData,
      null,
      data.value.library,
    );
  });
}

roster = refreshRoster(roster, data.value.gameData);

const xmldata = xmlData({
  roster: {
    ...roster,
    costs: {
      cost: Object.entries(sumCosts(roster)).map(([name, value]) => ({
        name,
        value,
        typeId: data.value.gameData.gameSystem.costTypes.find(
          (ct) => ct.name === name,
        ).id,
      })),
    },
  },
});

async function getXmlDoc() {
  if (typeof DOMParser === "function") {
    return new DOMParser().parseFromString(xmldata, "text/xml");
  }
  const { JSDOM } = await import("jsdom");
  return new JSDOM(xmldata, { contentType: "text/xml" }).window.document;
}

const doc = await getXmlDoc();

const info = doc.querySelector("roster");
const gameType = info.getAttribute("gameSystemName");
const fancyscribeRaw = Create40kRoster10th(doc, gameType);
const fancyscribe = JSON.parse(
  JSON.stringify(fancyscribeRaw, (_key, value) => {
    if (value instanceof Set) return [...value];
    if (value instanceof Map) return Object.fromEntries(value.entries());
    return value;
  }),
);
const primaryColor = "#536766";
</script>

<template>
  <div>
    <section class="container">
      <h1 class="h2">BattleScribe Library Data</h1>
      <div>
        BSData organisation created this project. It's a GitHub repository of
        datafiles. Maintained by community, in no way endorsed by BattleScribe
        or any other company/publisher.
      </div>
    </section>
    <FancyScribeRoster
      v-if="fancyscribe"
      :roster="fancyscribe"
      :style="{
        '--primary-color': primaryColor,
        '--primary-color-transparent': `${primaryColor}60`,
      }"
      class="bg-light text-dark"
    />
    <Spinner v-if="pending" class="mx-auto h-64px w-64px" />
    <span v-else-if="!data">No data found</span>
    <div v-else-if="false" class="m-10">
      <template v-if="data.catalogue">
        <!-- <BattleScribeEntryLink
          v-for="entry of data.catalogue.entryLinks"
          :key="entry.id"
          :entry-link="entry"
          :library="data.library"
        >
        </BattleScribeEntryLink> -->
      </template>

      <!-- <BattleScribeRoster
        :game-system="data.gameData.gameSystem"
        :catalogue="data.catalogue"
      ></BattleScribeRoster> -->

      <!-- <BattleScribeUnit
        v-for="unit of data.units"
        :key="unit.name"
        class="p-2"
        :unit="unit"
        :library="data.library"
      >
      </BattleScribeUnit> -->

      <template v-if="data.models">
        <!-- <BattleScribeModel
          v-for="entry of data.models"
          :key="entry.id"
          :model="entry"
          :library="data.library"
        ></BattleScribeModel> -->
        <!-- <div v-for="entry of data.models" :key="entry.id">
          <div
            class="text-4xl font-barlow"
            style="
              letter-spacing: 0.1px;
              line-height: 1;
              text-transform: uppercase;
              z-index: 1;
              position: relative;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2px;
            "
          >
            {{ entry.name }}
            <span
              v-for="cost of entry.costs"
              :key="`${cost.value}-${cost.name}`"
              style="text-transform: initial; font-size: 1.2rem"
            >
              {{ cost.value }}{{ cost.name }}
            </span>
          </div>
          <div
            v-for="profile of entry.profiles.filter(
              (profile) => profile.typeName === 'Unit',
            )"
            :key="profile.name"
          >
            <div style="display: flex; gap: 1.2rem">
              <div
                v-for="characteristic of profile.characteristics"
                :key="characteristic.name"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div
                  style="font-size: 0.9em; font-weight: 800"
                  class="text-center capitalize"
                >
                  {{ characteristic.name }}
                </div>
                <div
                  class="flex justify-center text-center text-dark font-barlow"
                  style="
                    padding: 2px;
                    clip-path: polygon(
                      12% 0px,
                      100% 0px,
                      100% 20%,
                      100% 88%,
                      88% 100%,
                      20% 100%,
                      0px 100%,
                      0px 12%
                    );
                  "
                >
                  <div
                    class="bg-slate-600"
                    style="
                      min-width: 3rem;
                      min-height: 3rem;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      background: rgb(232, 237, 231);
                      clip-path: polygon(
                        10% 0px,
                        100% 0px,
                        100% 20%,
                        100% 90%,
                        90% 100%,
                        20% 100%,
                        0px 100%,
                        0px 10%
                      );
                      padding: 3px;
                      font-size: 1.6em;
                      font-weight: 800;
                    "
                  >
                    {{ characteristic["#text"] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </template>
    </div>
  </div>
</template>
