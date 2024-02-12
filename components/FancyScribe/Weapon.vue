<script setup>
const props = defineProps(['weapon', 'previousWeapon', 'nextWeapon', 'isMelee', 'classes'])
let {
  name,
  selectionName,
  range,
  type,
  str,
  ap,
  damage,
  abilities,
  bs,
  ws,
  attacks,
} = props.weapon;

if (name === "Krak grenades") {
  name = "Krak grenade";
}

const hasDifferentProfiles = (selectionName, name) => {
  return selectionName && selectionName.toLowerCase() !== name.toLowerCase();
};

const differentProfiles =
  hasDifferentProfiles(selectionName, name) &&
  ((props.previousWeapon &&
    hasDifferentProfiles(props.previousWeapon.selectionName, props.previousWeapon.name) &&
    selectionName === props.previousWeapon.selectionName) ||
    (props.nextWeapon &&
      hasDifferentProfiles(props.nextWeapon.selectionName, props.nextWeapon.name) &&
      selectionName === props.nextWeapon.selectionName));

if (differentProfiles && name.endsWith(" grenades")) {
  name = name.replace(" grenades", "");
}
if (differentProfiles && name.endsWith(" grenade")) {
  name = name.replace(" grenade", "");
}
if (name.startsWith("Missile launcher, ")) {
  name = name.replace("Missile launcher, ", "");
}
if (differentProfiles && name.includes(" - ")) {
  name = name.split(" - ")[1];
}

</script>

<template>
  <tr :class="classes">
    <td style="border-top: none;">
      <div v-if="differentProfiles" class="flex justify-center"><svg viewBox="0 0 16 8" width="1.2rem" height="8"
          fill="var(--primary-color)">
          <path d="m0 0h10l6 4-6 4h-10z"></path>
        </svg></div>
    </td>
    <td style="text-align: left;" :class="{'bg-[#d0d1d3]': classes.includes('rowOtherColor')}">
      <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0px 4px;">
        <template v-if="differentProfiles && selectionName">{{ selectionName }} - </template>

        <template v-if="differentProfiles">{{ name.replaceAll(selectionName, "").replaceAll(", ", "") }}</template>
        <template v-else>{{ name }}</template>
        <span v-if="type && type !== '-'" style="font-size: 0.8em;font-weight: 700;color: var(--primary-color);text-transform: uppercase;line-height: 1;">
          [{{ type }}]
        </span>
      </div>
    </td>
    <td class="align-middle" :class="{'bg-[#d0d1d3]': classes.includes('rowOtherColor')}">{{ range }}</td>
    <td class="align-middle" :class="{'bg-[#d0d1d3]': classes.includes('rowOtherColor')}">{{ attacks }}</td>
    <td class="align-middle" :class="{'bg-[#d0d1d3]': classes.includes('rowOtherColor')}">
      {{ isMelee
        ? ws.join
          ? ws.join("|")
          : ws
        : bs.join
          ? bs.join("|")
          : bs }}
    </td>
    <td class="align-middle" :class="{'bg-[#d0d1d3]': classes.includes('rowOtherColor')}">{{ str }}</td>
    <td class="align-middle" :class="{'bg-[#d0d1d3]': classes.includes('rowOtherColor')}">{{ ap }}</td>
    <td class="align-middle" :class="{'bg-[#d0d1d3]': classes.includes('rowOtherColor')}">{{ damage }}</td>
  </tr>

  <tr v-if="abilities && abilities !== '-'" :class="`${classes} noBorderTop`">
    <td style="background-color: #dfe0e2"></td>
    <td colspan="7" style="text-align: left; font-size: 0.9em; padding-top:0;padding-bottom: 1px; line-height: 1.4">
      {{ abilities }}
    </td>
  </tr>
</template>

<style>
.weapons-table td {
  padding: 1px .4rem;
  border-top: 1px dotted #9e9fa1;
  text-align: center;
}

.noBorderTop td {
  border-top: none;
}
</style>
