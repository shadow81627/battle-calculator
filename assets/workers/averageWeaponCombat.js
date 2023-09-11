import averageWeaponCombat from '~/utils/averageWeaponCombat'

/* eslint-disable no-restricted-globals */
self.addEventListener('message', (e) => {
  const result = averageWeaponCombat(e.data)
  self.postMessage(result)
}, false)
