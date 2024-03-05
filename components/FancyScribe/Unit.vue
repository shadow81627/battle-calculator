<script setup>
const props = defineProps({
  unit: { type: Object, required: true },
  onePerPage: { type: Boolean, default: false },
  forceRules: { type: Object, required: false },
});
const { rules, modelList } = props.unit;

let { modelStats } = props.unit;
const imageId = computed(() => `image${props.unit.name}`);

const weapons = computed(() => [
  ...props.unit.meleeWeapons,
  ...props.unit.rangedWeapons,
]);

const weaponDescriptions = weapons.value
  .filter(
    (weapon) =>
      (weapon.range === "-" || weapon.range === "") && weapon.abilities,
  )
  .sort((a, b) => a.selectionName.localeCompare(b.selectionName));
const modelsWithDifferentProfiles = weapons.value.filter((weapon, index) => {
  const { selectionName, name } = weapon;
  const previousWeapon = weapons.value[index - 1];
  const nextWeapon = weapons.value[index + 1];
  const hasDifferentProfiles = (selectionName, name) => {
    return selectionName && selectionName.toLowerCase() !== name.toLowerCase();
  };
  return (
    hasDifferentProfiles(selectionName, name) &&
    ((previousWeapon &&
      hasDifferentProfiles(previousWeapon.selectionName, previousWeapon.name) &&
      selectionName === previousWeapon.selectionName) ||
      (nextWeapon &&
        hasDifferentProfiles(nextWeapon.selectionName, nextWeapon.name) &&
        selectionName === nextWeapon.selectionName))
  );
});

// function getOverridePrimary(factions, keywords) {
//   if (!factions.has)
//     return
//   if (
//     factions.has('Khorne')
//     && factions.has('Tzeentch')
//     && factions.has('Nurgle')
//     && factions.has('Slaanesh')
//   )
//     return
//   if (factions.has('Khorne') || keywords.has('Khorne'))
//     return '#883531'
//   if (factions.has('Tzeentch') || keywords.has('Tzeentch'))
//     return '#015d68'
//   if (factions.has('Nurgle') || keywords.has('Nurgle'))
//     return '#5c672b'
//   if (factions.has('Slaanesh') || keywords.has('Slaanesh'))
//     return '#634c74'
// }

// const overridePrimary = getOverridePrimary(factions, keywords)

function areAllModelsTheSame(modelStats) {
  if (modelStats.length === 1) return true;
  const firstModel = modelStats[0];
  return modelStats.every(
    (model) =>
      model.move === firstModel.move &&
      model.toughness === firstModel.toughness &&
      model.save === firstModel.save &&
      model.wounds === firstModel.wounds &&
      model.leadership === firstModel.leadership &&
      model.oc === firstModel.oc &&
      model.bs === firstModel.bs &&
      model.ws === firstModel.ws &&
      model.attacks === firstModel.attacks,
  );
}
if (areAllModelsTheSame(modelStats)) modelStats = [modelStats[0]];

if (modelList.length === 1) {
  modelList[0] = modelList[0]
    // .replace(name, "")
    .replace("(", "")
    .replace(")", "");
}
const hide = ref(false);
</script>

