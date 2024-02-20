<script>
export default {
  setup() {
    return {
      items: [
        { title: 'Home', url: '/' },
        { title: 'Lists', url: '/lists' },
        { title: 'Resources', url: '/resources' },
      ],
    }
  },
  methods: {
    classes(url) {
      const isActive = this.$route.path === url
      return {
        'text-dark-500': !isActive,
        'text-dark-900': isActive,
        'hover:text-dark-700': !isActive,
        'focus:text-dark-700': !isActive,
        'border-dark-500': isActive,

        'dark:text-light-500': !isActive,
        'dark:text-light-900': isActive,
        'dark:hover:text-light-700': !isActive,
        'dark:focus:text-light-700': !isActive,
        'dark:border-light-500': isActive,

        'border-transparent': !isActive,
      }
    },
  },
}
</script>

<template>
  <NuxtLink
    v-for="{ title, url } of items"
    :key="url"
    class="nav-link inline-flex items-center border-b-2 px-1 pt-1 font-medium font-medium"
    :class="classes(url)"
    :to="url"
    itemscope
    itemtype="https://schema.org/SiteNavigationElement"
  >
    {{ title }}
  </NuxtLink>
</template>
