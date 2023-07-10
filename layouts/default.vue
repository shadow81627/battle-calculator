<template>
  <header>
    <nuxt-link to="/">
      Home
    </nuxt-link>
    <nuxt-link to="/lists/damien">
      Damien's list
    </nuxt-link>
  </header>
  <main class="px-5 py-20 text-center">
    <slot />
  </main>
</template>
