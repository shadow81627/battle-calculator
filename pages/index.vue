<script setup>
const id = 'sentinel'
const { data: attacker } = await useAsyncData('home', () => queryContent('lists/damien', id).findOne())

const weapon = attacker.value.weapons[0]

const attack = ref(3 * weapon.attack)
const accuracy = ref(weapon.accuracy)
const strength = ref(weapon.strength)
const piercing = ref(weapon.piercing)
const damage = ref(weapon.damage)

const toughness = ref(10)
const wound = ref(13)
const save = ref(4)
const invulnerable = ref(5)
const pain = ref(5)

const turns = ref(2)
</script>

<template>
  <div>
    <h1 class="h1 text-left">
      Battle Calculator
    </h1>
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
            v-model:attack="attack"
            v-model:strength="strength"
            v-model:accuracy="accuracy"
            v-model:piercing="piercing"
            v-model:damage="damage"
            :toughness="4"
            :save="4"
            :wound="3"
          />
        </div>
        <div class="col-6">
          <div class="text-left">
            <h2 class="h2">
              Defender Statistics
            </h2>
            <p>1 Mutalith Vortex Beast {{ 145 }}pts</p>
          </div>
          <Attributes
            v-model:wound="wound"
            v-model:toughness="toughness"
            v-model:save="save"
            v-model:invulnerable="invulnerable"
            :strength="9"
            :attack="6"
            :accuracy="3"
            :piercing="2"
            :damage="2"
            :pain="5"
          />
        </div>
      </div>
    </section>

    <section class="my-9">
      <h2 class="h2 text-left">
        Average Attack Rolls
      </h2>
      <table>
        <tbody>
          <tr>
            <td class="p-1">
              <label class="font-bold">Turns</label>
            </td>
            <td class="p-1">
              <input v-model="turns" name="turns" class="input max-w-250px" type="number">
            </td>
          </tr>
        </tbody>
      </table>

      <Combat
        :strength="strength"
        :toughness="toughness"
        :attack="attack * turns"
        :accuracy="accuracy"
        :save="invulnerable"
        :damage="damage"
        :pain="pain"
      />
    </section>
  </div>
</template>
