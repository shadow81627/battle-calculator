export interface Enhancement {
  name: string
  points: number
}
export interface WeaponModifier {
  name: string
}
export interface Weapon {
  name: string
  modifiers: WeaponModifier
  models: number
  range: number | "Melee"
  attack: number | string
  accuracy: number
  strength: number
  piercing: number
  damage: number | string,
  profiles?: Weapon[]
}
export default interface Unit {
  _path: string
  name: string
  models: number
  points: number
  quantity?: number
  offers: [
    {
      price: number
      priceCurrency: 'AUD' | 'USD'
      eligibleQuantity: number
      offeredBy: {
        type: 'Organization' | 'Person'
        name: string
      }
      itemCondition: 'NewCondition',
      url?: string
    },
  ],
  abilities: Array<{name: string}>
  weapons?: Weapon[],
  enhancements?: Enhancement[]
  members?: Unit[]
}