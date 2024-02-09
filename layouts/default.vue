<template>
  <div class="min-h-screen flex flex-col justify-start body">
    <Navigation v-model:draw="draw" :items="items"></Navigation>
    <div class="flex justify-start self-stretch h-full grow relative">
      <div id="sidenav" class="self-stretch flex grow flex-col min-h-full absolute sm:relative z-1000">
        <SideNav :items="items" :draw="draw"></SideNav>
      </div>
      <div class="w-full flex-col grow self-stretch flex-wrap">
        <main itemprop="mainContentOfPage" itemtype="https://schema.org/WebPageElement">
          <NuxtPage />
        </main>
        <footer class="flex print:hidden">
          <p>
            <span>Site by </span>
            <a href="https://daim.dev" class="underline" target="_blank">Daim Digital</a>
          </p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: items } = await useAsyncData(`content-navigation`, () => {
  // return queryContent("/navigation").sort({ pos: 1 }).find();
  const items = [
    {
      icon: "i-carbon-home",
      name: "Home",
      url: "/",
      pos: "1/1",
    },
    {
      icon: "i-carbon-list",
      name: "Lists",
      url: "/lists",
      pos: "2/1",
    },
    {
      icon: "i-carbon-document",
      name: 'Resources',
      url: '/resources',
    },
    {
      name: 'FancyScribe',
      url: '/battlescribe/fancyscribe',
    },
    {
      name: 'BattleScribe Library',
      url: '/battlescribe/library',
    },
  ];
  // if (user.value) {
  //   items.push(
  //     {
  //       icon: "i-carbon-user",
  //       name: "Profile",
  //       url: "/profile",
  //       pos: "3/1",
  //     },
  //     {
  //       icon: "i-carbon-logout",
  //       name: "Logout",
  //       url: "/logout",
  //       pos: "3/1",
  //     },
  //   );
  // }
  return items;
});
const draw = ref(false);
</script>
