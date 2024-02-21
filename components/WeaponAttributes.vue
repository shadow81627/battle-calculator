<script setup lang="ts">
import type Unit from "~/types/unit";

defineProps<{ unit: Unit }>();

function cellClasses(index: number) {
  let base = "px-2 border-b-1 border-dotted border-color-[#9e9fa1]";
  if (index % 2 !== 0)
    base = `${base} dark:bg-slate-800 bg-[#d0d1d3] !print:bg-[#d0d1d3]`;

  return base;
}
function profileClasses(index: number, total: number) {
  const last = index + 1 === total;
  return {
    "px-2": true,
    "border-b-1": last,
    "border-dotted": last,
  };
}
</script>

<template>
  <table
    class="border-2 border-solid dark:border-slate-600"
    cellspacing="0"
    cellpadding="0"
  >
    <thead>
      <tr class="bg-[#d0d1d3] dark:bg-slate-800 !print:bg-[#d0d1d3]">
        <th class="hidden w-[2.2em] sm:table-cell">
          <div style="display: flex; min-width: 0.7em; justify-content: center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21px"
              height="21px"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M11 2v2.07A8.002 8.002 0 0 0 4.07 11H2v2h2.07A8.002 8.002 0 0 0 11 19.93V22h2v-2.07A8.002 8.002 0 0 0 19.93 13H22v-2h-2.07A8.002 8.002 0 0 0 13 4.07V2m-2 4.08V8h2V6.09c2.5.41 4.5 2.41 4.92 4.91H16v2h1.91c-.41 2.5-2.41 4.5-4.91 4.92V16h-2v1.91C8.5 17.5 6.5 15.5 6.08 13H8v-2H6.09C6.5 8.5 8.5 6.5 11 6.08M12 11a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1"
              />
            </svg>
          </div>
        </th>
        <th class="hidden px-2 text-left sm:table-cell">Weapon</th>
        <th class="px-2">Range</th>
        <th class="px-2">A</th>
        <th class="px-2">WS</th>
        <th class="px-2">S</th>
        <th class="px-2">AP</th>
        <th class="px-2">D</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(weapon, index) of unit.weapons" :key="weapon.name">
        <template v-if="!weapon.profiles">
          <tr>
            <td
              :class="cellClasses(index)"
              width="100%"
              class="table-cell border-none text-center sm:hidden"
              colspan="8"
            >
              <strong>{{ weapon.name }}</strong>
            </td>
          </tr>
          <tr>
            <td class="hidden sm:table-cell" />
            <td
              :class="cellClasses(index)"
              width="50%"
              class="hidden sm:table-cell"
            >
              {{ weapon.name }}
              <template v-if="weapon.modifiers && weapon.modifiers.length">
                [<span
                  v-for="(modifier, modifierIndex) of weapon.modifiers"
                  :key="modifier.name"
                  style="
                    font-size: 0.8em;
                    font-weight: 700;
                    color: var(--primary-color);
                    text-transform: uppercase;
                    line-height: 1;
                  "
                >
                  {{ modifier.name
                  }}<template
                    v-if="modifierIndex + 1 !== weapon.modifiers.length"
                    >,</template
                  > </span
                >]
              </template>
            </td>
            <td :class="cellClasses(index)" class="text-center">
              {{ weapon.range }}
            </td>
            <td :class="cellClasses(index)" class="text-center">
              {{ weapon.attack }}
            </td>
            <td :class="cellClasses(index)" class="text-center">
              {{ weapon.accuracy }}
            </td>
            <td :class="cellClasses(index)" class="text-center">
              {{ weapon.strength }}
            </td>
            <td :class="cellClasses(index)" class="text-center">
              {{ weapon.piercing }}
            </td>
            <td :class="cellClasses(index)" class="text-center">
              {{ weapon.damage }}
            </td>
          </tr>
        </template>
        <template v-else>
          <template
            v-for="(profile, profileIndex) of weapon.profiles"
            :key="profile.name"
          >
            <tr>
              <td
                :class="profileClasses(profileIndex, weapon.profiles.length)"
                width="100%"
                class="table-cell border-none text-center sm:hidden"
                colspan="8"
              >
                <strong>{{ profile.name }}</strong>
              </td>
            </tr>
            <tr>
              <td class="hidden sm:table-cell">
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
                class="hidden px-2 sm:table-cell"
                width="50%"
                :class="profileClasses(profileIndex, weapon.profiles.length)"
              >
                {{ profile.name }}
              </td>
              <td
                class="px-2 text-center"
                :class="profileClasses(profileIndex, weapon.profiles.length)"
              >
                {{ profile.range }}
              </td>
              <td
                class="px-2 text-center"
                :class="profileClasses(profileIndex, weapon.profiles.length)"
              >
                {{ profile.attack }}
              </td>
              <td
                class="px-2 text-center"
                :class="profileClasses(profileIndex, weapon.profiles.length)"
              >
                {{ profile.accuracy }}
              </td>
              <td
                class="px-2 text-center"
                :class="profileClasses(profileIndex, weapon.profiles.length)"
              >
                {{ profile.strength }}
              </td>
              <td
                class="px-2 text-center"
                :class="profileClasses(profileIndex, weapon.profiles.length)"
              >
                {{ profile.piercing }}
              </td>
              <td
                class="px-2 text-center"
                :class="profileClasses(profileIndex, weapon.profiles.length)"
              >
                {{ profile.damage }}
              </td>
            </tr>
          </template>
        </template>
      </template>
      <tr>
        <td>&nbsp;</td>
      </tr>
    </tbody>
  </table>
</template>
