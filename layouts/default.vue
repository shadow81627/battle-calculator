<script setup>
const { data: items } = await useAsyncData("content-pages", () => {
  return queryContent("/pages").sort({ position: 1 }).find();
});
const draw = ref(false);
</script>

<template>
  <div class="body min-h-screen flex flex-col justify-start">
    <Navigation v-model:draw="draw" :items="items" />
    <SideNav v-model:draw="draw" :items="items" />
    <div
      class="w-full grow flex-col flex-wrap self-stretch p-t-[64px] !print:p-l-0 !print:p-t-0"
      style="max-width: 100%; transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
      :class="{ 'md:pl-[256px]': draw }"
    >
      <main style="min-height: 100vh">
        <NuxtPage />
      </main>
      <footer class="flex print:hidden">
        <div class="container">
          <div class="row">
            <div class="col">
              <p>
                <span>Site by </span>
                <a href="https://daim.dev" class="underline" target="_blank"
                  >Daim Digital</a
                >
              </p>
            </div>
            <div class="col">
              <Refresh />
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
