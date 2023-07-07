<script setup>
const strength = ref(12)
const toughness = ref(10)

const attack = ref(18)
const hit = ref(3)
const wound = computed(() => {
  if (strength.value === toughness.value)
    return 4
  if (strength.value > toughness.value) {
    if (strength.value > toughness.value * 2)
      return 2

    return 3
  }
  if (strength.value < toughness.value) {
    if (strength.value < toughness.value / 2)
      return 6

    return 5
  }
})

const save = ref(5)
const damage = ref(4)
const pain = ref(5)

const dice = {
  sides: 6,
  attack(x) {
    return ((6 - x) + 1) / 6
  },
  defend(x) {
    return (x - 1) / 6
  },
}

const hitTotal = computed(() => Math.floor((attack.value) * dice.attack(hit.value)))
const woundTotal = computed(() => Math.floor(hitTotal.value * dice.attack(wound.value)))
const saveTotal = computed(() => Math.floor(woundTotal.value * dice.defend(save.value)))
const damageTotal = computed(() => Math.floor(saveTotal.value * damage.value))
const painTotal = computed(() => Math.floor(damageTotal.value * dice.defend(pain.value)))
</script>

<template>
  <table>
    <thead>
      <th>
        <label>Strength</label>
      </th>
      <th>
        <label>Toughness</label>
      </th>
    </thead>
    <tbody>
      <tr>
        <td>
          <input v-model="strength" class="input" name="strength">
        </td>
        <td>
          <input v-model="toughness" class="input" name="toughness">
        </td>
      </tr>
      <tr>
        <td>
          {{ strength }}
        </td>
        <td>
          {{ toughness }}
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th>
          <label>Attacks</label>
        </th>
        <th>
          <label>Hits</label>
        </th>
        <th>
          <label>Wounds</label>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input v-model="attack" class="input">
        </td>
        <td>
          <input v-model="hit" class="input">
        </td>
        <td>
          <input :value="wound" class="input-disabled" readonly disabled>
        </td>
      </tr>
      <tr>
        <td v-if="attack">
          {{ attack }}
        </td>
        <td v-if="hit">
          {{ hitTotal }}
        </td>
        <td v-if="wound">
          {{ woundTotal }}
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th>
          <label>Saves</label>
        </th>
        <th>
          <label>Damage</label>
        </th>
        <th>
          <label>Feel no Pain</label>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input v-model="save" class="input">
        </td>
        <td>
          <input v-model="damage" class="input">
        </td>
        <td>
          <input v-model="pain" class="input">
        </td>
      </tr>
      <tr>
        <td v-if="save">
          {{ saveTotal }}
        </td>
        <td v-if="damage">
          {{ damageTotal }}
        </td>
        <td v-if="pain">
          {{ painTotal }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
