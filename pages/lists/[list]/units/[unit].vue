<script setup>
const { params } = useRoute()
const { data: unit, pending } = await useAsyncData(`lists:${params.list}:${params.unit}`, () => queryContent('lists', params.list, params.unit).findOne())
if (!unit.value)
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
</script>

<template>
  <div class="sm:m-10 m-5">
    <h1 class="text-left font-barlow text-4xl font-700 uppercase">
      {{ unit.name }}
    </h1>
    <div class="container">
      <div class="row">
        <section class="!print:col col md:col-6">
          <Attributes
            :unit="unit" :additions="{
              invulnerable: getAbilityValue(unit, 'INVULNERABLE SAVE'),
              pain: getAbilityValue(unit, 'Feel No Pain'),
              points: unit.points,
              models: unit.models,
            }"
          />
        </section>
      </div>
      <div class="row">
        <section class="my-5 !print:col col md:w-8/12" style="overflow-x:auto;">
          <WeaponAttributes v-if="unit.weapons?.length" :unit="unit" class="w-full" />
          <div v-for="enhancement of (unit.enhancements ?? [])" :key="enhancement.name">
            Enhancement:
            {{ enhancement.name }} ({{ enhancement.points }})
          </div>
          <div v-for="member of unit.members" :key="member.name">
            <div class="text-left font-barlow font-700">
              <span v-if="member.models">{{ member.models }}x </span>
              <span class="uppercase">{{ member.name }}</span>
            </div>
            <WeaponAttributes :unit="member" class="w-full" />
          </div>
          <br>
        </section>
      </div>
      <div v-if="unit.keywords" class="row">
        <section class="!print:col col md:col-6">
          <div class="text-xl">
            <span v-for="(keyword, index) of unit.keywords" :key="keyword">
              {{ keyword }}<span v-if="index + 1 !== unit.keywords.length">, </span>
            </span>
          </div>
        </section>
      </div>
      <div v-if="unit.dataSheetUrl" class="row">
        <section class="col md:col-6">
          <a :href="unit.dataSheetUrl" target="_blank">
            Data sheet page {{ unit.dataSheetUrl.match(/page=(\d*)/)[1] }}
          </a>
        </section>
      </div>
    </div>
  </div>
</template>
