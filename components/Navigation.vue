<template>
  <nav
    class="relative w-full flex flex-wrap items-center justify-between print:hidden"
    section-bg
    rounded-none
  >
    <div
      class="container-fluid w-full flex flex-wrap items-center justify-between px-6"
    >
      <div class="container-fluid" h-16 flex justify-between lg:space-x-8>
        <Links />
      </div>
      <div flex justify-between>
        <DarkToggle px-2 />
      </div>
    </div>
  </nav>
</template>
