import weaponCombat from '~/utils/weaponCombat'

/* eslint-disable no-restricted-globals */
self.addEventListener('message', (e) => {
  const data = e.data
  const result = weaponCombat(data.weapon, data.unit, data.target, data.additional)
  self.postMessage({ ...result, id: data.id })
}, false)
