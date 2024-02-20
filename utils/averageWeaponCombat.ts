import formatAverage from './formatAverage'
import type CombatModifiers from '~/types/CombatModifiers'
import type Unit from '~/types/unit'
import type { Weapon } from '~/types/unit'
import weaponCombat from '~/utils/weaponCombat'

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
    const isResultKey = (key: any): key is keyof typeof defaultResult => key in defaultResult
    if (isResultKey(key) && typeof value === 'number')
      sum[key] = sum[key] + value
  }
  return sum
}

export default function averageWeaponCombat(data: {
  weapon: Weapon
  unit: Unit
  target: Unit
  additional: CombatModifiers
}) {
  const numberOfRolls = 10_000
  const rolls = [...Array(numberOfRolls)].map(() => weaponCombat(data.weapon, data.unit, data.target, data.additional))
  const sums = Object.entries(rolls.reduce(resultSum, { ...defaultResult }))
  const averages = Object.fromEntries(sums.map(([sumKey, sumValue]) => [sumKey.replace('random', 'average'), formatAverage(sumValue / rolls.length)]))
  // const probabilities = Object.fromEntries(Object.entries(occurrences(rolls.reduce((acc, roll) => {
  //   return acc.concat(roll.randomHitRolls)
  // }, []))).map(([key, value]) => [key, formatAverage(value / rolls.length)]))
  return averages
}
