<template>
  <header>
    <nuxt-link to="/" class="btn bg-transparent hover:bg-transparent">
      Calculator
    </nuxt-link>
    |
    <nuxt-link to="/lists" class="btn bg-transparent hover:bg-transparent">Lists</nuxt-link>
  </header>
  <main>
    <slot />
  </main>
</template>
