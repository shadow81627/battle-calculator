<template>
  <div
    style="left: 0px; bottom: 0px; top: 64px; width: 256px; height: calc(100% - 64px); position: fixed; z-index: 1006; transform: translateX(0%);"
    class="fixed flex grow min-h-full shadow-md bg-white dark:bg-dark flex-col duration-500 !print:hidden"
    :class="{ 'opacity-0': !draw, 'w-0': !draw, 'w-60': draw }">
    <div v-for="item of items" :key="item.name" class="relative flex px-4" click="$emit('update:draw', !draw)"
      :class="{ 'bg-gray-200': $route.path === item.url, 'dark:bg-gray-600': $route.path === item.url, 'hover:bg-gray-500/10': $route.path !== item.url }">
      <span :class="item.icon" class="text-gray w-32px h-32px my-auto"></span>
      <NuxtLink :to="item.url" itemscope itemtype="https://schema.org/SiteNavigationElement"
        class="relative hover:text-grey-500 btn text-black-500">
        <slot>{{ item.name }}</slot>
      </NuxtLink>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    draw: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
  },
};
</script>
