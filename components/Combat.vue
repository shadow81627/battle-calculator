<script setup>
import parseRolls from '~/utils/parseRolls'
import getModifier from '~/utils/getModifier'
import AverageWeaponCombatWorker from '~/assets/workers/averageWeaponCombat?worker'

const props = defineProps({
  strength: { type: Number },
  toughness: { type: Number },
  attack: { type: [String, Number] },
  accuracy: { type: Number },
  piercing: { type: Number },
  damage: { type: [String, Number] },
  models: { type: Number, default: 1 },
  name: { type: String },
  turns: { type: Number, default: 1 },
  modifiers: { type: Array, default: () => [] },
  abilities: { type: Array, default: () => [] },
  target: { type: Object },
  order: { type: String },
  range: { type: [Number, String] },
  distance: { type: Number, default: 24 },
  weapon: { type: Object },
  unit: { type: Object },
  stratagem: { type: String },
  selections: { type: Object },
})

const showRolls = ref(false)
function toggleShowRolls() {
  showRolls.value = !showRolls.value
}

const wound = computed(() => getWound(props.strength, props.toughness))

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

const additional = computed(() => ({
  distance: props.distance,
  order: props.order,
  range: props.range,
  turns: props.turns,
  stratagem: props.stratagem,
  selections: props.selections,
}))

const randomTotals = useState(`randomTotals-${props.weapon.name}`, ()=> computed(()=>weaponCombat(props.weapon, props.unit, props.target, additional.value)))

function averageWeaponCombatWorker() {
  return new Promise((resolve, reject) => {
    if (globalThis.Worker) {
      const worker = new AverageWeaponCombatWorker()
      const data = JSON.parse(JSON.stringify({
        weapon: { ...props.weapon, modifiers: props.modifiers },
        unit: props.unit,
        target: props.target,
        additional: additional.value,
      }))
      worker.postMessage(data)
      worker.addEventListener('message', (e) => {
        if (e.data)
          resolve(e.data)
        worker.terminate()
      }, false)
    }
    else {
      reject(new Error('No Worker'))
    }
  })
}

const averages = computedAsync(async () => {
  return await averageWeaponCombatWorker()
})

const targetIsVehicleOrMonster = computed(() => props.target?.keywords?.some(keyword => ['VEHICLE', 'MONSTER'].includes(keyword.toUpperCase())))

const maxTurns = computed(() => getModifier('ONE SHOT', props.modifiers) ? 1 : 5)
const minTurns = computed(() => Math.min(props.turns, maxTurns.value))
const hasTorrent = computed(() => getModifier('TORRENT', props.modifiers))
const hasLethalHits = computed(() => getModifier('LETHAL HITS', props.modifiers) && !hasTorrent.value)
const hasDaringRecon = computed(() => props.abilities.find(ability => ability.name === 'Daring Recon'))
const hasFlakBattery = computed(() => props.abilities?.find(ability => ability.name === 'Flak Battery') && props.target?.keywords?.some(keyword => keyword.toUpperCase() === 'FLY'))
const hasTankHunter = computed(() => props.abilities?.find(ability => ability.name === 'Tank Hunter') && targetIsVehicleOrMonster.value)
const hasAtraposDuty = computed(() => {
  const ability = props.abilities?.find(ability => ability.name === 'Atrapos’ Duty (Bondsman)')
  const keyword = props.target?.keywords?.find(item => ['TITANIC', 'TOWERING'].includes(item.toUpperCase()))
  return ability && keyword
})
// const hasMacroExtinctionProtocols = computed(() => {
//   const ability = props.abilities?.find(ability => ability.name === 'Macro-extinction Protocols')
//   const keyword = targetIsVehicleOrMonster.value
//   return ability && keyword
// })
const hasBringersOfChange = computed(() => props.abilities.find(ability => ability.name === 'Bringers of Change'))
const hasTankKiller = computed(() => props.abilities.find(ability => ability.name === 'Tank-killer') && targetIsVehicleOrMonster.value)
const hasMobileHunterKillers = computed(() => props.abilities.find(ability => ability.name === 'Mobile Hunter-killers') && targetIsVehicleOrMonster.value)
const hasTwinLinked = computed(() => getModifier('TWIN-LINKED', props.modifiers))
const hasBlast = computed(() => getModifier('BLAST', props.modifiers))
const anti = computed(() => {
  const modifiers = props.modifiers?.find((modifier) => {
    const isAnti = modifier.name.startsWith('ANTI')
    const hasKeyword = props.target?.keywords?.some(keyword => modifier.name.includes(keyword.toUpperCase()))
    return isAnti && hasKeyword
  })
  if (modifiers?.name)
    return Number(modifiers?.name.match(/\d+/)[0])
})
const rapidFire = computed(() => {
  const modifier = getModifier('RAPID FIRE', props.modifiers)
  if (!modifier)
    return 0
  const inRange = ((props.range / 2) >= props.distance)
  return modifier && inRange ? Number(modifier.name.match(/\d+/)[0]) : 0
})
const sustainedHits = computed(() => {
  const modifier = getModifier('SUSTAINED HITS', props.modifiers)
  if (!modifier?.name)
    return 0
  const parsed = parseRolls(modifier.name)
  if (parsed.rolls)
    return ((parsed.rollType + 1) / 2) + parsed.base
  return parsed.base
})
const invulnerable = computed(() => getAbilityValue(props.target, 'INVULNERABLE SAVE') ?? 7)
const pain = computed(() => {
  const shiningAegis = Number(props.target?.abilities?.find(ability => ability.name === 'Shining Aegis')?.effect.match(/\d+/)?.[0])
  return shiningAegis || getAbilityValue(props.target, 'FEEL NO PAIN')
})
const blast = computed(() => hasBlast.value ? Math.floor(props.target.models / 5) : 0)

