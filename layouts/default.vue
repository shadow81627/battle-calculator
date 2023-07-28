<template>
  <header>
    <nuxt-link to="/" class="bg-transparent btn hover:bg-transparent">
      Calculator
    </nuxt-link>
    |
    <nuxt-link to="/lists" class="bg-transparent btn hover:bg-transparent">
      Lists
    </nuxt-link>
    |
    <a href="https://www.warhammer-community.com/warhammer-40000-downloads/" class="bg-transparent btn hover:bg-transparent" target="_blank">
      Indexes
    </a>
  </header>
  <main>
    <slot />
  </main>
</template>
