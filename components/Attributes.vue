<script setup>
const props = defineProps({
  strength: { type: Number },
  toughness: { type: Number },
  attack: { type: Number },
  save: { type: Number },
  wound: { type: Number },
  accuracy: { type: Number },
  piercing: { type: Number },
  damage: { type: Number },
  invulnerable: { type: Number },
  pain: { type: Number },
})
defineEmits([
  'update:strength',
  'update:toughness',
  'update:attack',
  'update:accuracy',
  'update:save',
  'update:piercing',
  'update:damage',
  'update:wound',
  'update:invulnerable',
  'update:pain',
])
</script>

<template>
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
          <input :value="attack" class="input" name="attack" @input="$emit('update:attack', $event.target.value)">
        </td>
        <td>
          <input :value="accuracy" class="input" name="accuracy" @input="$emit('update:accuracy', $event.target.value)">
        </td>
        <td>
          <input :value="strength" class="input" name="strength" @input="$emit('update:strength', $event.target.value)">
        </td>
        <td>
          <input :value="piercing" class="input" name="piercing" @input="$emit('update:piercing', $event.target.value)">
        </td>
        <td>
          <input :value="damage" class="input" name="damage" @input="$emit('update:damage', $event.target.value)">
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
          Save Value
        </th>
        <th>
          Wounds
        </th>
        <th>
          Invulnerable Save
        </th>
        <th>
          Feel no Pain
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input :value="toughness" class="input" name="toughness" @input="$emit('update:toughness', $event.target.value)">
        </td>
        <td>
          <input :value="save" class="input" name="save" @input="$emit('update:save', $event.target.value)">
        </td>
        <td>
          <input :value="wound" class="input" name="wound" @input="$emit('update:wound', $event.target.value)">
        </td>
        <td>
          <input :value="invulnerable" class="input" name="invulnerable" @input="$emit('update:invulnerable', $event.target.value)">
        </td>
        <td>
          <input :value="pain" class="input" name="pain" @input="$emit('update:pain', $event.target.value)">
        </td>
      </tr>
    </tbody>
  </table>
</template>
