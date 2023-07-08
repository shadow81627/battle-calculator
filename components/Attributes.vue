<script setup>
const attack = ref(18)
const accuracy = ref(5)
const strength = ref(12)
const piercing = ref(2)
const damage = ref(4)

// const movement = ref(6)
const toughness = ref(4)
const save = ref(4)
const wound = ref(3)
// const control = ref(1)
</script>

<template>
  <h2 class="h2 text-left">
    Attributes
  </h2>
  <table>
    <thead>
      <tr>
        <th>
          Attacks
        </th>
        <th>
          Accuracy
        </th>
        <th>
          Strength
        </th>
        <th>
          Armour Piercing
        </th>
        <th>
          Damage
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input v-model="attack" class="input" name="attack">
        </td>
        <td>
          <input v-model="accuracy" class="input" name="accuracy">
        </td>
        <td>
          <input v-model="strength" class="input" name="strength">
        </td>
        <td>
          <input v-model="piercing" class="input" name="piercing">
        </td>
        <td>
          <input v-model="damage" class="input" name="damage">
        </td>
      </tr>
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        <th>
          Toughness
        </th>
        <th>
          Save
        </th>
        <th>
          Wounds
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input v-model="toughness" class="input" name="toughness">
        </td>
        <td>
          <input v-model="save" class="input" name="save">
        </td>
        <td>
          <input v-model="wound" class="input" name="wound">
        </td>
      </tr>
    </tbody>
  </table>
</template>