const save = computed(() => props.target.attributes.save)
const _save = computed(() => randomTotals.value.save)
const _attack = computed(() => randomTotals.value.attack)
const _strength = computed(() => randomTotals.value.strength)
const randomAttackRolls = computed(() => randomTotals.value.randomAttacksRolls)
const randomAttacksTotal = computed(() => randomTotals.value.randomAttacksTotal)
const attacksTotal = computed(() => {
  const diceRollAverage = _attack.value.rolls * (_attack.value.rollType / 2)
  return (diceRollAverage + _attack.value.base + blast.value + rapidFire.value) * minTurns.value * props.models
})

const _accuracy = computed(() => randomTotals.value.accuracy)
const randomHitRolls = computed(() => randomTotals.value.randomHitRolls)
const hasHitReRolls = computed(() => hasDaringRecon.value || hasTankHunter.value || hasAtraposDuty.value || hasFlakBattery.value)
const randomHitReRolls = computed(() => randomTotals.value.randomHitReRolls)
const sustainedHitsTotal = computed(() => randomTotals.value.randomSustainedHitsTotal)
const randomHitTotal = computed(() => randomTotals.value.randomHitTotal)
const averageSustainedHits = computed(() => {
  const criticalValue = 6
  if (sustainedHits.value)
    return (((((6 + (7 - criticalValue)) / 6) * attacksTotal.value) - attacksTotal.value) * sustainedHits.value)

  return 0
})
const averageLethalHits = computed(() => hasLethalHits.value ? attacksTotal.value * (1 / 6) : 0)
const averageHitTotal = computed(() => {
  if (hasTorrent.value)
    return attacksTotal.value
  return ((attacksTotal.value - averageLethalHits.value) + averageSustainedHits.value) * dice.attack(_accuracy.value)
})

const lethalHits = computed(() => randomTotals.value.randomLethalHits)
const randomWoundRolls = computed(() => randomTotals.value.randomWoundRolls)
const hasWoundReRolls = computed(() => hasTwinLinked.value || hasBringersOfChange.value || hasTankKiller.value || hasMobileHunterKillers.value)
const randomWoundReRolls = computed(() => randomTotals.value.randomWoundReRolls)
const randomWoundTotal = computed(() => randomTotals.value.randomWoundTotal)

const randomDevastatingWounds = computed(() => randomTotals.value.randomDevastatingWounds)
const randomSaveRolls = computed(() => randomTotals.value.randomSaveRolls)
const randomSaveTotal = computed(() => randomTotals.value.randomSaveTotal)

const _damage = computed(() => parseRolls(props.damage))
const randomDamageRolls = computed(() => randomTotals.value.randomDamageRolls)
const randomDamageTotal = computed(() => randomTotals.value.randomDamageTotal)

const randomPainRolls = computed(() => randomTotals.value.randomPainRolls)
const randomPainTotal = computed(() => randomTotals.value.randomPainTotal)

const woundTotal = computed(() => {
  const pass = anti.value && (anti.value < wound.value) ? anti.value : wound.value
  return (averageHitTotal.value * dice.attack(pass)) + averageLethalHits.value
})
const saveTotal = computed(() => Math.round(woundTotal.value * dice.defend(_save.value)))
const damageTotal = computed(() => {
  const averageRollType = (_damage.value.rollType / 2)
  const averageRolls = saveTotal.value * ((_damage.value.rolls * averageRollType) + _damage.value.base)
  return averageRolls
})
const painTotal = computed(() => damageTotal.value * dice.defend(pain.value))
</script>

