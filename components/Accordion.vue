<script setup lang="ts">
// defineProps<{}>()
const show = ref(false)
function toggleShow() {
  show.value = !show.value
}
</script>

<template>
  <div id="accordion-flush-heading-1" @click="toggleShow">
    <button type="button"
      class="flex items-center xjustify-between w-full py-5 font-medium text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
      data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
      <svg data-accordion-icon :class="{ 'rotate-180': !show }" class="w-3 h-3  shrink-0" aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
      </svg>
      &nbsp;
      <slot name="header"></slot>
    </button>
  </div>
  <div id="accordion-flush-body-1" :class="{ 'hidden': !show }" aria-labelledby="accordion-flush-heading-1">
    <div class="py-5 border-b border-gray-200 dark:border-gray-700">
      <slot></slot>
    </div>
  </div>
</template>
