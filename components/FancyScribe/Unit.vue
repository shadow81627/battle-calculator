<script setup>
const props = defineProps(['unit', 'index', 'catalog', 'onePerPage', 'forceRules'])
let {
  name,
  meleeWeapons,
  rangedWeapons,
  abilities,
  keywords,
  factions,
  rules,
  modelStats,
  modelList,
  cost,
} = props.unit
// const [image, setImage] = useLocalStorage("image" + name);
// const hasImage = image && image !== "undefined";

const weapons = [...meleeWeapons, ...rangedWeapons]

const weaponDescriptions = weapons
  .filter(
    weapon =>
      (weapon.range === '-' || weapon.range === '') && weapon.abilities,
  )
  .sort((a, b) => a.selectionName.localeCompare(b.selectionName))
const modelsWithDifferentProfiles = weapons.filter((weapon, index) => {
  const { selectionName, name } = weapon
  const previousWeapon = weapons[index - 1]
  const nextWeapon = weapons[index + 1]
  const hasDifferentProfiles = (selectionName, name) => {
    return selectionName && selectionName.toLowerCase() !== name.toLowerCase()
  }
  return (
    hasDifferentProfiles(selectionName, name)
    && ((previousWeapon
      && hasDifferentProfiles(
        previousWeapon.selectionName,
        previousWeapon.name,
      )
      && selectionName === previousWeapon.selectionName)
      || (nextWeapon
        && hasDifferentProfiles(nextWeapon.selectionName, nextWeapon.name)
        && selectionName === nextWeapon.selectionName))
  )
})

function getOverridePrimary(factions, keywords) {
  if (!factions.has)
    return
  if (
    factions.has('Khorne')
    && factions.has('Tzeentch')
    && factions.has('Nurgle')
    && factions.has('Slaanesh')
  )
    return
  if (factions.has('Khorne') || keywords.has('Khorne'))
    return '#883531'
  if (factions.has('Tzeentch') || keywords.has('Tzeentch'))
    return '#015d68'
  if (factions.has('Nurgle') || keywords.has('Nurgle'))
    return '#5c672b'
  if (factions.has('Slaanesh') || keywords.has('Slaanesh'))
    return '#634c74'
}

const overridePrimary = getOverridePrimary(factions, keywords)

function areAllModelsTheSame(modelStats) {
  if (modelStats.length === 1)
    return true
  const firstModel = modelStats[0]
  return modelStats.every(
    model =>
      model.move === firstModel.move
      && model.toughness === firstModel.toughness
      && model.save === firstModel.save
      && model.wounds === firstModel.wounds
      && model.leadership === firstModel.leadership
      && model.oc === firstModel.oc
      && model.bs === firstModel.bs
      && model.ws === firstModel.ws
      && model.attacks === firstModel.attacks,
  )
}
if (areAllModelsTheSame(modelStats))
  modelStats = [modelStats[0]]

if (modelList.length === 1) {
  modelList[0] = modelList[0]
    .replace(name, '')
    .replace('(', '')
    .replace(')', '')
}
</script>

