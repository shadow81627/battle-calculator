<script setup>
import { XMLBuilder } from "fast-xml-parser";
import { cloneDeep, pick, flatten } from "lodash-es";
const props = defineProps({
  gameSystem: { type: Object, required: true },
  catalogue: { type: Object, required: true },
});
const randomId = () => {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  const hex4 = () => hex() + hex() + hex() + hex();
  return `${hex4()}-${hex4()}-${hex4()}-${hex4()}`;
};
const name = "Daim";
const entry = { name: "Army Roster", categoryLinks: [] };
const forceId = "bb9d-299a-ed60-2d8a";
const factionId = "b0ae-12a5-c84-ea45";
const force = {
  id: randomId(),
  name: entry.name,
  entryId: forceId,
  catalogueId: factionId,
  catalogueRevision: props.catalogue.revision,
  catalogueName: props.catalogue.name,
  publications: {
    publication: [
      ...(props.catalogue.publications || []).map((p) =>
        pick(p, ["id", "name"]),
      ),
      ...(props.gameSystem.publications || []).map((p) =>
        pick(p, ["id", "name"]),
      ),
      ...flatten(props.catalogue.catalogueLinks?.map(() => [])).map((p) =>
        pick(p, ["id", "name"]),
      ),
    ],
  },
  categories: {
    category: [
      {
        id: randomId(),
        name: "Uncategorised",
        entryId: "(No Category)",
        primary: "false",
      },
      ...entry.categoryLinks.map((c) => ({
        id: c.id,
        name: c.name,
        entryId: c.targetId,
        primary: "false",
      })),
    ],
  },
  selections: {
    selection: [
      {
        id: "9833-44fc-9211-5e3f",
        name: "Death Korps of Krieg",
        entryId: "ade0-fa44-d4cf-4fc8",
        number: 1,
        type: "unit",
        categories: { category: [] },
        costs: {
          cost: [{ name: "pts", typeId: "51b2-306e-1021-d207", value: 65 }],
        },
        profiles: { profile: [] },
        rules: { rule: [] },
      },
    ],
  },
};
const roster = {
  id: randomId(),
  name: name,
  battleScribeVersion: "2.03",
  gameSystemId: props.gameSystem.id,
  gameSystemName: props.gameSystem.name,
  gameSystemRevision: props.gameSystem.revision,
  xmlns: "http://www.battlescribe.net/schema/rosterSchema",
  costs: {
    cost:
      props.gameSystem.costTypes?.map((ct) => ({
        name: ct.name,
        typeId: ct.id,
        value: 0,
      })) || [],
  },
  forces: [force],
};

const builder = new XMLBuilder({
  attributeNamePrefix: "",
  ignoreAttributes: false,
  format: true,
  indentBy: "  ",
  processEntities: true,
  suppressBooleanAttributes: false,
  suppressUnpairedNode: false,
  unpairedTags: ["publication", "category", "cost"],
});
async function xmlData(contents) {
  contents = cloneDeep(contents);

  const prune = (target) => {
    Object.entries(target).forEach(([key, value]) => {
      if (typeof value === "object") {
        if (
          Object.keys(value).length === 1 &&
          value[Object.keys(value)[0]].length === 0
        ) {
          delete target[key];
        } else {
          prune(value);
        }
      }
    });
  };

  prune(contents);

  let data =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    builder.build(contents);

  // Working around bug in fast-xml-parser
  // https://github.com/NaturalIntelligence/fast-xml-parser/issues/590
  data = data.replace(/#text="(.+?)"(.*?)>/gs, "$2>$1");

  return data;
}
const xml = await xmlData({ roster });
</script>
<template>
  <div>Roster</div>
  <pre>{{ xml }}</pre>
</template>
