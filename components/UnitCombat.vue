<script setup lang="ts">
import { groupBy } from 'lodash-es'
import type { Weapon } from '~/types/unit'
import type Unit from '~/types/unit'

const props = defineProps<{
  unit: Unit
  target: Unit
  distance?: number
  turns?: number
}>()
const order = ref('')
const stratagem = ref('')

function hasFaction(unit: Unit, key: string) {
  return unit?.factions?.find(faction => faction.toUpperCase() === key.toUpperCase())
}

function getDetachmentRuleAttackModifier(unit: Unit, weapon: Weapon) {
  if (
    hasFaction(unit, 'ASTRA MILITARUM')
    && weapon.range !== 'Melee'
    && !unit.keywords?.find(item => item.toUpperCase() === 'AIRCRAFT')
  )
    return 'LETHAL HITS'

  if (hasFaction(unit, 'Orks') && weapon.range === 'Melee')
    return 'SUSTAINED HITS 1'
}

const _unit = computed(() => props.unit)

const weapons = computed(() => {
  function addMemberWeaponModels(member: Unit) {
    return member.weapons?.map((weapon) => {
      if (!weapon.models)
        weapon.models = member.models ?? _unit.value.models
      return weapon
    })
  }
  const memberWeapons = _unit.value.members?.map(addMemberWeaponModels).flat()
  const deduplicatedMemberWeapons = Object.entries(groupBy(memberWeapons, 'name')).map(([key, weapons]) => {
    const models = weapons.reduce((sum, weapon) => sum + (weapon?.models ?? 0), 0)
    return { ...weapons[0], models }
  }) ?? []
  return [...deduplicatedMemberWeapons, ..._unit.value.weapons ?? []]?.filter((weapon): weapon is Weapon => {
    return weapon !== undefined
  })
})

const url = computed(() => {
  if (_unit.value.dataSheetUrl)
    return _unit.value.dataSheetUrl
  const segments = _unit.value._path.split('/')
  const unitSlug = segments.slice(-1)
  const listSlug = segments.slice(-2).reverse().pop()
  if (listSlug !== 'lists')
    return `lists/${listSlug}/units/${unitSlug}`
})

const _order = computed(() => hasFaction(_unit.value, 'ASTRA MILITARUM') || hasFaction(_unit.value, 'ORKS') ? order.value : undefined)

const selections = ref({})
</script>

