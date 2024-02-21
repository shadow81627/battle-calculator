<script>
import { useMediaQuery } from '@vueuse/core'

export default {
  props: {
    draw: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
  },
  setup() {
    const isSmallScreen = useMediaQuery('(max-width: 767px)')
    return { isSmallScreen }
  },
  methods: {
    close() {
      if (this.isSmallScreen)
        this.$emit('update:draw', false)
    },
  },
}
</script>

<template>
  <div
    style="left: 0px; bottom: 0px; top: 64px; width: 256px; height: calc(100% - 64px); position: fixed; z-index: 1006; transition-timing-function: cubic-bezier(.4,0,.2,1);"
    class="fixed min-h-full flex grow flex-col overflow-hidden bg-white shadow-md transition-transform duration-200 dark:bg-dark !print:hidden"
    :class="{ 'translate-x-0': draw, 'translate-x-[-110%]': !draw }"
  >
    <div
      v-for="item of items" :key="item.name" class="flex px-4" :class="{ 'bg-gray-200': $route.path === item.url, 'dark:bg-gray-600': $route.path === item.url, 'hover:bg-gray-500/10': $route.path !== item.url }"
      @click="close"
    >
      <Icon :name="item.icon" class="my-auto text-gray" style="width: 32px; height: 32px" />
      <NuxtLink
        :to="item.url" itemscope itemtype="https://schema.org/SiteNavigationElement"
        class="text-black-500 hover:text-grey-500 relative btn"
      >
        <slot>{{ item.name }}</slot>
      </NuxtLink>
    </div>
  </div>
  <div
    v-if="draw && isSmallScreen" class="opacity-20" style="background: #000;height: 100%;left: 0;position: absolute;top: 0;transition: opacity 0.2s cubic-bezier(.4,0,.2,1);width: 100%;z-index: 1005;"
    @click="close"
  />
</template>