<template>
  <p class="text-left">
    <span>{{ name }}</span>

    <template v-if="modifiers && modifiers.length">
      [<span v-for="(modifier, index) of modifiers" :key="modifier.name"><span
        :class="{
          'text-red-500': (rapidFire && modifier.name.startsWith('RAPID FIRE')) || (anti && modifier.name.startsWith('ANTI')),
          'text-gray-500': !hasLethalHits && modifier.name.startsWith('LETHAL HITS'),
        }"
      >{{
        modifier.name
      }}</span><template v-if="index + 1 !== modifiers.length">, </template>
      </span>]
    </template>
  </p>

  <div style="overflow-x:auto;" class="text-center">
    <table class="w-full">
      <thead>
        <tr>
        <th class="p-1 text-left">
          Name
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
      </tr>
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
            <template v-if="hasTorrent">
              N/A
            </template>
            <template v-else>
              {{ _accuracy }}+
            </template>
          </td>
          <td class="p-1">
            <template v-if="anti && anti <= wound">
              {{ anti }}+ Critical
            </template>
            <template v-else>
              S{{ _strength }}
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
            Calculated
          </td>
          <td class="p-1">
            {{ formatAverage(attacksTotal) }}
          </td>
          <td class="p-1">
            <template v-if="sustainedHitsTotal">
              {{ formatAverage(averageHitTotal - averageSustainedHits) }}
              + {{ formatAverage(averageSustainedHits) }} Sustained Hit(s)
            </template>
            <template v-else>
              {{ formatAverage(averageHitTotal) }}
            </template>
          </td>
          <td class="p-1">
            <template v-if="averageLethalHits">
              {{ formatAverage(woundTotal - averageLethalHits) }}
              + {{ formatAverage(averageLethalHits) }} Lethal Hit(s)
            </template>
            <template v-else>
              {{ formatAverage(woundTotal) }}
            </template>
          </td>
          <td v-if="save" class="p-1">
            {{ formatAverage(saveTotal) }}
          </td>
          <td v-if="damage" class="p-1">
            {{ formatAverage(damageTotal) }}
          </td>
          <td v-if="pain" class="p-1">
            {{ formatAverage(painTotal) }}
          </td>
        </tr>
        <tr>
          <td class="p-1 text-left">
            Simulated
          </td>
          <template v-if="averages">
            <td class="p-1">
              {{ averages.averageAttacksTotal }}
            </td>
            <td class="p-1">
              <template v-if="averages.averageSustainedHitsTotal">
                {{ formatAverage(averages.averageHitTotal - averages.averageSustainedHitsTotal) }}
                + {{ averages.averageSustainedHitsTotal }} Sustained Hit(s)
              </template>
              <template v-else>
                {{ averages.averageHitTotal }}
              </template>
            </td>
            <td class="p-1">
              {{ averages.averageWoundTotal }}
            </td>
            <td v-if="save" class="p-1">
              {{ averages.averageSaveTotal }}
            </td>
            <td v-if="damage" class="p-1">
              {{ averages.averageDamageTotal }}
            </td>
            <td v-if="pain" class="p-1">
              {{ averages.averagePainTotal }}
            </td>
          </template>
        </tr>
        <tr>
          <td class="p-1 text-left" @click="toggleShowRolls">
            <span>Rolls</span>
            <span class="ml-2">
              <svg
                data-accordion-icon :class="{ 'rotate-180': !showRolls }" class="inline h-3 w-3 shrink-0" aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5 5 1 1 5"
                />
              </svg>
            </span>
          </td>
          <td class="p-1">
            {{ randomAttacksTotal }}
          </td>
          <td class="p-1">
            <template v-if="sustainedHitsTotal">
              {{ randomHitTotal - sustainedHitsTotal }}
              + {{ sustainedHitsTotal }} Sustained Hit(s)
            </template>
            <template v-else>
              {{ randomHitTotal }}
            </template>
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
        <tr :class="{ hidden: !showRolls }">
          <td class="p-1 text-left">
            Random
          </td>
          <td class="p-1">
            <DisplayRolls v-if="randomAttackRolls && randomAttackRolls.length" :rolls="randomAttackRolls" class="mx-auto" />
            <template v-else>
              {{ randomAttacksTotal }}
            </template>
          </td>
          <td class="p-1">
            <template v-if="hasTorrent">
              N/A
            </template>
            <template v-else>
              <DisplayRolls :rolls="randomHitRolls" class="mx-auto" />
            </template>
          </td>
          <td class="p-1">
            <DisplayRolls :rolls="randomWoundRolls" class="mx-auto" />
          </td>
          <td class="p-1">
            <DisplayRolls :rolls="randomSaveRolls" :reverse="true" class="mx-auto" />
          </td>
          <td class="p-1">
            <template v-if="randomDamageRolls && randomDamageRolls.length">
              <DisplayRolls :rolls="randomDamageRolls" class="mx-auto" />
            </template>
            <template v-else>
              {{ randomSaveTotal }} x {{ damage }}
            </template>
          </td>
          <td v-if="pain" class="p-1">
            <DisplayRolls :rolls="randomPainRolls" class="mx-auto" />
          </td>
        </tr>
        <tr v-show="showRolls && (hasHitReRolls || hasWoundReRolls)">
          <td class="p-1 text-left">
            Re-rolls
          </td>
          <td class="p-1">
            <!-- Attacks Re-rolls -->
            &nbsp;
          </td>
          <td class="p-1 text-left">
            <DisplayRolls v-if="hasHitReRolls" :rolls="randomHitReRolls" class="mx-auto" />
            <template v-else>
              &nbsp;
            </template>
          </td>
          <td class="p-1 text-left">
            <DisplayRolls v-if="hasWoundReRolls" :rolls="randomWoundReRolls" class="mx-auto" />
            <template v-else>
              &nbsp;
            </template>
          </td>
          <td>
            <!-- Save -->
            &nbsp;
          </td>
          <td>
            <!-- Damage -->
            &nbsp;
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
