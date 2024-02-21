import type CombatModifiers from "types/CombatModifiers";
import type Unit from "~/types/unit";

export default function unitCombat(
  unit: Unit,
  target: Unit,
  additional?: CombatModifiers,
) {
  const weapons = getWeapons(unit);
  const results = [];
  for (const weapon of weapons) {
    const totals = weaponCombat(weapon, unit, target, additional);
    results.push(totals);
  }
  return results;
}
