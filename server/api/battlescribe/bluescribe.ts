import { XMLParser } from "fast-xml-parser";
import {
  refreshRoster,
  createRoster,
  addForce,
  addSelection,
  getMaxCount,
  gatherCatalogues,
  sumCosts,
  getCatalogue,
} from "~/helpers/bluescribe/utils";
import { getEntry } from "~/helpers/bluescribe/validate";
import _ from "lodash";
import { Create40kRoster10th } from "~/server/fancyscribe-parse";
import xmlData from "~/helpers/bluescribe/xmlData";

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

  const buildIndex = (gameData) => {
    const ids = {};

    function coallate(x, file) {
      if (x?.id) {
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
  gameData.ids = buildIndex(gameData);

  catalogue.ids = {};
  library.ids = {};
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

  gameData.gameSystem.ids = {};
  index(gameData.gameSystem, gameData.gameSystem);
  delete gameData.gameSystem[gameData.gameSystem.id];

  index(catalogue, catalogue);
  delete catalogue.ids[catalogue.id];
  index(library, library);
  delete library.ids[library.id];
  index(gameData, gameData);
  delete gameData.ids[gameData.id];

  const newRoster = createRoster("test", gameData.gameSystem);
  const forceId = "bb9d-299a-ed60-2d8a";
  const factionId = "b0ae-12a5-c84-ea45";
  gameData.catalogues = {
    [forceId]: gameData,
    [factionId]: catalogue,
    "5a44-f048-114b-e3ff": library,
  };
  addForce(newRoster, forceId, factionId, gameData);

  let roster = refreshRoster(newRoster, gameData);

  const path = "forces.force.0";
  const entries = {};
  const parseEntry = (entryLink) => {
    const entry = getEntry(roster, path, entryLink.id, gameData);
    if (!entry.hidden && getMaxCount(entry) !== 0) {
      const primary =
        _.find(entry.categoryLinks, "primary")?.targetId || "(No Category)";
      entries[primary] = entries[primary] || [];
      entries[primary].push(entry);
    }
  };
  const freshCatalogue = getCatalogue(roster, path, gameData);
  gatherCatalogues(freshCatalogue, gameData).forEach((c) => {
    c.entryLinks?.forEach(parseEntry);
    c.selectionEntries?.forEach(parseEntry);
  });

  for (const catEntry in entries) {
    entries[catEntry].forEach((entry) => {
      addSelection(roster.forces.force[0], entry, gameData, null, library);
    });
  }

  roster = refreshRoster(roster, gameData);

  const xmldata = xmlData({
    roster: {
      ...roster,
      costs: {
        cost: Object.entries(sumCosts(roster)).map(([name, value]) => ({
          name,
          value,
          typeId: gameData.gameSystem.costTypes.find((ct) => ct.name === name)
            .id,
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

  return {
    // library,
    // catalogue,
    // gameData,
    // roster,
    fancyscribe,
  };
});
