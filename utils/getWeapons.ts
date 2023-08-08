import { flatMap, groupBy } from 'lodash-es'
import type Unit from '~/types/unit'
import type { Weapon } from '~/types/unit'

export default function getWeapons(unit: Unit) {
  function addMemberWeaponModels(member: Unit) {
    return member.weapons?.map((weapon) => {
      if (!weapon.models)
        weapon.models = member.models ?? unit.models
      return weapon
    })
  }
  const memberWeapons = unit.members?.map(addMemberWeaponModels).flat()
  const deduplicatedMemberWeapons = Object.entries(groupBy(memberWeapons, 'name')).map(([_, weapons]) => {
    const models = weapons.reduce((sum, weapon) => sum + (weapon?.models ?? 0), 0)
    return { ...weapons[0], models }
  }) ?? []
  const weapons = unit.weapons ?? []
  const profiles = flatMap(weapons, weapon => weapon.profiles)
  return [...deduplicatedMemberWeapons, ...weapons, ...profiles]?.filter((weapon): weapon is Weapon => {
    return weapon !== undefined && !weapon.profiles
  })
}
