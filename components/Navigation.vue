<template>
  <nav
    class="relative w-full flex flex-wrap items-center justify-between text-lg shadow-md print:hidden"
    section-bg
    rounded-none
  >
    <div
      class="container-fluid w-full flex flex-wrap items-center justify-between px-2 h-64px"
    >
      <div class="container-fluid flex">
        <button
          class="navbar-toggler flex text-white border-0 hover:shadow-none hover:no-underline py-2 px-2.5 bg-transparent focus:outline-none focus:ring-0 focus:shadow-none focus:no-underline"
          type="button"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          @click="$emit('update:draw', !draw)"
        >
          <span class="h-24px w-24px my-auto">
            <svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"></path></svg>
          </span>
        </button>
        <nuxt-link
          class="flex items-center text-black-900 hover:text-black-900 focus:text-black-900 mt-2 lg:mt-0 mr-1"
          to="/"
        >
          <!-- <img
            src="/logo.svg"
            class="navbar-brand"
            height="24"
            width="60"
            alt="Daim"
          /> -->
          BattleScrub
        </nuxt-link>
      </div>

      <div class="flex justify-between">
        <client-only>
          <DarkToggle class="px-2"></DarkToggle>
        </client-only>
        <!-- <UserMenu></UserMenu> -->
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    draw: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
  },
  emits: ["update:draw"],
};
</script>
