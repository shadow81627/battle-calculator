/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
self.addEventListener('message', (e) => {
  const result = averageWeaponCombat(e.data)
  self.postMessage(result)
}, false)
