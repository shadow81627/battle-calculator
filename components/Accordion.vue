<script setup lang="ts">
// defineProps<{}>()
const show = ref(false)
function toggleShow() {
  show.value = !show.value
}
</script>

<template>
  <div
    id="accordion-flush-heading-1"
    @click="toggleShow"
  >
    <button
      type="button"
      class="xjustify-between w-full flex items-center border-b border-gray-200 py-5 text-left text-gray-500 font-medium dark:border-gray-700 dark:text-gray-400"
      data-accordion-target="#accordion-flush-body-1"
      aria-expanded="true"
      aria-controls="accordion-flush-body-1"
    >
      <svg
        data-accordion-icon
        :class="{ 'rotate-180': !show }"
        class="h-3 w-3 shrink-0"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5 5 1 1 5"
        />
      </svg>
      &nbsp;
      <slot name="header" />
    </button>
  </div>
  <div
    id="accordion-flush-body-1"
    :class="{ hidden: !show }"
    aria-labelledby="accordion-flush-heading-1"
  >
    <div class="border-b border-gray-200 py-5 dark:border-gray-700">
      <slot />
    </div>
  </div>
</template>
