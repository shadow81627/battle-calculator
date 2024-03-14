<script setup>
import { OnClickOutside } from "@vueuse/components";
const props = defineProps({
  items: { type: Array, default: () => [] },
  search: { type: String, default: "" },
});
const open = ref();
const emit = defineEmits(["update:search"]);
function setSearch(value) {
  emit("update:search", value);
  open.value = false;
}
</script>

<template>
  <OnClickOutside class="w-full flex flex-wrap" @trigger="open = false">
    <div class="w-full flex border-2 rounded">
      <label
        for="search"
        class="peer-focus:text-primary dark:peer-focus:text-primary mb-0 flex bg-transparent p-2 text-neutral-200 transition-all duration-200 ease-out peer-focus:scale-[0.8] dark:text-neutral-200 motion-reduce:transition-none peer-focus:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] peer-data-[te-input-state-active]:-translate-y-[0.9rem]"
      >
        <Icon
          name="carbon:search"
          class="my-auto"
          style="width: 32px; height: 32px"
        />
      </label>
      <input
        id="search"
        :value="props.search"
        type="text"
        name="search"
        class="peer peer-focus:text-primary dark:peer-focus:text-primary block min-h-[auto] flex-grow-1 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear dark:text-neutral-200 motion-reduce:transition-none dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 data-[te-input-state-active]:placeholder:opacity-100 focus:placeholder:opacity-100"
        @click="open = true"
        @input="emit('update:search', $event.target?.value)"
      />
      <button
        class="p-2 transition-all duration-500 btn"
        :class="{
          'opacity-0': !search,
          'opacity-100': search,
          'pointer-events-none': !search,
        }"
        @click="setSearch('')"
      >
        <Icon
          name="carbon:close"
          class="my-auto"
          style="width: 32px; height: 32px"
        ></Icon>
      </button>
    </div>
    <div class="relative w-full">
      <div
        :class="{
          'opacity-0': !open,
          'opacity-100': open,
          'pointer-events-none': !open,
        }"
        class="absolute left-0 right-0 z-1000 rounded-2 bg-white shadow-lg transition-all duration-500 dark:bg-slate-800"
      >
        <div class="flex flex-col px-4 py-2">
          <div
            v-for="item of items"
            :key="item.name"
            @click="setSearch(item.name)"
          >
            <span class="btn">{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </OnClickOutside>
</template>
