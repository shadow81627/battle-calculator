import type CombatModifiers from 'types/CombatModifiers'
import getModifier from './getModifier'
import parseRolls from './parseRolls'
import occurrences from './occurrences'
import getWound from './getWound'
import getAbilityValue from './getAbilityValue'
import type Unit from '~/types/unit'
import type { Weapon } from '~/types/unit'

const dice = {
  roll(sides = 6) {
    return Math.floor(Math.random() * sides) + 1
  },
  attack(x: number) {
    return ((6 - x) + 1) / 6
  },
  defend(x: number) {
    return (x - 1) / 6
  },
  average(sides = 6) {
    return (sides + 1) / 2
  },
}

function rolls(x = 1, sides = 6) {
  return [...Array(x)].map(() => dice.roll(sides))
}

function targetIsVehicleOrMonster(target: Unit) {
  return Boolean(target?.keywords?.some(keyword => ['VEHICLE', 'MONSTER'].includes(keyword.toUpperCase())))
}

function hasFaction(unit: Unit, key: string) {
  return unit?.factions?.find(faction => faction.toUpperCase() === key.toUpperCase())
}

export default function weaponCombat(weapon: Weapon, unit: Unit, target: Unit, additional?: CombatModifiers) {
  const maxTurns = getModifier('ONE SHOT', weapon.modifiers) ? 1 : 5
  const minTurns = Math.min(additional?.turns ?? 1, maxTurns)

  // Attacks
  const attack = (() => {
    const parsed = parseRolls(weapon.attack)
    if (additional?.order === 'WAAAGH!' && weapon.range === 'Melee')
      parsed.base = parsed.base + 1
    return parsed
  })()
  const _range = typeof weapon.range === 'string' ? 1 : weapon.range
  const distance = (additional?.distance ?? 1)
  // const inRange = _range >= distance
  const inRapidFireRange = ((_range / 2) >= distance)
  const rapidFire = (() => {
    const modifier = getModifier('RAPID FIRE', weapon.modifiers)
    if (!modifier || !inRapidFireRange)
      return 0
    return Number(modifier.name.match(/\d+/)?.[0]) ?? 0
  })()
  const blast = getModifier('BLAST', weapon.modifiers) ? Math.floor(target.models / 5) : 0
  const quantity = weapon.models || unit.models || 1
  const randomAttacksTotalBonuses = (attack.base + blast + rapidFire) * quantity * minTurns
  const randomAttackRolls = rolls(attack.rolls * quantity * minTurns, attack.rollType || 6)
  const randomAttackRollsTotal = randomAttackRolls.reduce((sum, roll) => sum + roll, 0)
  const randomAttacksTotal = randomAttackRollsTotal + randomAttacksTotalBonuses

  // Hits
  const _accuracy = (() => {
    const takeAim = (additional?.order === 'take-aim' && weapon.range !== 'Melee') || (additional?.order === 'fix-bayonets' && weapon.range === 'Melee') ? 1 : 0
    const characteristic = weapon.accuracy - takeAim
    const buffs: number[] = []
    const negatives: number[] = []
    if (target.abilities?.find(ability => ability.name === 'Mesmerising Form'))
      negatives.push(1)
    if (getModifier('HEAVY', weapon.modifiers))
      buffs.push(1)

    // if (hasMacroExtinctionProtocols)
    //   buffs.push(1)
    if (
      unit.abilities?.find(ability => ability.name === 'Armour Hunter')
      || (unit.abilities?.find(ability => ability.name === 'Wall of Dakka') && inRapidFireRange)
      || (unit.abilities?.find(ability => ability.name === 'Hogboss') && weapon.range === 'Melee')
    )
      buffs.push(1)

    const buffTotal = buffs[0] ?? 0
    const negativesTotal = negatives.reduce((sum, value) => sum + value, 0)
    return (characteristic - buffTotal) + negativesTotal
  })()
  const randomHitRolls = rolls(randomAttacksTotal)
  const failedHitRolls = randomHitRolls.reduce((sum, roll) => sum + (roll < _accuracy ? 1 : 0), 0)
  const randomHitReRolls = (() => {
    if (unit.abilities?.find(ability => ability.name === 'Daring Recon'))
      return rolls(occurrences(randomHitRolls)[1])
    const hasFullReRolls = unit.abilities?.find(ability => ['Tank Hunter', 'Flak Battery', 'Targeting Array'].includes(ability.name))
    if (hasFullReRolls && failedHitRolls > 0)
      return rolls(failedHitRolls)
    return []
  })()
  const criticalHitRollsTotal = (() => {
    const crit = additional?.stratagem === 'UNBRIDLED CARNAGE' && weapon.range === 'Melee' ? 5 : 6
    const criticalWoundRollsEntries = Object.entries(occurrences([...randomHitRolls, ...randomHitReRolls]))
    return criticalWoundRollsEntries.reduce((sum, [key, value]) => (Number(key) >= crit ? sum + value : sum), 0)
  })()
  const sustainedHits = (() => {
    const modifier = getModifier('SUSTAINED HITS', weapon.modifiers)
    // if (!modifier && (hasFaction(unit, 'Orks') && weapon.range === 'Melee'))
    //   return 1
    if (!modifier?.name)
      return 0
    const parsed = parseRolls(modifier.name)
    if (parsed.rolls)
      return rolls(parsed.rolls, parsed.rollType).reduce((sum, roll) => sum + roll, 0) + parsed.base
    return parsed.base
  })()
  const sustainedHitsTotal = sustainedHits ? sustainedHits * criticalHitRollsTotal : 0
  const hasTorrent = getModifier('TORRENT', weapon.modifiers)
  const randomHitTotal = (() => {
    if (getModifier('TORRENT', weapon.modifiers))
      return randomAttacksTotal
    const rolled = [...randomHitRolls, ...randomHitReRolls]
    return rolled.reduce((sum, roll) => sum + (roll >= _accuracy ? 1 : 0), 0) + sustainedHitsTotal
  })()

  // Wounds
  const hasLethalHits = ((getModifier('LETHAL HITS', weapon.modifiers))
    || (hasFaction(unit, 'ASTRA MILITARUM')
    && weapon.range !== 'Melee'
  && !unit.keywords?.find(item => item.toUpperCase() === 'AIRCRAFT'))) && !hasTorrent
  const lethalHits = hasLethalHits ? occurrences(randomHitRolls)[6] : 0
  const randomWoundRolls = rolls(randomHitTotal - lethalHits)
  const strength = (function () {
    const buffs = []
    if (additional?.order === 'WAAAGH!' && additional?.range === 1)
      buffs.push(1)
    if (unit.enhancements?.find(enhancement => enhancement.name === 'The Everstave') && weapon.range !== 'Melee')
      buffs.push(2)
    if (unit?.abilities?.find(ability => ability.name === 'Daemon Lord of Tzeentch (Aura)'))
      buffs.push(1)
    return buffs.reduce((sum, value) => sum + value, 0) + Number(weapon.strength)
  }())
  const wound = getWound(strength, target.attributes.toughness)
  const anti = (() => {
    const modifiers = weapon.modifiers?.find((modifier) => {
      const isAnti = modifier.name.startsWith('ANTI')
      const hasKeyword = target?.keywords?.some(keyword => modifier.name.includes(keyword.toUpperCase()))
      return isAnti && hasKeyword
    })
    if (modifiers?.name)
      return Number(modifiers?.name.match(/\d+/)?.[0])
  })()
  const lance = getModifier('LANCE', weapon.modifiers) ? 1 : 0
  const _wound = anti && (anti < wound) ? anti : wound - lance
  const failedWoundRolls = randomWoundRolls.reduce((sum, roll) => sum + (roll < _wound ? 1 : 0), 0)

  const hasTankKiller = unit.abilities?.find(ability => ['Tank-killer', 'Mobile Hunter-killers'].includes(ability.name)) && targetIsVehicleOrMonster(target)
  const hasTwinLinked = getModifier('TWIN-LINKED', weapon.modifiers)
  const hasBringersOfChange = unit.abilities?.find(ability => ability.name === 'Bringers of Change')
  const targetingArray = unit.abilities?.find(ability => ability.name === 'Targeting Array')
  const hasWoundReRolls = hasTwinLinked || hasBringersOfChange || hasTankKiller || targetingArray

  const randomWoundReRolls = hasWoundReRolls ? rolls(failedWoundRolls) : []
  const criticalWoundRolls = (() => {
    if (!anti)
      return 0
    const criticalWoundRollsEntries = Object.entries(occurrences(randomWoundRolls))
    return criticalWoundRollsEntries.reduce((sum, [key, value]) => (Number(key) >= anti ? sum + value : sum), 0)
  })()
  const randomWoundTotal = (() => {
    const rolled = [...randomWoundReRolls]
    if (!anti || anti > _wound)
      rolled.push(...randomWoundRolls)
    const rolledTotal = rolled.reduce((sum, roll) => sum + (roll >= _wound ? 1 : 0), 0)
    return rolledTotal + lethalHits + criticalWoundRolls
  })()

  // Saves
  const hasDevastatingWounds = (() => {
    const modifier = getModifier('DEVASTATING WOUNDS', weapon.modifiers)
    const ability = unit.abilities?.find(
      ability => ability.name === 'Mow Down the Enemy' && !targetIsVehicleOrMonster(target),
    )
    return modifier || ability
  })()
  const randomDevastatingWounds = hasDevastatingWounds ? occurrences([...randomWoundRolls, ...randomWoundReRolls])[6] : 0
  const randomSaveRolls = (() => {
    const count = randomWoundTotal - randomDevastatingWounds
    if (count < 1)
      return []
    return rolls(count)
  })()
  const invulnerable = getAbilityValue(target, 'INVULNERABLE SAVE') ?? 7
  const _piercing = weapon.piercing
    + (unit.abilities?.find(ability => ability.name === 'Point-blank Barrage') ? 1 : 0)
    - (target.abilities?.find(ability => ability.name === 'Ramshackle but Rugged') ? 1 : 0)

  const save = Math.min(target.attributes.save + _piercing, invulnerable)
  const randomSaveTotal = randomSaveRolls.reduce((sum, roll) => sum + (roll < save ? 1 : 0), 0) + randomDevastatingWounds

  const _damage = parseRolls(weapon.damage)
  const randomDamageRolls = rolls(randomSaveTotal * _damage.rolls, _damage.rollType)
  const randomDamageTotal = (() => {
    const hasHalfDamage = target?.abilities?.find(ability => ability.name === 'Necrodermis') ? 2 : 1
    const reduction = target?.abilities?.find(ability => ability.name === 'Wall of Muscle') ? 1 : 0
    const total = randomDamageRolls.reduce((sum, roll) => sum + roll, 0)
    if (_damage.rolls && !total)
      return 0
    if (!_damage.rolls)
      return Math.max(1, Math.round((randomSaveTotal * _damage.base) / hasHalfDamage) - reduction)
    return Math.max(1, Math.round((total + _damage.base) / hasHalfDamage) - reduction)
  })()

  const randomPainRolls = rolls(randomDamageTotal)
  const shiningAegis = Number(target?.abilities?.find(ability => ability.name === 'Shining Aegis')?.effect?.match(/\d+/)?.[0])
  const pain = shiningAegis || getAbilityValue(target, 'FEEL NO PAIN')
  const randomPainTotal = randomDamageTotal - (pain ? randomPainRolls.reduce((sum, roll) => sum + (roll >= pain ? 1 : 0), 0) : 0)

  const casualties = (() => {
    let _casualties = 0
    let currentModelWoundsRemaining = target.attributes.wound
    const damageValues = randomDamageRolls.length ? randomDamageRolls : [...Array(randomSaveTotal)].map(() => 0)
    for (const roll of damageValues) {
      const damage = roll + _damage.base
      const painRolls = rolls(damage)
      const damageTaken = damage - (pain ? painRolls.reduce((sum, roll) => sum + (roll >= pain ? 1 : 0), 0) : 0)
      currentModelWoundsRemaining = currentModelWoundsRemaining - damageTaken
      if (currentModelWoundsRemaining <= 0) {
        _casualties = _casualties + 1
        currentModelWoundsRemaining = target.attributes.wound
      }
    }
    return _casualties
  })()

  const totals = {
    name: weapon.name,
    accuracy: _accuracy,
    attack,
    strength,
    save,
    randomAttackRolls,
    randomAttacksTotal,
    randomHitRolls,
    randomHitReRolls,
    randomHitTotal,
    randomSustainedHitsTotal: sustainedHitsTotal,
    criticalHitRollsTotal,
    randomLethalHits: lethalHits,
    randomWoundRolls,
    randomWoundReRolls,
    randomWoundTotal,
    randomDevastatingWounds,
    randomSaveRolls,
    randomSaveTotal,
    randomDamageRolls,
    randomDamageTotal,
    randomPainTotal,
    randomPainRolls,
    casualties,
  }
  return totals
}
