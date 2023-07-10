<script setup>
const attackerId = ref('lists/damien/sentinel')
const defenderId = ref('lists/braydon/mutalith-vortex-beast')
const { data: attacker, refresh: refreshAttacker } = await useAsyncData(attackerId.value, () => queryContent(attackerId.value).findOne())
const { data: defender, refresh: refreshDefender } = await useAsyncData(defenderId.value, () => queryContent(defenderId.value).findOne())

function getDetachmentRuleAttackModifier(unit) {
  if (unit?.factions?.find(faction => faction.toUpperCase() === 'ASTRA MILITARUM'))
    return 'LETHAL HITS'
}

function getAbilityValue(unit, name) {
  const ability = unit.abilities?.find((ability) => {
    return ability?.name?.toUpperCase()?.startsWith(name?.toUpperCase())
  })
  return Number(ability?.name?.match(/\d+/)[0] ?? 0)
}

const unitOptions = [
  {
    value: 'lists/damien/sentinel',
    label: 'Sentinel',
  },
  {
    value: 'lists/damien/hydra',
    label: 'Hydra',
  },
  {
    value: 'lists/damien/earthshaker-carriage-battery',
    label: 'Earthshaker Carriage Battery',
  },
  {
    value: 'lists/damien/death-korps-of-krieg',
    label: 'Death Korps of Krieg',
  },
  {
    value: 'lists/braydon/mutalith-vortex-beast',
    label: 'Mutalith Vortex Beast',
  },
]
</script>

<template>
  <div>
    <h1 class="h1 text-left">
      Battle Calculator
    </h1>

    <section>
      <table>
        <thead>
          <th class="p-1">
            <label class="font-bold">Attacker Unit</label>
          </th>
          <th class="p-1">
            <label class="font-bold">Defender Unit</label>
          </th>
        </thead>
        <tbody>
          <tr>
            <td class="p-1">
              <select v-model="attackerId" class="select w-250px" name="attacker" @change="refreshAttacker">
                <option v-for="option of unitOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </td>
            <td class="p-1">
              <select v-model="defenderId" class="select w-250px" name="defender" @change="refreshDefender">
                <option v-for="option of unitOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="my-6 container">
      <div class="row">
        <div class="col-6">
          <div class="text-left">
            <h2 class="h2">
              Attacker Statistics
            </h2>
            <p>{{ attacker.models }} {{ attacker.name }} {{ attacker.points }}pts</p>
          </div>
          <Attributes
            v-bind="{ ...attacker.attributes, ...attacker.weapons[0] }"
            :invulnerable="getAbilityValue(attacker, 'INVULNERABLE SAVE')"
            :pain="getAbilityValue(attacker, 'Feel No Pain')"
          />
        </div>
        <div class="col-6">
          <div class="text-left">
            <h2 class="h2">
              Defender Statistics
            </h2>
            <p>{{ defender.models }} {{ defender.name }} {{ defender.points }}pts</p>
          </div>
          <Attributes
            v-bind="{ ...defender.attributes, ...defender.weapons[0] }"
            :invulnerable="getAbilityValue(defender, 'INVULNERABLE SAVE')"
            :pain="getAbilityValue(defender, 'Feel No Pain')"
          />
        </div>
      </div>
    </section>

    <section class="my-9">
      <h2 class="h2 text-left">
        Average Attack Rolls
      </h2>

      <div
        v-for="weapon of attacker.weapons"
        :key="weapon.name"
        class="my-5"
      >
        <Combat
          v-bind="{ ...weapon }"
          :modifiers="[...weapon.modifiers ?? [], { name: getDetachmentRuleAttackModifier(attacker) }].filter(item => item?.name)"
          :abilities="attacker.abilities"
          :models="weapon.models ?? attacker.models"
          :toughness="defender.attributes.toughness"
          :save="defender.attributes.save"
          :invulnerable="getAbilityValue(defender, 'INVULNERABLE SAVE')"
          :pain="getAbilityValue(defender, 'Feel No Pain')"
        />
      </div>
    </section>
  </div>
</template>
