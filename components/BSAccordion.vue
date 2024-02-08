<script setup>
defineProps(['selections'])
</script>

<template>
  <div class="ml-4">
    <Accordion v-for="selection of selections" :key="selection.id">
      <template #header>
        {{ selection.name }} {{ selection.type }}
      </template>
      <div>
        <!-- <div v-if="selection.constraints.length">
          Constraints
          <div v-for="constraint of selection.constraints" :key="constraint.id">
            {{ constraint.type }} {{ constraint.value }}
          </div>
        </div> -->
        <div v-for="cost of selection.costs" :key="cost.id">
          {{ cost.value }} {{ cost.name }}
        </div>
        <Attributes v-for="profile of selection.profiles.filter(profile => profile.W)" :key="profile.name" :unit="{ attributes: { movement: profile.M, toughness: profile.T, save: profile.SV, wound: profile.W, leadership: profile.LD, control: profile.OC } }" />
        <WeaponAttributes v-for="profile of selection.profiles.filter(profile => profile.A)" :key="profile.id" :unit="{ weapons: [{ name: profile.name, range: profile.Range, attack: profile.A, accuracy: profile.WS || profile.BS, strength: profile.S, piercing: profile.AP, damage: profile.D }] }" class="w-full" />
        <div v-if="selection.abilities.length">
          Abilities
          <div v-for="ability of selection.abilities" :key="ability.name" class="border-2 border-solid p-2">
            <strong>{{ ability.name }}</strong>
            <div>
              {{ ability.Description }}
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <section class="!print:col col md:col-6">
          <div class="text-xl">
            <span v-for="(keyword, index) of selection.categories" :key="keyword.id">
              {{ keyword.name }}<span v-if="index + 1 !== selection.categories.length">, </span>
            </span>
          </div>
        </section>
      </div>
      <BSAccordion :selections="selection.children" />
    </Accordion>
  </div>
</template>
