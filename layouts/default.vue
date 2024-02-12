<template>
  <div class="min-h-screen flex flex-col justify-start body">
    <Navigation v-model:draw="draw" :items="items"></Navigation>
    <div class="flex justify-start self-stretch h-full grow relative">
      <div id="sidenav" class="self-stretch flex grow flex-col min-h-full absolute sm:relative z-1000">
        <SideNav :items="items" v-model:draw="draw"></SideNav>
      </div>
      <div class="w-full flex-col grow self-stretch flex-wrap"
        style="max-width: 100%; padding-top: 64px; transition: .2s cubic-bezier(.4,0,.2,1);"
        :class="{ 'pl-[256px]': draw }">
        <main style="min-height: 100vh">
          <NuxtPage />
        </main>
        <footer class="flex print:hidden">
          <div class="container">
            <p>
              <span>Site by </span>
              <a href="https://daim.dev" class="underline" target="_blank">Daim Digital</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: items } = await useAsyncData(`content-pages`, () => {
  return queryContent("/pages").sort({ position: 1 }).find();
});
const draw = ref(false);
</script>
