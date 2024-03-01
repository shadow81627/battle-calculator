import _ from "lodash";
import fxparser from "fast-xml-parser";
export default function xmlData(contents, filename = "") {
  const builder = new fxparser.XMLBuilder({
    attributeNamePrefix: "",
    ignoreAttributes: false,
    format: true,
    indentBy: "  ",
    processEntities: true,
    suppressBooleanAttributes: false,
    suppressUnpairedNode: false,
    unpairedTags: ["publication", "category", "cost"],
  });

  contents = _.cloneDeep(contents);
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
