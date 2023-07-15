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
    <section class="md:max-w-50%">
      <Attributes :attributes="unit.attributes"
      :additions="{
        invulnerable: getAbilityValue(unit, 'INVULNERABLE SAVE') || undefined,
        pain: getAbilityValue(unit, 'Feel No Pain') || undefined
      }"
      />
    </section>
    <!-- <p class="text-left capitalize">
      {{ params.list }}'s List
    </p> -->
    <section class="my-5">
      <div>
        ({{ unit.points }}) Points
      </div>
      <div v-for="weapon of unit.weapons" :key="weapon.name">
        <span>&nbsp;&nbsp;•&nbsp;</span>
        <span>{{ weapon.models ?? unit.models }}x&nbsp;</span>
        <span>{{ weapon.name }}</span>
      </div>
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
</template>
