<script setup>
const { data, pending } = await useAsyncData(
  "resources-index",
  () => queryContent("resources").find(),
  {
    transform(data) {
      return data.sort();
    },
  },
);
</script>

<template>
  <div>
    <section class="container">
      <div class="row">
        <div class="col">
          <h1 class="h2">Resources</h1>
          <div>
            A collection of 40k related apps that helped inspired this project
          </div>
        </div>
      </div>
    </section>
    <section class="container my-9">
      <div class="row">
        <div v-if="pending" class="col">
          <Spinner class="mx-auto h-64px w-64px" />
        </div>
        <div
          v-for="resource of data"
          :key="resource.name"
          class="col lg:col-4 md:col-6 sm:col-6 xl:col-3 flex"
        >
          <div
            class="flex flex-grow-1 flex-col justify-between rounded-lg bg-white shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800"
          >
            <div
              class="d-block flex-none p-y[0.5rem] px-4 text-[1.25rem] font-500 leading-8"
            >
              <h2>{{ resource.name }}</h2>
            </div>
            <div class="flex-1 flex-grow-1 p-4">
              {{ resource.description }}
            </div>
            <div class="flex p-2">
              <div class="flex-grow-1" />
              <a :href="resource.url" target="_blank" rel="noopener">
                <svg
                  style="font-size: 2em; width: 32px; height: 32px"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32px"
                  height="32px"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
