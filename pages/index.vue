<script setup>
const turns = ref(1)
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

    <section class="my-6 container">
      <div class="row">
        <div class="col col-6">
          <label class="text-left font-bold">Attacker Unit</label>
          <select v-model="attackerId" class="select w-250px" name="attacker" @change="refreshAttacker">
            <option
              v-for="option of unitOptions"
              :key="option.value"
              :value="option.value"
              :selected="attackerId === option.value ? option.value : undefined"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="col col-6">
          <label class="text-left font-bold">Defender Unit</label>
          <select v-model="defenderId" class="select w-250px" name="defender" @change="refreshDefender">
            <option
              v-for="option of unitOptions"
              :key="option.value"
              :value="option.value"
              :selected="defenderId === option.value ? option.value : undefined"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </section>

    <section class="my-6 container">
      <div class="row">
        <div class="col col-6">
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
        <div class="col col-6">
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

    <section class="my-9 container">
      <div class="row">
        <div class="col">
          <h2 class="h2 text-left">
            Attack Rolls
          </h2>
          <table>
            <tbody>
              <tr>
                <td class="p-1">
                  <label class="font-bold">Turns</label>
                </td>
                <td class="p-1">
                  <input v-model="turns" name="turns" class="input max-w-250px" type="number" max="5" min="1">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="row">
        <div class="col col-6">
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
              :turns="turns"
            />
          </div>
        </div>
        <div class="col col-6">
          <div
            v-for="weapon of defender.weapons"
            :key="weapon.name"
            class="my-5"
          >
            <Combat
              v-bind="{ ...weapon }"
              :modifiers="[...weapon.modifiers ?? [], { name: getDetachmentRuleAttackModifier(defender) }].filter(item => item?.name)"
              :abilities="defender.abilities"
              :models="weapon.models ?? defender.models"
              :toughness="attacker.attributes.toughness"
              :save="attacker.attributes.save"
              :invulnerable="getAbilityValue(attacker, 'INVULNERABLE SAVE')"
              :pain="getAbilityValue(attacker, 'Feel No Pain')"
              :turns="turns"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
