<script setup>
const order = ref('')
const turns = ref(1)
const range = ref(24)
const attackerId = ref('/lists/damien/scout-sentinels')
const defenderId = ref('/lists/braydon/mutalith-vortex-beast')
const { data: attacker, refresh: refreshAttacker } = await useAsyncData(attackerId.value, () => queryContent(attackerId.value).findOne())
const { data: defender, refresh: refreshDefender } = await useAsyncData(defenderId.value, () => queryContent(defenderId.value).findOne())

function hasFaction(unit, key) {
  return unit?.factions?.find(faction => faction.toUpperCase() === key)
}

function getDetachmentRuleAttackModifier(unit, weapon) {
  if (hasFaction(unit, 'ASTRA MILITARUM') && weapon.range !== "Melee")
    return 'LETHAL HITS'
}

const { data: unitOptions } = await useAsyncData('lists', () => queryContent('lists').find(), {
  transform(data) {
    return data.map(item => ({ value: item._path, label: item.name }))
  },
})
</script>

<template>
  <div>
    <h1 class="text-left h1">
      Battle Calculator
    </h1>

    <section class="container my-9">
      <div class="row">
        <div class="col">
          <table class="text-left">
            <thead>
              <th class="p-1">
                <label class="font-bold">Turns</label>
              </th>
              <th class="p-1">
                <label class="font-bold">Range</label>
              </th>
            </thead>
            <tbody>
              <tr>
                <td class="p-1">
                  <input v-model="turns" name="turns" class="max-w-250px input" type="number" max="5" min="1">
                </td>
                <td class="p-1">
                  <input v-model="range" name="range" class="max-w-250px input" type="number" min="1">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="container my-6">
      <div class="row">
        <div class="col col-6">
          <div class="text-left">
            <h2 class="h2">
              Attacker
              <select v-model="attackerId" class="inline w-250px select" name="attacker" @change="refreshAttacker">
                <option
                  v-for="option of unitOptions"
                  :key="option.value"
                  :value="option.value"
                  :selected="attackerId === option.value ? option.value : undefined"
                >
                  {{ option.label }}
                </option>
              </select>
              <select
                v-if="hasFaction(attacker, 'ASTRA MILITARUM')"
                v-model="order"
                class="inline w-250px select"
              >
                <option value="">
                  None
                </option>
                <option value="take-aim">
                  Take Aim
                </option>
              </select>
            </h2>
            <p>{{ attacker.models }} {{ attacker.name }} {{ attacker.points }}pts</p>
          </div>
          <Attributes
            class="mb-5"
            :attributes="attacker.attributes"
            :additions="{
              invulnerable: getAbilityValue(attacker, 'INVULNERABLE SAVE') || undefined,
              pain: getAbilityValue(attacker, 'Feel No Pain') || undefined
            }"
          />
          <div
            v-for="weapon of attacker.weapons"
            :key="weapon.name"
            class="border-y border-solid py-5"
          >
            <template v-if="weapon.profiles?.length || weapon.alternatives?.length">
              <Combat
                v-for="profile of (weapon.profiles ?? weapon.alternatives)"
                :key="profile.name"
                v-bind="{ ...profile }"
                :modifiers="[...profile.modifiers ?? [], { name: getDetachmentRuleAttackModifier(attacker, profile) }].filter(item => item?.name)"
                :abilities="attacker.abilities"
                :models="profile.models ?? attacker.models"
                :toughness="defender.attributes.toughness"
                :save="defender.attributes.save"
                :invulnerable="getAbilityValue(defender, 'INVULNERABLE SAVE')"
                :pain="getAbilityValue(defender, 'Feel No Pain')"
                :turns="turns"
                :target="defender"
                :order="hasFaction(attacker, 'ASTRA MILITARUM') ? order : undefined"
              />
            </template>
            <Combat
              v-if="!weapon.profiles && !weapon.alternatives?.find(alternative => alternative.name === weapon.name)"
              v-bind="{ ...weapon }"
              :modifiers="[...weapon.modifiers ?? [], { name: getDetachmentRuleAttackModifier(attacker, weapon) }].filter(item => item?.name)"
              :abilities="attacker.abilities"
              :models="weapon.models ?? attacker.models"
              :toughness="defender.attributes.toughness"
              :save="defender.attributes.save"
              :invulnerable="getAbilityValue(defender, 'INVULNERABLE SAVE')"
              :pain="getAbilityValue(defender, 'Feel No Pain')"
              :turns="turns"
              :target="defender"
              :order="hasFaction(attacker, 'ASTRA MILITARUM') ? order : undefined"
            />
          </div>
        </div>
        <div class="col col-6">
          <div class="text-left">
            <h2 class="h2">
              Defender
              <select v-model="defenderId" class="inline w-250px select" name="defender" @change="refreshDefender">
                <option
                  v-for="option of unitOptions"
                  :key="option.value"
                  :value="option.value"
                  :selected="defenderId === option.value ? option.value : undefined"
                >
                  {{ option.label }}
                </option>
              </select>
            </h2>
            <p>{{ defender.models }} {{ defender.name }} {{ defender.points }}pts</p>
          </div>
          <Attributes
            class="mb-5"
            :attributes="defender.attributes"
            :additions="{
              invulnerable: getAbilityValue(defender, 'INVULNERABLE SAVE'),
              pain: getAbilityValue(defender, 'Feel No Pain')
            }"
          />
          <div
            v-for="weapon of defender.weapons"
            :key="weapon.name"
            class="border-y border-solid py-5"
          >
            <template v-if="weapon.profiles?.length || weapon.alternatives?.length">
              <Combat
                v-for="profile of (weapon.profiles ?? weapon.alternatives)"
                v-bind="{ ...profile }"
                :key="profile.name"
                :modifiers="[...profile.modifiers ?? [], { name: getDetachmentRuleAttackModifier(defender, profile) }].filter(item => item?.name)"
                :abilities="defender.abilities"
                :models="weapon.models ?? defender.models"
                :target="attacker"
                :toughness="attacker.attributes.toughness"
                :save="attacker.attributes.save"
                :invulnerable="getAbilityValue(attacker, 'INVULNERABLE SAVE')"
                :pain="getAbilityValue(attacker, 'Feel No Pain')"
                :turns="turns"
              />
            </template>
            <Combat
              v-if="!weapon.profiles && !weapon.alternatives?.find(alternative => alternative.name === weapon.name)"
              v-bind="{ ...weapon }"
              :modifiers="[...weapon.modifiers ?? [], { name: getDetachmentRuleAttackModifier(defender, weapon) }].filter(item => item?.name)"
              :abilities="defender.abilities"
              :models="weapon.models ?? defender.models"
              :target="attacker"
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
