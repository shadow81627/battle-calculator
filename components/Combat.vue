<script setup>
const props = defineProps({
  strength: { type: Number },
  toughness: { type: Number },
  attack: { type: Number },
  save: { type: Number },
  accuracy: { type: Number },
  piercing: { type: Number },
  damage: { type: Number },
  pain: { type: Number },
})

const turns = ref(1)

const wound = computed(() => {
  if (props.strength === props.toughness)
    return 4
  if (props.strength > props.toughness) {
    if (props.strength > props.toughness * 2)
      return 2

    return 3
  }
  if (props.strength < props.toughness) {
    if (props.strength < props.toughness / 2)
      return 6

    return 5
  }
})

const dice = {
  sides: 6,
  roll() {
    return Math.floor(Math.random() * this.sides) + 1
  },
  attack(x) {
    return ((6 - x) + 1) / 6
  },
  defend(x) {
    return (x - 1) / 6
  },
}

function rolls(x = 1) {
  return [...Array(x)].map(() => dice.roll())
}

const randomHitRolls = computed(() => rolls(props.attack * turns.value))
const randomHitTotal = computed(() => randomHitRolls.value.reduce((sum, roll) => sum + (roll >= props.accuracy), 0))

const randomWoundRolls = computed(() => rolls(randomHitTotal.value))
const randomWoundTotal = computed(() => randomWoundRolls.value.reduce((sum, roll) => sum + (roll >= wound.value), 0))

const randomSaveRolls = computed(() => rolls(randomWoundTotal.value))
const randomSaveTotal = computed(() => randomSaveRolls.value.reduce((sum, roll) => sum + (roll < props.save), 0))

// const randomDamageRolls = rolls(randomSaveTotal)
// const randomDamageTotal = randomDamageRolls.reduce((sum, roll) => sum + (roll >= props.save), 0)

const hitTotal = computed(() => Math.floor((props.attack * turns.value) * dice.attack(props.accuracy)))
const woundTotal = computed(() => Math.floor(hitTotal.value * dice.attack(wound.value)))
const saveTotal = computed(() => Math.floor(woundTotal.value * dice.defend(props.save)))
const damageTotal = computed(() => Math.floor(saveTotal.value * props.damage))
const painTotal = computed(() => Math.floor(damageTotal.value * dice.defend(props.pain)))
</script>

<template>
  <table>
    <tbody>
      <tr>
        <td class="p-1">
          <label class="font-bold">Turns</label>
        </td>
        <td class="p-1">
          <input v-model="turns" name="turns" class="input max-w-250px" type="number" max="5" min="1">
        </td>
      </tr>
    </tbody>
  </table>

  <p class="text-left">
    Random
  </p>
  <table>
    <thead>
      <th class="p-1">
        Hits
      </th>
      <th class="p-1">
        Wounds
      </th>
      <th class="p-1">
        Save
      </th>
      <th class="p-1">
        Damage
      </th>
    </thead>
    <tbody>
      <tr>
        <td class="p-1">
          {{ randomHitRolls }}
        </td>
        <td class="p-1">
          {{ randomWoundRolls }}
        </td>
        <td class="p-1">
          {{ randomSaveRolls }}
        </td>
        <td class="p-1">
          {{ randomSaveTotal }} x {{ damage }}
        </td>
      </tr>
      <tr>
        <td>
          {{ randomHitTotal }}
        </td>
        <td>
          {{ randomWoundTotal }}
        </td>
        <td class="p-1">
          {{ randomSaveTotal }}
        </td>
        <td class="p-1">
          {{ randomSaveTotal * damage }}
        </td>
      </tr>
    </tbody>
  </table>

  <p class="text-left">
    Average
  </p>
  <table>
    <thead>
      <tr>
        <th class="p-1">
          Hits
        </th>
        <th class="p-1">
          Wounds
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="p-1">
          {{ hitTotal }}
        </td>
        <td class="p-1">
          {{ woundTotal }}
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th class="p-1">
          <label>Saves</label>
        </th>
        <th class="p-1">
          <label>Damage</label>
        </th>
        <th class="p-1">
          <label>Feel no Pain</label>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-if="save" class="p-1">
          {{ saveTotal }}
        </td>
        <td v-if="damage" class="p-1">
          {{ damageTotal }}
        </td>
        <td v-if="pain" class="p-1">
          {{ painTotal }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