<template>
  <div
    class="avoid-page-break page-break mx-auto" style="font-weight: 500; margin-bottom: 32px; display: flex;
  flex-direction: column; flex-grow: 1;"
  >
    <div
      class="min-h-[15rem] !print:bg-none"
      style="color: #fff; position: relative; padding: 24px 0; padding-bottom: 24px; background: linear-gradient(90deg, rgba(20,21,25,1) 0%, rgba(48,57,62,1) 45%, rgba(73,74,79,1) 100%);"
    >
      <div style="padding: 4px 16px; color: rgb(255, 255, 255); position: relative; margin-left: 1.3rem;">
        <div style="position: absolute; left: 0px; top: 0px; width: 100%; display: flex;">
          <div style="background-color: var(--primary-color-transparent); height: 80px; min-width: 33%;" />
          <div style="height: 80px; display: flex; flex-direction: column;">
            <div style="background-color: var(--primary-color-transparent); height: 40px;" />
            <svg height="40" width="100" viewBox="0 0 100 40" style="fill: var(--primary-color-transparent);">
              <path d="m0 0h100c-32 0-68 40-100 40z" />
            </svg>
          </div>
          <div style="flex: 10 1 0%; background-color: var(--primary-color-transparent); height: 40px;" />
        </div>
        <div
          class="text-4xl font-barlow"
          style="letter-spacing: 0.1px; line-height: 1; text-transform: uppercase; z-index: 1; position: relative; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;"
        >
          {{ name }}
          <span style="text-transform: initial; font-size: 1.2rem;">
            {{ cost.points }}pts
          </span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px; z-index: 1; position: relative;">
          <FancyScribeModelStats
            v-for="(model, index) of modelStats" :key="index" :index="index" :model-stats="modelStats"
            :model-stat="model" :model-list="modelList" :show-name="modelStats.length > 1"
          />
        </div>
      </div>
      <div style="position: absolute; right: 0px; top: 0px; height: 100%; bottom: 0px; width: 45%;">
        <!-- <img v-if="hasImage" :src="image" alt="" style="width: 100%; height: 100%; object-fit: contain;" /> -->
        <div class="absolute right-[1px] top-[2px] flex gap-1">
          <!-- <label
							class="button print-display-none"
							style={{
								border: "1px solid #999",
								padding: "1px 4px",
								fontSize: "0.8rem",
								backgroundColor: "#f0f0f0",
							}}
						>
							<input
								ref={uploadRef}
								type="file"
								class="print-display-none"
								accept=".jpg,.png,.jpeg,.gif,.bmp,.tif,.tiff,.webp,.svg,.jfif,.pjpeg,.pjp,.avif,.apng,.ico,.cur,.ani"
								onChange={(e) => {
									posthog?.capture?.("user_uploaded_image", {
										unit_name: name,
									});
									if (e.target.files && e.target.files[0]) {
										let reader = new FileReader();
										reader.onload = function (ev) {
											setImage(ev.target.result);
										}.bind(this);
										reader.readAsDataURL(e.target.files[0]);
									}
								}}
								style={{
									display: "none",
								}}
							/>
							{hasImage ? "Change image" : "Upload image "}
						</label>
						{hasImage && (
							<button
								class="button print-display-none"
								style={{
									border: "1px solid #999",
									padding: "1px 4px",
									fontSize: "0.8rem",
									backgroundColor: "#f0f0f0",
								}}
								onClick={() => {
									setImage(undefined);
								}}
							>
								Clear image
							</button>
						)} -->
        </div>
      </div>
    </div>
    <div class="flex-grow !print:border-t-2" style="display: flex; border: 2px solid var(--primary-color); xborder-top: none; background-color: #DFE0E2">
      <div
        class="pt-5"
        style="flex: 1 1 0%; border-right: 2px solid var(--primary-color); position: relative; padding-bottom: 40px; display: flex; flex-direction: column;"
      >
        <table cellspacing="0" class="weapons-table" style="width: 100%">
          <FancyScribeWeapons
            title="RANGED WEAPONS" :weapons="rangedWeapons" :model-stats="modelStats"
            :force-rules="forceRules"
          />
          <FancyScribeWeapons
            title="MELEE WEAPONS" :weapons="meleeWeapons" :model-stats="modelStats"
            :force-rules="forceRules"
          />
        </table>
        <div style="flex: 1 1 0%;" />
        <table cellspacing="0" class="weapons-table" style="width: 100%">
          <tbody>
            <tr
              v-if="modelsWithDifferentProfiles.length > 0
                && !weaponDescriptions.length" class="noBorderTop h-22.5px"
            >
              <td style="border-top: none; vertical-align: middle;">
                <div class="flex justify-center">
                  <svg
                    viewBox="0 0 16 8" width="1.2rem" height="8"
                    fill="var(--primary-color)"
                  >
                    <path d="m0 0h10l6 4-6 4h-10z" />
                  </svg>
                </div>
              </td>
              <td colspan="7" style="text-align: left; font-size: 0.8em; padding-left: 0; vertical-align: middle;">
                Before selecting targets for this weapon, select one of
                its profiles to make attacks with.
              </td>
            </tr>
          </tbody>
        </table>

        <FancyScribeKeywords :keywords="keywords" />
      </div>
      <div
        class="relative max-w-[400px] flex-1 p-1 pb-[50px] pt-5 md:p-[20px] print:p-[20px] sm:p-2 md:pb-[50px] md:pt-5 sm:pb-[50px] sm:pt-5 md:print:p-[20px] sm:print:p-[20px] md:print:pb-[50px] sm:print:pb-[50px]"
      >
        <div
          style="font-size: 1.1em; padding: 1px 6px; background-color: var(--primary-color); color: rgb(255, 255, 255); font-weight: 600; min-height: 27px; display: flex; align-items: center;"
        >
          ABILITIES
        </div>
        <FancyScribeRules :rules="rules" />
        <FancyScribeAbilities :abilities="abilities.Abilities" />
        <FancyScribeOtherAbilities :abilities="abilities" />

        <FancyScribeFactions :factions="factions" />
        <FancyScribeFactionIcon :catalog="catalog" />
      </div>
    </div>
  </div>
</template>
