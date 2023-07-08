<script setup>
const strength = ref(12)

const attack = ref(18)
const accuracy = ref(3)
const piercing = ref(2)
const damage = ref(4)

const toughness = ref(10)
const wound = ref(13)
const save = ref(4)
const invulnerable = ref(5)
const pain = ref(5)
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
            <p>3x 3 Rapier Lasers (90pts) + Lord Solar Leontus (125pts)</p>
            <p>
              Total Points {{ (3 * 90) + 125 }}pts
            </p>
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
          <p class="text-left">
            Take aim improves accuracy from 5+ to 4+, then heavy improves the accuracy to 3+.
          </p>
        </div>
        <div class="col-6">
          <div class="text-left">
            <h2 class="h2">
              Defender Statistics
            </h2>
            <p>1 Mutalith Vortex Beast</p>
            <p>
              Total Points {{ 145 }}pts
            </p>
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
      <Attack
        :strength="strength"
        :toughness="toughness"
        :attack="attack"
        :accuracy="accuracy"
        :save="invulnerable"
        :damage="damage"
        :pain="pain"
      />
    </section>
  </div>
</template>
