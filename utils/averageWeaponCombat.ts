import type CombatModifiers from '~/types/CombatModifiers'
import type Unit from '~/types/unit'
import type { Weapon } from '~/types/unit'

const defaultResult = {
  randomAttacksTotal: 0,
  randomHitTotal: 0,
  randomSustainedHitsTotal: 0,
  randomWoundTotal: 0,
  randomSaveTotal: 0,
  randomDamageTotal: 0,
  randomPainTotal: 0,
  casualties: 0,
}

function resultSum(sum: typeof defaultResult, result: typeof defaultResult) {
  for (const [key, value] of Object.entries(result)) {
    const _key = key.replace('average', 'random')
    const isResultKey = (key: any): key is keyof typeof defaultResult => key in defaultResult
    if (isResultKey(_key) && typeof value === 'number')
      sum[_key] += value
  }
  return sum
}

export default function averageWeaponCombat(data: {
  weapon: Weapon
  unit: Unit
  target: Unit
  additional: CombatModifiers
  numberOfRolls: 100
  rolls: typeof defaultResult[]
}) {
  const rolls = data.rolls?.length ? data.rolls : [...Array(data.numberOfRolls)].map(() => weaponCombat(data.weapon, data.unit, data.target, data.additional))
  const sums = Object.entries(rolls.reduce(resultSum, { ...defaultResult }))
  const averages = Object.fromEntries(sums.map(([sumKey, sumValue]) => [sumKey.replace('random', 'average'), (sumValue / rolls.length)]))
  // const probabilities = Object.fromEntries(Object.entries(occurrences(rolls.reduce((acc, roll) => {
  //   return acc.concat(roll.randomHitRolls)
  // }, []))).map(([key, value]) => [key, formatAverage(value / rolls.length)]))
  return averages
}
