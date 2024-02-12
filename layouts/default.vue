<template>
  <div class="min-h-screen flex flex-col justify-start body">
    <Navigation v-model:draw="draw" :items="items"></Navigation>
    <SideNav :items="items" v-model:draw="draw"></SideNav>
    <div class="w-full flex-col grow self-stretch flex-wrap"
      style="max-width: 100%; padding-top: 64px; transition: .2s cubic-bezier(.4,0,.2,1);"
      :class="{ 'md:pl-[256px]': draw }">
      <main style="min-height: 100vh">
        <NuxtPage />
      </main>
      <footer class="flex print:hidden">
        <div class="container">
          <div class="row">
            <div class="col">
              <p>
                <span>Site by </span>
                <a href="https://daim.dev" class="underline" target="_blank">Daim Digital</a>
              </p>
            </div>
            <div class="col">
              <Refresh></Refresh>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
const { data: items } = await useAsyncData(`content-pages`, () => {
  return queryContent("/pages").sort({ position: 1 }).find();
});
const draw = ref(false);
</script>
