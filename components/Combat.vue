<script setup>
import occurrences from '~/utils/occurrences'

const props = defineProps({
  strength: { type: Number },
  toughness: { type: Number },
  attack: { type: [String, Number] },
  save: { type: Number },
  accuracy: { type: Number },
  piercing: { type: Number },
  damage: { type: [String, Number] },
  pain: { type: Number },
  models: { type: Number, default: 1 },
  name: { type: String },
  turns: { type: Number },
  modifiers: { type: Array, default: () => [] },
  abilities: { type: Array, default: () => [] },
  target: { type: Object },
  order: { type: String },
  range: { type: Number },
  distance: { type: Number },
})

const wound = computed(() => {
  if (props.strength === props.toughness) return 4
  if (props.strength >= (props.toughness * 2)) return 2
  if (props.strength > props.toughness) return 3
  if (props.strength <= (props.toughness / 2)) return 6
  if (props.strength < props.toughness) return 5
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
const hasTorrent = computed(() => props.modifiers?.find(modifier => modifier.name === 'TORRENT'))
const hasLethalHits = computed(() => props.modifiers?.find(modifier => modifier.name === 'LETHAL HITS') && !hasTorrent.value)
const hasDaringRecon = computed(() => props.abilities.find(ability => ability.name === 'Daring Recon'))
const hasBringersOfChange = computed(() => props.abilities.find(ability => ability.name === 'Bringers of Change'))
const hasTankKiller = computed(() => props.abilities.find(ability => ability.name === 'Tank-killer') && props.target.keywords?.find(item => ['VEHICLE', 'MONSTER'].includes(item.toUpperCase())))
const hasTwinLinked = computed(() => props.modifiers?.find(modifier => modifier.name === 'TWIN-LINKED'))
const hasBlast = computed(() => props.modifiers?.find(modifier => modifier.name === 'BLAST'))
const anti = computed(() => {
  const modifiers = props.modifiers?.find(modifier => {
    const isAnti = modifier.name.startsWith('ANTI')
    const hasKeyword = props.target?.keywords?.some((keyword) => modifier.name.includes(keyword.toUpperCase()))
    return isAnti && hasKeyword
  })
  if (modifiers?.name) return Number(modifiers?.name.match(/\d+/)[0])
})
const rapidFire = computed(() => {
  const modifier = props.modifiers?.find(modifier => modifier.name.startsWith('RAPID FIRE'))
  if (!modifier) return 0
  const inRange = ((props.range / 2) >= props.distance)
  return modifier && inRange ? Number(modifier.name.match(/\d+/)[0]) : 0
})
const sustainedHits = computed(() => {
  const modifier = props.modifiers?.find(modifier => modifier.name.startsWith('SUSTAINED HITS'))
  return modifier ? Number(modifier.name.match(/\d+/)[0]) : 0
})
const invulnerable = computed(() => {
  const ability = props.target.abilities?.find(ability => ability.name.startsWith('Invulnerable Save'))
  return ability ? Number(ability.name.match(/\d+/)[0]) : 7
})
const heavy = computed(() => props.modifiers?.find(modifier => modifier.name === 'HEAVY') ? 1 : 0)
const blast = computed(() => hasBlast.value ? Math.floor(props.target.models / 5) : 0)

function paseRolls(roll) {
  const base = Number(String(roll).match(/\+(\d+)/)?.[1] ?? (typeof roll === 'number' ? roll : 0))
  const rollType = Number(String(roll).match(/D(\d+)/)?.[1])
  const rolls = Number(String(roll).match(/(\d+)D/)?.[1] ?? (rollType ? 1 : 0))
  return { rolls, base, rollType: rollType ?? 6 }
}

const _save = computed(() => Math.min(props.save + props.piercing, invulnerable.value))
const _attack = computed(() => {
  return paseRolls(props.attack)
})
const randomAttackRolls = computed(() => rolls(_attack.value.rolls * minTurns.value * props.models, _attack.value.rollType))
const randomAttacksTotal = computed(() => {
  const randomAttacksTotal = randomAttackRolls.value.reduce((sum, roll) => sum + roll, 0)
  const randomAttacksTotalBonuses = (_attack.value.base + blast.value + rapidFire.value) * minTurns.value * props.models
  return randomAttacksTotal + randomAttacksTotalBonuses
})
const attacksTotal = computed(() => (((Math.floor(_attack.value.rolls * (_attack.value.rollType / 2)) + _attack.value.base) + blast.value + rapidFire.value) * minTurns.value * props.models))

const takeAim = computed(() => props.order === 'take-aim' ? 1 : 0)
const randomHitRolls = computed(() => rolls(randomAttacksTotal.value))
const randomHitReRolls = computed(() => hasDaringRecon.value ? rolls(occurrences(randomHitRolls.value)[1]) : [])
const sustainedHitsRolls = computed(() => sustainedHits.value ? rolls(sustainedHits.value * occurrences(randomHitRolls.value)[6]) : [])
const randomHitTotal = computed(() => hasTorrent.value ? randomAttacksTotal.value : [...randomHitRolls.value, ...randomHitReRolls.value, ...sustainedHitsRolls.value].reduce((sum, roll) => sum + (roll >= ((props.accuracy - heavy.value) - takeAim.value)), 0))
const averageHitTotal = computed(() => hasTorrent.value ? attacksTotal.value : Math.floor(attacksTotal.value * dice.attack((props.accuracy - heavy.value) - takeAim.value)))

const lethalHits = computed(() => hasLethalHits.value ? occurrences(randomHitRolls.value)[6] : 0)
const randomWoundRolls = computed(() => rolls(randomHitTotal.value - lethalHits.value))
const criticalWoundRolls = computed(() => {
  if (!anti.value) return 0
  const criticalWoundRollsEntries = Object.entries(occurrences(randomWoundRolls.value))
  return criticalWoundRollsEntries.reduce((sum, [key, value]) => (key >= anti.value ? sum + value : sum), 0)
})
const failedWoundRolls = computed(() => {
  const pass = anti.value && (anti.value < wound.value) ? anti.value : wound.value
  return randomWoundRolls.value.reduce((sum, roll) => sum + (roll < pass), 0)
})
const hasWoundReRolls = computed(() => hasTwinLinked.value || hasBringersOfChange.value || hasTankKiller.value)
const randomWoundReRolls = computed(() => hasWoundReRolls.value ? rolls(failedWoundRolls.value) : [])
const randomWoundTotal = computed(() => {
  const rolled = [...randomWoundReRolls.value];
  const pass = anti.value && (anti.value < wound.value) ? anti.value : wound.value
  if (!anti.value || anti.value > wound.value) {
    rolled.push(...randomWoundRolls.value)
  }
  return rolled.reduce((sum, roll) => sum + (roll >= pass), 0) + lethalHits.value + criticalWoundRolls.value
})

const hasDevastatingWounds = computed(() => props.modifiers?.find(modifier => modifier.name === 'DEVASTATING WOUNDS'))
const randomDevastatingWounds = computed(() => hasDevastatingWounds.value ? occurrences([...randomWoundRolls.value, ...randomWoundReRolls.value])[6] : 0)
const randomSaveRolls = computed(() => {
  const count = randomWoundTotal.value - randomDevastatingWounds.value;
  if (count < 1) return []
  return rolls(count)
})
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

const woundTotal = computed(() => {
  const pass = anti.value && (anti.value < wound.value) ? anti.value : wound.value
  return Math.floor(averageHitTotal.value * dice.attack(pass))
})
const saveTotal = computed(() => Math.floor(woundTotal.value * dice.defend(_save.value)))
const damageTotal = computed(() => Math.floor(saveTotal.value * (Math.floor(_damage.value.rolls * 3) + _damage.value.base)))
const painTotal = computed(() => Math.floor(damageTotal.value * dice.defend(props.pain)))
</script>

<template>
  <p class="text-left">
    <span>{{ name }}</span>

    <template v-if="modifiers && modifiers.length">
      [<span v-for="(modifier, index) of modifiers" :key="modifier.name"><span :class="{
        'text-red-500': (rapidFire && modifier.name.startsWith('RAPID FIRE')) || (anti && modifier.name.startsWith('ANTI')),
        'text-gray-500': !hasLethalHits && modifier.name.startsWith('LETHAL HITS')
      }">{{
  modifier.name
}}</span><template v-if="index + 1 !== modifiers.length">, </template>
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
            {{ attack }}
            <template v-if="rapidFire">
              +
            </template>
            <template v-if="rapidFire">
              {{ rapidFire }} Rapid Fire
            </template>
            <template v-if="blast">
              +
            </template>
            <template v-if="blast">
              {{ blast }} Blast
            </template>
            x {{ models }} models
          </td>
          <td class="p-1">
            <template v-if="hasTorrent">N/A</template>
            <template v-else>{{ accuracy - takeAim }}+</template>
          </td>
          <td class="p-1">
            <template v-if="anti && anti <= wound">{{ anti }}+ Critical</template>
            <template v-else>
              S{{ strength }}
              T{{ toughness }}
              =
              {{ wound }}+
          </template>
          </td>
          <td class="p-1">
            <template v-if="(save + piercing) > invulnerable && invulnerable < 7">
              Invulnerable {{ invulnerable }}+
            </template>
            <div v-else>
              SV{{ save }} AP-{{ piercing }} = {{ save + piercing }}+
            </div>
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
            <template v-if="hasTorrent">N/A</template>
            <template v-else>
              <DisplayRolls :rolls="randomHitRolls" />
              <template v-if="sustainedHitsRolls && sustainedHitsRolls.length">
                Sustained Hits {{ sustainedHits }}
                <DisplayRolls :rolls="sustainedHitsRolls" />
              </template>
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
            {{ randomAttacksTotal }}
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
            {{ averageHitTotal }}
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