<template>
  <div>
    <div class="text-left">
      <NuxtLink v-if="url" :to="url" target="_blank">
        <p>{{ _unit.models }} {{ _unit.name }} {{ _unit.points }}pts</p>
      </NuxtLink>
      <p v-else>
        {{ _unit.models }} {{ _unit.name }} {{ _unit.points }}pts
      </p>
    </div>
    <!-- <div class="container">
            <div class="row">
              <div class="col-3">
                <label>Move ({{ _unit.moved }})</label>
                <input name="movement" type="number" class="input" :max="_unit.movement" v-model="_unit.moved" />
              </div>
            </div>
          </div> -->
    <Attributes class="mb-5" :unit="unit" />
    <section class="my-5" style="overflow-x:auto;">
      <Accordion>
        <template #header>
          Weapons
        </template>
        <WeaponAttributes v-if="_unit.weapons?.length" :unit="unit" class="w-full" />
        <div v-for="enhancement of (_unit.enhancements ?? [])" :key="enhancement.name">
          Enhancement:
          {{ enhancement.name }} ({{ enhancement.points }})
        </div>
        <div v-for="member of _unit.members" :key="member.name">
          <div class="text-left font-700 font-barlow uppercase">
            {{ member.name }}
          </div>
          <WeaponAttributes :unit="member" class="w-full" />
        </div>
      </Accordion>
      <br>
    </section>
    <section class="my-5 flex">
      <span v-if="hasFaction(unit, 'ASTRA MILITARUM')" class="flex flex-col p-1">
        <label class="block p-1">Orders</label>
        <select v-model="order" class="inline w-250px select">
          <option value="" selected>
            None
          </option>
          <option value="take-aim">
            TAKE AIM!
          </option>
          <option value="fix-bayonets">
            FIX BAYONETS!
          </option>
        </select>
      </span>
      <!-- <span v-if="hasFaction(unit, 'Oath of Moment')" class="flex flex-col p-1">
        <label class="block p-1">Oath of Moment</label>
        <select v-model="order" class="inline w-250px select">
          <option value="" selected>
            None
          </option>
        </select>
      </span> -->
      <!-- <span v-if="unit?.abilities?.find(ability => ability.name === 'Master of Magicks (Psychic)')" class="flex flex-col p-1">
        <label class="block p-1">Master of Magicks (Psychic)</label>
        <select v-model="selections['Master of Magicks (Psychic)']" class="inline w-250px select">
          <option value="" selected>
            None
          </option>
          <option value="">
            IGNORES COVER
          </option>
          <option value="">
            LETHAL HITS
          </option>
          <option value="">
            SUSTAINED HITS D3
          </option>
        </select>
      </span> -->
      <span v-if="hasFaction(unit, 'ORKS')" class="flex flex-col p-1">
        <label class="block p-1">Army Rule</label>
        <select v-model="order" class="inline w-250px select">
          <option value="">
            None
          </option>
          <option value="WAAAGH!">
            WAAAGH!
          </option>
        </select>
      </span>
      <span v-show="hasFaction(unit, 'ORKS')" class="flex flex-col p-1">
        <label class="p-1">Stratagem</label>
        <select v-model="stratagem" class="inline w-250px select">
          <option value="">
            None
          </option>
          <option v-if="hasFaction(unit, 'ORKS')" value="UNBRIDLED CARNAGE">
            UNBRIDLED CARNAGE
          </option>
        </select>
      </span>
    </section>

    <section v-for="weapon of weapons" :key="weapon.name" class="border-y border-solid py-5">
      <Combat
        v-if="!weapon.profiles && !weapon.alternatives?.find(alternative => alternative.name === weapon.name)"
        v-bind="{ ...weapon }" :distance="distance" :weapon="weapon" :unit="unit"
        :modifiers="[...weapon.modifiers ?? [], { name: getDetachmentRuleAttackModifier(unit, weapon) }].filter(item => item?.name)"
        :abilities="_unit.abilities ?? []" :models="weapon.models ?? _unit.models" :toughness="target.attributes.toughness"
        :turns="turns" :target="target"
        :order="_order"
        :stratagem="stratagem"
        :selections="selections"
      />
      <template v-if="weapon.alternatives?.length">
        <p class="pt-5">
          This model’s {{ weapon.name }} can be replaced with one of the following:
        </p>
        <Accordion v-for="profile of weapon.alternatives" :key="profile.name">
          <template #header>
            {{ profile.name }}
          </template>
          <Combat
            v-bind="{ ...profile }" :distance="distance" :weapon="profile" :unit="unit"
            :modifiers="[...profile.modifiers ?? [], { name: getDetachmentRuleAttackModifier(unit, profile) }].filter(item => item?.name)"
            :abilities="_unit.abilities ?? []" :models="profile.models ?? _unit.models"
            :toughness="target.attributes.toughness"
            :turns="turns" :target="target"
            :order="_order"
            :stratagem="stratagem"
            :selections="selections"
          />
        </Accordion>
      </template>
      <template v-if="weapon.profiles?.length">
        <template v-for="(profile, index) of weapon.profiles" :key="profile.name">
          <Combat
            v-bind="{ ...profile }" :distance="distance" :weapon="profile" :unit="unit"
            :modifiers="[...profile.modifiers ?? [], { name: getDetachmentRuleAttackModifier(unit, profile) }].filter(item => item?.name)"
            :abilities="_unit.abilities ?? []" :models="profile.models ?? _unit.models"
            :toughness="target.attributes.toughness"
            :turns="turns" :target="target"
            :order="_order"
            :stratagem="stratagem"
          />
          <br v-if="index + 1 !== weapon.profiles.length">
        </template>
      </template>
    </section>
  </div>
</template>
