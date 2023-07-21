<script setup lang="ts">
import Unit, { Weapon } from '~/types/unit'
defineProps<{
  unit: Unit,
  target: Unit,
  distance?: number,
  turns?: number,
}>()
const order = ref('')

function hasFaction(unit: Unit, key: string) {
  return unit?.factions?.find(faction => faction.toUpperCase() === key.toUpperCase() )
}

function getDetachmentRuleAttackModifier(unit: Unit, weapon: Weapon) {
  if (
    hasFaction(unit, 'ASTRA MILITARUM') &&
    weapon.range !== "Melee" &&
    !unit.keywords?.find((item) => item.toUpperCase() === 'AIRCRAFT')
  ) {
    return 'LETHAL HITS'
  }
  if (hasFaction(unit, 'Orks') && weapon.range === "Melee") {
    return 'SUSTAINED HITS 1'
  }
}
</script>

<template>
  <div>
    <div class="text-left">
      <p>{{ unit.models }} {{ unit.name }} {{ unit.points }}pts</p>
    </div>
    <!-- <div class="container">
            <div class="row">
              <div class="col-3">
                <label>Move ({{ unit.moved }})</label>
                <input name="movement" type="number" class="input" :max="unit.movement" v-model="unit.moved" />
              </div>
            </div>
          </div> -->
    <Attributes class="mb-5" :attributes="unit.attributes" :additions="{
      invulnerable: getAbilityValue(unit, 'INVULNERABLE SAVE') ?? (order === 'WAAAGH!' ? 5 : undefined),
      pain: getAbilityValue(unit, 'Feel No Pain'),
      points: unit.points,
    }" />
    <section class="my-5" style="overflow-x:auto;">
      <WeaponAttributes v-if="unit.weapons?.length" :unit="unit" class="w-full"></WeaponAttributes>
      <div v-for="enhancement of (unit.enhancements ?? [])" :key="enhancement.name">
        Enhancement:
        {{ enhancement.name }} ({{ enhancement.points }})
      </div>
      <div v-for="member of unit.members" :key="member.name">
        <div class="text-left uppercase font-barlow font-700">{{ member.name }}</div>
        <WeaponAttributes :unit="member" class="w-full"></WeaponAttributes>
      </div>
      <br>
    </section>
    <section class="my-5">
      <div>
        <table>
          <thead>
            <th class="text-left"><label>Orders</label></th>
          </thead>
          <tbody>
            <select v-if="hasFaction(unit, 'ASTRA MILITARUM')" v-model="order" class="inline w-250px select">
              <option value="" selected>
                None
              </option>
              <option value="take-aim">
                Take Aim
              </option>
            </select>
          </tbody>
        </table>
      </div>
      <div>
        <!-- <select v-if="hasFaction(defender, 'ORKS')" v-model="order" class="inline w-250px select">
                <option value="">
                  None
                </option>
                <option value="WAAAGH!">
                  WAAAGH!
                </option>
              </select> -->
      </div>
    </section>

    <section v-for="weapon of unit.weapons" :key="weapon.name" class="border-y border-solid py-5">
      <template v-if="weapon.profiles?.length || weapon.alternatives?.length">
        <Combat v-for="profile of (weapon.profiles ?? weapon.alternatives)" :key="profile.name" v-bind="{ ...profile }"
          :distance="distance"
          :modifiers="[...profile.modifiers ?? [], { name: getDetachmentRuleAttackModifier(unit, profile) }].filter(item => item?.name)"
          :abilities="unit.abilities ?? []" :models="profile.models ?? unit.models"
          :toughness="target.attributes.toughness" :save="target.attributes.save"
          :invulnerable="getAbilityValue(target, 'INVULNERABLE SAVE') ?? (order === 'WAAAGH!' ? 5 : undefined)"
          :pain="getAbilityValue(target, 'Feel No Pain')" :turns="turns" :target="target"
          :order="hasFaction(unit, 'ASTRA MILITARUM') ? order : undefined" />
      </template>
      <Combat v-if="!weapon.profiles && !weapon.alternatives?.find(alternative => alternative.name === weapon.name)"
        v-bind="{ ...weapon }" :distance="distance"
        :modifiers="[...weapon.modifiers ?? [], { name: getDetachmentRuleAttackModifier(unit, weapon) }].filter(item => item?.name)"
        :abilities="unit.abilities ?? []" :models="weapon.models ?? unit.models" :toughness="target.attributes.toughness"
        :save="target.attributes.save" :invulnerable="getAbilityValue(target, 'INVULNERABLE SAVE')"
        :pain="getAbilityValue(target, 'Feel No Pain')" :turns="turns" :target="target"
        :order="hasFaction(unit, 'ASTRA MILITARUM') ? order : undefined" />
    </section>
  </div>
</template>
