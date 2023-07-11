<script setup>
const show = ref(false)
</script>

<template>
  <div class="relative inline-block text-left">
    <div>
      <button type="button" class="w-full inline-flex justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm" aria-expanded="true" aria-haspopup="true" @click="show = !show">
        Lists
        <svg class="h-5 w-5 text-gray-400 -mr-1" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  -->
    <div :class="{ 'opacity-100': show, 'opacity-0': !show }" class="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
      <div class="py-1" role="none">
        <nuxt-link to="/lists/damien" class="block px-4 py-2 text-sm text-gray-700" @click="show = false">
          Damien's list
        </nuxt-link>
        <nuxt-link to="/lists/braydon" class="block px-4 py-2 text-sm text-gray-700" @click="show = false">
          Braydon's list
        </nuxt-link>
        <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
      </div>
    </div>
  </div>
</template>