<template>
  <div
    style="max-width: 282mm; min-height: 210mm; display: flex"
    class="avoid-page-break mx-auto"
    :class="{
      'page-break': onePerPage,
      '!print:hidden': hide,
    }"
  >
    <div
      class="mx-auto"
      style="
        font-weight: 500;
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      "
    >
      <label class="flex justify-end gap-4 pb-2 print:hidden">
        <input v-model="hide" type="checkbox" />
        <span class="print:hidden">Don't print this card.</span>
      </label>
      <div
        class="min-h-[15rem] !print:bg-none"
        style="
          color: #fff;
          position: relative;
          padding: 24px 0;
          padding-bottom: 24px;
          background: linear-gradient(
            90deg,
            rgba(20, 21, 25, 1) 0%,
            rgba(48, 57, 62, 1) 45%,
            rgba(73, 74, 79, 1) 100%
          );
        "
      >
        <div
          style="
            padding: 4px 16px;
            color: rgb(255, 255, 255);
            position: relative;
            margin-left: 1.3rem;
          "
        >
          <div
            style="
              position: absolute;
              left: 0px;
              top: 0px;
              width: 100%;
              display: flex;
              height: 80px;
            "
          >
            <div
              style="
                background-color: var(--primary-color-transparent);
                height: 80px;
                min-width: 35%;
              "
            />
            <div style="height: 80px; width: 100%">
              <div
                style="
                  background-color: var(--primary-color-transparent);
                  height: 40px;
                "
              />
              <svg
                height="400px"
                width="1000px"
                viewBox="0 0 100 40"
                style="
                  fill: var(--primary-color-transparent);
                  width: 100px;
                  height: 40px;
                "
                class="mr-auto"
              >
                <path d="m0 0h100c-32 0-68 40-100 40z" />
              </svg>
            </div>
            <div
              style="
                flex: 10 1 0%;
                background-color: var(--primary-color-transparent);
                height: 50%;
              "
            />
          </div>
          <div
            class="flex-wrap text-4xl font-barlow"
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
            {{ unit.name }}
            <span style="text-transform: initial; font-size: 1.2rem">
              {{ unit.cost.points }}pts
            </span>
          </div>

          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 6px;
              z-index: 1;
              position: relative;
            "
          >
            <FancyScribeModelStats
              v-for="(model, modelIndex) of unit.modelStats"
              :key="modelIndex"
              :index="modelIndex"
              :model-stats="unit.modelStats"
              :model-stat="model"
              :model-list="unit.modelList"
              :show-name="unit.modelStats.length > 1"
            />
          </div>
        </div>
        <FancyScribeUnitImage :image-id="imageId"></FancyScribeUnitImage>
      </div>
      <div
        class="flex-grow flex-wrap border-2 border-t-0 border-solid !print:border-t-2"
        style="
          display: flex;
          border-color: var(--primary-color);
          background-color: #dfe0e2;
        "
      >
        <div
          class="pt-5"
          style="
            flex: 1 1 0%;
            border-right: 2px solid var(--primary-color);
            position: relative;
            padding-bottom: 40px;
            display: flex;
            flex-direction: column;
          "
        >
          <table cellspacing="0" class="weapons-table" style="width: 100%">
            <FancyScribeWeapons
              title="RANGED WEAPONS"
              :weapons="unit.rangedWeapons"
            />
            <FancyScribeWeapons
              title="MELEE WEAPONS"
              :weapons="unit.meleeWeapons"
            />
          </table>
          <div style="flex: 1 1 0%" />
          <table
            cellspacing="0"
            class="weapons-table"
            style="width: 100%; border-collapse: collapse"
          >
            <tbody>
              <tr
                v-if="
                  modelsWithDifferentProfiles.length > 0 &&
                  !weaponDescriptions.length
                "
                class="noBorderTop h-22.5px"
              >
                <td style="border-top: none; vertical-align: middle">
                  <div class="flex justify-center">
                    <svg
                      viewBox="0 0 16 8"
                      width="1.2rem"
                      height="8"
                      fill="var(--primary-color)"
                    >
                      <path d="m0 0h10l6 4-6 4h-10z" />
                    </svg>
                  </div>
                </td>
                <td
                  colspan="7"
                  style="
                    text-align: left;
                    font-size: 0.8em;
                    padding-left: 0;
                    vertical-align: middle;
                  "
                >
                  Before selecting targets for this weapon, select one of its
                  profiles to make attacks with.
                </td>
              </tr>
            </tbody>
          </table>

          <FancyScribeKeywords :keywords="unit.keywords" />
        </div>
        <div
          class="relative w-full p-1 pb-[50px] pt-5 md:max-w-[400px] md:p-[20px] print:p-[20px] sm:p-2 md:pb-[50px] md:pt-5 sm:pb-[50px] sm:pt-5 md:print:p-[20px] sm:print:p-[20px] md:print:pb-[50px] sm:print:pb-[50px]"
        >
          <div
            style="
              font-size: 1.1em;
              padding: 1px 6px;
              background-color: var(--primary-color);
              color: rgb(255, 255, 255);
              font-weight: 600;
              min-height: 27px;
              display: flex;
              align-items: center;
            "
          >
            ABILITIES
          </div>
          <FancyScribeRules :rules="rules" />
          <FancyScribeAbilities :abilities="unit.abilities.Abilities" />
          <FancyScribeOtherAbilities :abilities="unit.abilities" />

          <FancyScribeFactions :factions="unit.factions" />
          <FancyScribeFactionIcon />
        </div>
      </div>
    </div>
  </div>
</template>
