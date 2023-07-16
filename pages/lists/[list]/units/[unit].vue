<script setup>
const { params } = useRoute()
const { data: unit, pending } = await useAsyncData(`lists:${params.list}:${params.unit}`, () => queryContent('lists', params.list, params.unit).findOne())
if (!unit.value)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
</script>

<template>
  <div class="m-10">
    <h1 class="text-left uppercase font-barlow text-4xl font-700">
      {{ unit.name }}
    </h1>
    <div class="container">
      <div class="row">
        <section class="md:col-6 col">
          <Attributes :attributes="unit.attributes" :additions="{
            invulnerable: getAbilityValue(unit, 'INVULNERABLE SAVE'),
            pain: getAbilityValue(unit, 'Feel No Pain'),
            points: unit.points
          }" />
        </section>
      </div>
      <div class="row">
        <section class="my-5 md:col-6 col" style="overflow-x:auto;">
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
      </div>
    </div>
  </div>
</template>
