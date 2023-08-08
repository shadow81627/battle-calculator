export default function getWound(strength: number, toughness: number) {
  if (strength === toughness)
    return 4
  if (strength >= (toughness * 2))
    return 2
  if (strength > toughness)
    return 3
  if (strength <= (toughness / 2))
    return 6
  if (strength < toughness)
    return 5
  return 6
}
