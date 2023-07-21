export default function parseRolls(roll: string | number) {
  const base = Number(String(roll).match(/\+(\d+)/)?.[1] ?? (typeof roll === 'number' ? roll : 0))
  const rollType = Number(String(roll).match(/D(\d+)/)?.[1])
  const rolls = Number(String(roll).match(/(\d+)D/)?.[1] ?? (rollType ? 1 : 0))
  return { rolls, base, rollType: rollType || 6 }
}
