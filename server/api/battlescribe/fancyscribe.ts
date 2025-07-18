import { JSDOM } from "jsdom";
import { Create40kRoster10th } from "~/server/fancyscribe-parse";

export default defineEventHandler(async () => {
  const file = await useStorage("assets:server").getItem("Double Dorn.ros");
  if (!file || typeof file !== "string")
    throw createError({ message: "Unable to get file", status: 400 });

  const dom = new JSDOM(file, { contentType: "text/xml" });
  const doc = dom.window.document;

  const info = doc.querySelector("roster");
  const gameType =
    info?.getAttribute("gameSystemName") ?? "Warhammer 40,000 10th Edition";
  // const rosterName = info.getAttribute("name");

  const roster = Create40kRoster10th(doc, gameType);

  // console.log('keywords', roster.forces[0].units[0].keywords)

  // Replace Set with Array since the Set doesn't stringify
  const data = JSON.parse(
    JSON.stringify(roster, (_key, value) => {
      if (value instanceof Set) return [...value];

      if (value instanceof Map) return Object.fromEntries(value.entries());

      return value;
    }),
  );

  return { data };
});
