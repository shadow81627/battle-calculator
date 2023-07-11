<script setup>
import occurrences from '~/utils/occurrences'

const props = defineProps({
  strength: { type: Number },
  toughness: { type: Number },
  attack: { type: [Number, String] },
  save: { type: Number },
  accuracy: { type: Number },
  piercing: { type: Number },
  damage: { type: Number },
  pain: { type: Number },
  models: { type: Number, default: 1 },
  name: { type: String },
  turns: { type: Number },
  modifiers: { type: Array, default: () => [] },
  abilities: { type: Array, default: () => [] },
  target: { type: Object },
})

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
  roll(sides = 6) {
    return Math.floor(Math.random() * sides) + 1
  },
  attack(x) {
    return ((6 - x) + 1) / 6
  },
  defend(x) {
    return (x - 1) / 6
  },
}

function rolls(x = 1, sides = 6) {
  return [...Array(x)].map(() => dice.roll(sides))
}

const maxTurns = computed(() => props.modifiers.find(modifier => modifier.name === 'ONE SHOT') ? 1 : 5)
const minTurns = computed(() => Math.min(props.turns, maxTurns.value))
const hasLethalHits = computed(() => props.modifiers?.find(modifier => modifier.name === 'LETHAL HITS'))
const hasDaringRecon = computed(() => props.abilities.find(ability => ability.name === 'Daring Recon'))
const hasBringersOfChange = computed(() => props.abilities.find(ability => ability.name === 'Bringers of Change'))
const hasTwinLinked = computed(() => props.modifiers?.find(modifier => modifier.name === 'TWIN-LINKED'))
const hasBlast = computed(() => props.modifiers?.find(modifier => modifier.name === 'BLAST'))
const sustainedHits = computed(() => {
  const modifier = props.modifiers?.find(modifier => modifier.name.startsWith('SUSTAINED HITS'))
  return modifier ? Number(modifier.name.match(/\d+/)[0]) : 0
})
const invulnerable = computed(() => {
  const ability = props.target.abilities?.find(ability => ability.name.startsWith('Invulnerable Save'))
  return ability ? Number(ability.name.match(/\d+/)[0]) : 6
})
const heavy = computed(() => props.modifiers?.find(modifier => modifier.name === 'HEAVY') ? 1 : 0)
const blast = computed(() => hasBlast.value ? Math.floor(props.target.models / 5) : 0)

function paseRolls(roll) {
  const base = Number(String(roll).match(/\+(\d+)/)?.[1] ?? (typeof roll === 'number' ? roll : 0))
  const rollType = Number(String(roll).match(/D(\d+)/)?.[1])
  const rolls = Number(String(roll).match(/(\d+)D/)?.[1] ?? (rollType ? 1 : 0))
  return { rolls, base, rollType: rollType ?? 6 }
}

const _save = computed(() => Math.min(props.save + props.piercing, 6, invulnerable.value))
const _attack = computed(() => {
  return paseRolls(props.attack)
})
const randomAttackRolls = computed(() => rolls(_attack.value.rolls, _attack.value.rollType))
const randomAttacksTotal = computed(() => {
  const randomAttacksTotal = randomAttackRolls.value.reduce((sum, roll) => sum + roll, 0)
  const randomAttacksTotalBonuses = randomAttacksTotal + _attack.value.base + blast.value
  return randomAttacksTotalBonuses * minTurns.value * props.models
})
const randomHitRolls = computed(() => rolls(randomAttacksTotal.value))
const randomHitReRolls = computed(() => hasDaringRecon.value ? rolls(occurrences(randomHitRolls.value)[1]) : [])
const sustainedHitsRolls = computed(() => sustainedHits.value ? rolls(sustainedHits.value * occurrences(randomHitRolls.value)[6]) : [])
const randomHitTotal = computed(() => [...randomHitRolls.value, ...randomHitReRolls.value, ...sustainedHitsRolls.value].reduce((sum, roll) => sum + (roll >= (props.accuracy - heavy.value)), 0))

