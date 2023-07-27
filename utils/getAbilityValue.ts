import type Unit from '~/types/unit'

export default function getAbilityValue(unit: Unit, name: string) {
  const ability = unit.abilities?.find((ability) => {
    return ability?.name?.toUpperCase()?.startsWith(name?.toUpperCase())
  })
  if (ability?.name)
    return Number(ability?.name?.match(/\d+/)?.[0] ?? 0)
}
