<script setup>
const attackerId = ref('sentinel')
const { data: attacker, refresh } = await useAsyncData('home', () => queryContent('lists/damien', attackerId.value).findOne())

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

    <section>
      <table>
        <thead>
          <th class="p-1">
            <label class="font-bold">Attacker Unit</label>
          </th>
        </thead>
        <tbody>
          <tr>
            <td class="p-1">
              <select v-model="attackerId" class="select w-250px" name="attacker" @change="refresh">
                <option value="sentinel">
                  Sentinel
                </option>
                <option value="hydra">
                  Hydra
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

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
            v-bind="{ ...attacker.attributes, ...attacker.weapons[0] }"
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

      <div
        v-for="weapon of attacker.weapons"
        :key="weapon.name"
        class="my-5"
      >
        <Combat
          v-bind="{ ...weapon }"
          :modifiers="[...weapon.modifiers ?? [], { name: 'LETHAL HITS' }]"
          :abilities="attacker.abilities"
          :models="attacker.models"
          :toughness="toughness"
          :save="invulnerable"
          :pain="pain"
        />
      </div>
    </section>
  </div>
</template>