const lethalHits = computed(() => hasLethalHits.value ? occurrences(randomHitRolls.value)[6] : 0)
const randomWoundRolls = computed(() => rolls(randomHitTotal.value - lethalHits.value))
const failedWoundRolls = computed(() => randomWoundRolls.value.reduce((sum, roll) => sum + (roll < wound.value), 0))
const hasWoundReRolls = computed(() => hasTwinLinked.value || hasBringersOfChange.value)
const randomWoundReRolls = computed(() => hasWoundReRolls.value ? rolls(failedWoundRolls.value) : [])
const randomWoundTotal = computed(() => [...randomWoundRolls.value, ...randomWoundReRolls.value].reduce((sum, roll) => sum + (roll >= wound.value), 0) + lethalHits.value)

const hasDevastatingWounds = computed(() => props.modifiers?.find(modifier => modifier.name === 'DEVASTATING WOUNDS'))
const randomDevastatingWounds = computed(() => hasDevastatingWounds.value ? occurrences([...randomWoundRolls.value, ...randomWoundReRolls.value])[6] : 0)
const randomSaveRolls = computed(() => rolls(randomWoundTotal.value - randomDevastatingWounds.value))
const randomSaveTotal = computed(() => randomSaveRolls.value.reduce((sum, roll) => sum + (roll < _save.value), 0) + randomDevastatingWounds.value)

const _damage = computed(() => paseRolls(props.damage))
const randomDamageRolls = computed(() => rolls(randomSaveTotal.value * _damage.value.rolls, _damage.value.rollType))
const randomDamageTotal = computed(() => {
  const total = randomDamageRolls.value.reduce((sum, roll) => sum + roll, 0)
  if (_damage.value.rolls && !total)
    return 0
  if (!_damage.value.rolls)
    return randomSaveTotal.value * _damage.value.base
  return total + _damage.value.base
})

const randomPainRolls = computed(() => rolls(randomDamageTotal.value))
const randomPainTotal = computed(() => randomDamageTotal.value - randomPainRolls.value.reduce((sum, roll) => sum + (roll >= props.pain), 0))

const attacksTotal = computed(() => (((Math.floor(_attack.value.rolls * 3) + _attack.value.base) + blast.value) * minTurns.value * props.models))
const hitTotal = computed(() => Math.floor(attacksTotal.value * dice.attack(props.accuracy - heavy.value)))
const woundTotal = computed(() => Math.floor(hitTotal.value * dice.attack(wound.value)))
const saveTotal = computed(() => Math.floor(woundTotal.value * dice.defend(_save.value)))
const damageTotal = computed(() => Math.floor(saveTotal.value * (Math.floor(_damage.value.rolls * 3) + _damage.value.base)))
const painTotal = computed(() => Math.floor(damageTotal.value * dice.defend(props.pain)))
</script>

