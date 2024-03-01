import { XMLParser } from "fast-xml-parser";
// import fs from "fs/promises";
// import slugify from "slugify";
// import deepSort from "~/utils/deepSort";

export default defineEventHandler(async () => {
  const catalogueFile = await useStorage("assets:server").getItem(
    "Imperium - Astra Militarum.cat",
  );
  const libraryFile = await useStorage("assets:server").getItem(
    "Imperium - Astra Militarum - Library.xml",
  );
  const gameDataFile = await useStorage("assets:server").getItem(
    "Warhammer 40,000.gst",
  );
  if (
    !catalogueFile ||
    typeof catalogueFile !== "string" ||
    !libraryFile ||
    typeof libraryFile !== "string" ||
    !gameDataFile ||
    typeof gameDataFile !== "string"
  ) {
    throw createError({ message: "Unable to get file", status: 400 });
  }

  const containerTags = {
    categories: "category",
    catalogueLinks: "catalogueLink",
    categoryEntries: "categoryEntry",
    categoryLinks: "categoryLink",
    characteristics: "characteristic",
    characteristicTypes: "characteristicType",
    conditions: "condition",
    conditionGroups: "conditionGroup",
    constraints: "constraint",
    costs: "cost",
    costLimits: "costLimit",
    costTypes: "costType",
    entryLinks: "entryLink",
    forceEntries: "forceEntry",
    infoGroups: "infoGroup",
    infoLinks: "infoLink",
    forces: "force",
    modifiers: "modifier",
    modifierGroups: "modifierGroup",
    profiles: "profile",
    profileTypes: "profileType",
    publications: "publication",
    repeats: "repeat",
    rules: "rule",
    selections: "selection",
    selectionEntries: "selectionEntry",
    selectionEntryGroups: "selectionEntryGroup",
    sharedInfoGroups: "infoGroup",
    sharedProfiles: "profile",
    sharedRules: "rule",
    sharedSelectionEntries: "selectionEntry",
    sharedSelectionEntryGroups: "selectionEntryGroup",
  };

  const escapedHtml = /&(?:amp|lt|gt|quot|#39|apos);/g;
  const htmlUnescapes = {
    "&amp;": "&",
    "&apos;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  const unescape = (input: string) =>
    escapedHtml.test(input)
      ? input.replace(escapedHtml, (match) => htmlUnescapes[match])
      : input;

  const parser = new XMLParser({
    allowBooleanAttributes: true,
    attributeNamePrefix: "",
    ignoreAttributes: false,
    ignoreDeclaration: true,
    parseAttributeValue: true,
    parseTagValue: false,
    processEntities: false,
    trimValues: false,
    attributeValueProcessor: (name, val) => unescape(val),
    tagValueProcessor: (name, val) => unescape(val),
    isArray: (name, path) => {
      const pieces = path.split(".");
      const last = pieces.pop();
      const secondLast = pieces.pop();
      // Use match for the case of 'sharedSelectionEntries.selectionEntry'
      return !!(secondLast && containerTags[secondLast] === last);
    },
  });

  function normalize(x) {
    delete x.import;
    for (const attr in x) {
      if (
        x[attr] === "" ||
        (typeof x[attr] === "string" && x[attr].trim().length === 0)
      ) {
        delete x[attr];
      } else if (containerTags[attr] && x[attr][containerTags[attr]]) {
        x[attr] = x[attr][containerTags[attr]];
        x[attr].forEach(normalize);
      } else if (Array.isArray(x[attr])) {
        x[attr].forEach(normalize);
      } else if (typeof x[attr] == "object") {
        normalize(x[attr]);
      }
    }
    return x;
  }

  const catalogueData = parser.parse(catalogueFile);
  const catalogue = normalize({
    type: "catalogue",
    ...catalogueData.catalogue,
    xmlns: undefined,
  });

  const libraryData = parser.parse(libraryFile);
  const library = normalize({
    type: "catalogue",
    ...libraryData.catalogue,
    xmlns: undefined,
  });
  const gameDataParsed = parser.parse(gameDataFile);
  const gameData = normalize({
    ...gameDataParsed,
    xmlns: undefined,
  });

  // const entries = [];
  // for (const entry of catalogue.entryLinks) {
  //   if (entry.name && !entry.name.includes("[Legends]")) {
  //     entries.push(entry);
  //   }
  // }

  // const units = [];
  // const models = [];
  // for (const entry of library.sharedSelectionEntries) {
  //   if (
  //     entry.name &&
  //     !entry.name.includes("[Legends]") &&
  //     [
  //       "Lord Solar Leontus",
  //       "Death Korps of Krieg",
  //       "Rogal Dorn Battle Tank",
  //       "Regimental Enginseer",
  //     ].includes(entry.name)
  //   ) {
  //     if (entry.type === "unit") {
  //       units.push(entry);
  //     }
  //     if (entry.type === "model") {
  //       models.push(entry);
  //     }
  //   }
  // }

  // const catalogueName = catalogue.name;
  // for (const [key, value] of Object.entries({
  //   entries,
  //   models,
  //   units,
  // })) {
  //   for (const item of value) {
  //     if (item.name && catalogueName) {
  //       const folder = `data/battlescribe/catalogues/${slugify(catalogueName, { lower: true, strict: true })}/${key}/`;
  //       await fs.mkdir(folder, { recursive: true });
  //       const filename = `${folder}/${slugify(item.id ?? item.name, { lower: true, strict: true })}.json`;
  //       await fs.writeFile(
  //         filename,
  //         `${JSON.stringify(deepSort(item), undefined, 2)}\n`,
  //         { flag: "w" },
  //       );
  //     }
  //   }
  // }

  return {
    // units,
    // models,
    // entries,
    library,
    catalogue,
    gameData,
  };
});
