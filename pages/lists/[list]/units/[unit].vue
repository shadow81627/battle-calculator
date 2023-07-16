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
          <table class="w-full">
            <thead>
              <th class="p-2">#</th>
              <th class="p-2 text-left">Weapon</th>
              <th class="p-2">Range</th>
              <th class="p-2">A</th>
              <th class="p-2">WS</th>
              <th class="p-2">S</th>
              <th class="p-2">AP</th>
              <th class="p-2">D</th>
            </thead>
            <tbody>
              <tr v-for="weapon of unit.weapons" :key="weapon.name" xclass="border-b-2 border-dashed">
                <td class="p-2 text-center">{{ weapon.models ?? unit.models }}</td>
                <td class="p-2">{{ weapon.name }}</td>
                <td class="p-2 text-center">{{ weapon.range }}</td>
                <td class="p-2 text-center">{{ weapon.attack }}</td>
                <td class="p-2 text-center">{{ weapon.accuracy }}</td>
                <td class="p-2 text-center">{{ weapon.strength }}</td>
                <td class="p-2 text-center">{{ weapon.piercing }}</td>
                <td class="p-2 text-center">{{ weapon.damage }}</td>
              </tr>
            </tbody>
          </table>
          <div v-for="enhancement of (unit.enhancements ?? [])" :key="enhancement.name">
            <span>&nbsp;&nbsp;•&nbsp;</span>Enhancement:
            {{ enhancement.name }} ({{ enhancement.points }})
          </div>
          <div v-for="member of unit.members" :key="member.name">
            <span>&nbsp;&nbsp;•&nbsp;</span>
            {{ member.name }}
            <div v-for="weapon of member.weapons" :key="weapon.name">
              <span>&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;</span>
              <span>{{ weapon.models ?? member.models ?? unit.models }}x&nbsp;</span>
              <span>{{ weapon.name }}</span>
            </div>
          </div>
          <br>
        </section>
      </div>
    </div>
  </div>
</template>