<template>
  <p class="text-left">
    <span>{{ name }}</span>

    <template v-if="modifiers && modifiers.length">
      [<span v-for="(modifier, index) of modifiers" :key="modifier.name">{{ modifier.name }}<template v-if="index + 1 !== modifiers.length">, </template>
      </span>]
    </template>
  </p>

  <div style="overflow-x:auto;" class="text-center">
    <table>
      <thead>
        <th class="p-1 text-left">
          Row type
        </th>
        <th class="p-1">
          Attacks
        </th>
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
        <th v-if="pain" class="p-1">
          Feel no pain
        </th>
      </thead>
      <tbody>
        <tr>
          <td class="p-1 text-left">
            Stats
          </td>
          <td class="p-1">
            {{ attack }} x {{ models }} models
          </td>
          <td class="p-1">
            {{ accuracy }}+
          </td>
          <td class="p-1">
            S{{ strength }}
            T{{ toughness }}
            =
            {{ wound }}+
          </td>
          <td class="p-1">
            <template v-if="(save + piercing) > invulnerable && invulnerable < 6">
              Invulnerable {{ invulnerable }}+
            </template>
            <div v-if="piercing">
              SV{{ save }} AP-{{ piercing }} = {{ Math.min(save + piercing, 6) }}+
            </div>
            <template v-else>
              {{ _save }}+
            </template>
          </td>
          <td class="p-1">
            {{ damage }}
          </td>
          <td v-if="pain" class="p-1">
            {{ pain }}+
          </td>
        </tr>
        <tr>
          <td class="p-1 text-left">
            Random
          </td>
          <td class="p-1">
            <DisplayRolls v-if="randomAttackRolls && randomAttackRolls.length" :rolls="randomAttackRolls" />
            <template v-else>
              {{ randomAttacksTotal }}
            </template>
          </td>
          <td class="p-1">
            <DisplayRolls :rolls="randomHitRolls" />
            <template v-if="sustainedHitsRolls && sustainedHitsRolls.length">
              Sustained Hits {{ sustainedHits }}
              <DisplayRolls :rolls="sustainedHitsRolls" />
            </template>
          </td>
          <td class="p-1">
            <DisplayRolls :rolls="randomWoundRolls" />
          </td>
          <td class="p-1">
            <DisplayRolls :rolls="randomSaveRolls" />
          </td>
          <td class="p-1">
            <template v-if="randomDamageRolls && randomDamageRolls.length">
              <DisplayRolls :rolls="randomDamageRolls" />
            </template>
            <template v-else>
              {{ randomSaveTotal }} x {{ damage }}
            </template>
          </td>
          <td v-if="pain" class="p-1">
            <DisplayRolls :rolls="randomPainRolls" />
          </td>
        </tr>
        <tr v-show="hasDaringRecon || hasWoundReRolls">
          <td class="p-1 text-left">
            Re-rolls
          </td>
          <td class="p-1">
            <!-- Attacks Re-rolls -->
          </td>
          <td class="p-1 text-left">
            <DisplayRolls v-if="hasDaringRecon" :rolls="randomHitReRolls" />
            <template v-else>
&nbsp;
            </template>
          </td>
          <td class="p-1 text-left">
            <DisplayRolls v-if="hasWoundReRolls" :rolls="randomWoundReRolls" />
            <template v-else>
&nbsp;
            </template>
          </td>
        </tr>
        <tr>
          <td class="p-1 text-left">
            Totals
          </td>
          <td class="p-1">
            {{ randomAttacksTotal - blast }}
            <template v-if="blast">
              +
            </template>
            <template v-if="blast">
              {{ blast }} Blast
            </template>
          </td>
          <td class="p-1">
            {{ randomHitTotal }}
          </td>
          <td class="p-1">
            <template v-if="randomWoundTotal - lethalHits || !lethalHits">
              {{ randomWoundTotal - lethalHits }}
            </template>
            <template v-if="randomWoundTotal - lethalHits && lethalHits">
              +
            </template>
            <template v-if="lethalHits">
              {{ lethalHits }} Lethal Hit(s)
            </template>
          </td>
          <td class="p-1">
            <template v-if="randomSaveTotal - randomDevastatingWounds || !randomDevastatingWounds">
              {{ randomSaveTotal - randomDevastatingWounds }}
            </template>
            <template v-if="randomSaveTotal - randomDevastatingWounds && randomDevastatingWounds">
              +
            </template>
            <template v-if="randomDevastatingWounds">
              {{ randomDevastatingWounds }} Devastating Wound(s)
            </template>
          </td>
          <td class="p-1">
            {{ randomDamageTotal }}
          </td>
          <td v-if="pain" class="p-1">
            {{ randomPainTotal }}
          </td>
        </tr>
        <tr>
          <td class="p-1 text-left">
            Average
          </td>
          <td class="p-1">
            {{ attacksTotal }}
          </td>
          <td class="p-1">
            {{ hitTotal }}
          </td>
          <td class="p-1">
            {{ woundTotal }}
          </td>
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
  </div>
</template>
