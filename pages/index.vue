<script setup>
const attack = ref(18)
const hit = ref(3)
const wound = ref(3)

const save = ref(5)
const damage = ref(4)
const pain = ref(5)

const dice = {
  sides: 6,
  range() {
    const range = new Array(this.sides)
    const probability = (x, i) => (i + 1) / this.sides
    return Array.from(range, probability)
  },
  roll() {
    return Math.floor(Math.random() * this.sides) + 1
  },
  attack(pass) {
    const range = this.range().reverse()
    return range[pass]
  },
  defend(pass) {
    const range = this.range()
    return range[pass]
  },

}

const hitTotal = computed(() => (attack.value || 1) * dice.attack(hit.value || 3))
const woundTotal = computed(() => hitTotal.value * dice.attack(wound.value || 3))

const saveTotal = computed(() => woundTotal.value * dice.defend(save.value || 3))
const damageTotal = computed(() => saveTotal.value * damage.value || 1)
const painTotal = computed(() => damageTotal.value * dice.defend(pain.value))
</script>

<template>
  <div>
    <h1 class="h1 text-left">
      Battle Calculator
    </h1>
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
            <input v-model="wound" class="input">
          </td>
        </tr>
        <tr>
          <td>{{ attack || 1 }}</td>
          <td>
            {{ Math.floor(hitTotal) }}
          </td>
          <td>
            {{ Math.floor(woundTotal) }}
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
          <td>
            {{ Math.floor(saveTotal) }}
          </td>
          <td>
            {{ Math.floor(damageTotal) }}
          </td>
          <td v-if="pain">
            {{ Math.floor(painTotal) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
