<script setup>
const props = defineProps(['title', 'weapons', 'modelStats', 'forceRules'])
const isMelee = props.title === "MELEE WEAPONS";

const getWeaponClassNames = (weapons, index) => {
  let differentColor = false;
  for (let i = 1; i <= index; i++) {
    let { selectionName } = weapons[i];
    if (!selectionName && !weapons[i - 1].selectionName) {
      if (weapons[i].name !== weapons[i - 1].name) {
        differentColor = !differentColor;
      }
    }
    if (selectionName !== weapons[i - 1].selectionName) {
      differentColor = !differentColor;
    }
  }
  const classes = [];
  if (differentColor) classes.push("bg-[#d0d1d3]");
  if (index === 0) classes.push("noBorderTop");
  if (
    index > 0 &&
    weapons[index].selectionName === weapons[index - 1].selectionName
  )
    classes.push("noBorderTop");
  return classes.join(" ");
};
</script>
<template>
  <thead v-if="weapons.length">
    <tr style="background-color: var(--primary-color); color: rgb(255, 255, 255);">
      <th class="w-[2.2em]">
        <div style="display: flex; min-width: 0.7em; justify-content: center;">
          <img v-if="isMelee" alt=""
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAASCAYAAAC0EpUuAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAH0SURBVDhPvVN/b9JQFH1o/I/MxG/A1+AzGhN/xrglE4i4odtwxmQF5hSyRQPKzDInaGxDCBmtdB2s7aNQjpdHQ1KhBf3Dk7y+9+695/S9k3fZf8Vq5jm85QwePUviycZGYH4uyrUaTAAnDXmG+DCxDt3huKK8dHi4WDixswOLim0amnkl5vLZqY+oqG30Kd4xbXCa5bYaLLxdKODSdUVhU7+YEG0Lj5MJH6lUKcOmOtNxYZgcvYGLnjuaL9zQdRLh0HomDO5AaZ/j/trq3OL9Ugl614Q1GAlxnfexncv5a8+5TT45wsfxCQc0DMsKvFahWMTQqxuPlnEprFrLZATn2uQTYRRj12ndaLZYsXTELMti5shF6uULn3j12xni8Tir/5BZ9fiEdS3Obt1cEblIJCLmKTTbFn/0tgITfzvT2Oab18LzL/XaNPZKyotTJrNZHzcQ98jTytdTdEdD7Fc+QtY1FD4cLUdehF8Djgty8d3xp6UEhaeLMPbqBjkei8W8SDhCRd9Xq5A7HRTyb1mUlKPRFTbuJC/998jkJKhOH1v5vE+k/L2O3r8Ibx0coENdk9zdnUtWDAPNkHc8gyw9bI0ENyUplPRZUdDiHHdTqXDxO9Tn6nCI9N7eUqf4SSdWqUG8bTAepNPLX4tw++n6H/WM/Qb5yZZZuC/34QAAAABJRU5ErkJggg==" />
          <!-- <svg v-if="isMelee" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 32 32">
            <path fill="currentColor" d="m30.2 8.3q0.1-0.2 0.2-0.5 0.1-0.2 0.1-0.5 0-0.3-0.2-0.5-0.1-0.3-0.2-0.4c-0.2-0.3-1.4-1.4-1.5-1.5q-0.2-0.2-0.4-0.3-0.2-0.1-0.4-0.1-0.3-0.1-0.5 0-0.2 0-0.4 0.1l-2.1-2.1q-0.3-0.2-0.6-0.4-0.3-0.1-0.7-0.1-0.3 0-0.7 0.1-0.3 0.2-0.5 0.4l-4 4q-0.3 0.3-0.4 0.6-0.1 0.3-0.1 0.7 0 0.3 0.1 0.6 0.1 0.4 0.4 0.6l2 2c-3.2 3.2-3.1 3.2-3.4 3.3l-2.9-2.9 2.3-2.4q0.3-0.2 0.4-0.6 0.1-0.3 0.1-0.6 0-0.4-0.1-0.7-0.1-0.3-0.4-0.6l-3.9-4q-0.3-0.2-0.6-0.4-0.3-0.1-0.7-0.1-0.3 0-0.7 0.1-0.3 0.2-0.5 0.4l-2.5 2.5q-0.2-0.1-0.4-0.2-0.3 0-0.5 0-0.2 0.1-0.4 0.2-0.2 0.1-0.4 0.2c-0.2 0.2-1 1-1.5 1.5q-0.1 0.2-0.2 0.4-0.2 0.2-0.2 0.4 0 0.2 0 0.5 0 0.2 0.2 0.4l-2.5 2.5q-0.2 0.2-0.4 0.5-0.1 0.4-0.1 0.7 0 0.4 0.1 0.7 0.2 0.3 0.4 0.6l4 3.9q0.2 0.3 0.6 0.4 0.3 0.2 0.6 0.2 0.4 0 0.7-0.2 0.3-0.1 0.6-0.4l2.4-2.3 2.2 2.2-7.9 8q-0.3 0.3-0.4 0.6-0.1 0.3-0.1 0.7 0 0.3 0.1 0.6 0.1 0.4 0.4 0.6l2.5 2.5q0.3 0.3 0.6 0.4 0.3 0.2 0.7 0.2 0.3 0 0.6-0.2 0.4-0.1 0.6-0.4l7.2-7.2 7.3 7.2q0.2 0.3 0.5 0.4 0.4 0.2 0.7 0.2 0.4 0 0.7-0.2 0.3-0.1 0.6-0.4l2.5-2.5q0.2-0.3 0.4-0.6 0.1-0.3 0.1-0.7 0-0.3-0.1-0.6-0.2-0.4-0.4-0.6l-7.9-7.9 2.6-2.7 2.2 2.2q0.1 0.2 0.3 0.3 0.2 0.2 0.5 0.2 0.2 0.1 0.5 0.2 0.2 0 0.5 0 0.2 0 0.5 0 0.2-0.1 0.4-0.2 0.3-0.1 0.5-0.2 0.2-0.1 0.4-0.3c0.3-0.4 0.6-0.9 0.7-1.4l0.5-2.8q0.1-0.6 0.1-1.1 0-0.6-0.1-1.1-0.1-0.6-0.3-1.1-0.2-0.5-0.4-1z"/>
          </svg> -->
          <svg v-if="!isMelee" xmlns="http://www.w3.org/2000/svg" width="21px" height="21px" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M11 2v2.07A8.002 8.002 0 0 0 4.07 11H2v2h2.07A8.002 8.002 0 0 0 11 19.93V22h2v-2.07A8.002 8.002 0 0 0 19.93 13H22v-2h-2.07A8.002 8.002 0 0 0 13 4.07V2m-2 4.08V8h2V6.09c2.5.41 4.5 2.41 4.92 4.91H16v2h1.91c-.41 2.5-2.41 4.5-4.91 4.92V16h-2v1.91C8.5 17.5 6.5 15.5 6.08 13H8v-2H6.09C6.5 8.5 8.5 6.5 11 6.08M12 11a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1" />
          </svg>
        </div>
      </th>
      <th style="text-align: left">{{ title }}</th>
      <th class="w-[5%]">RANGE</th>
      <th class="w-[5%]">A</th>
      <th class="w-[5%]">{{ isMelee ? "WS" : "BS" }}</th>
      <th class="w-[5%]">S</th>
      <th class="w-[5%]">AP</th>
      <th class="w-[5%]">D</th>
    </tr>
  </thead>
  <tbody>
    <FancyScribeWeapon v-for="(weapon, index) of  weapons " :key="weapon.name" :weapon="weapon"
      :previousWeapon="weapons[index - 1]" :nextWeapon="weapons[index + 1]" :isMelee="isMelee"
      :classes="getWeaponClassNames(weapons, index)" />
    <tr v-if="weapons.length" class="h-22.5px">
      <td style=" border-top: none"></td>
      <td colspan="7"></td>
    </tr>
  </tbody>
</template>
