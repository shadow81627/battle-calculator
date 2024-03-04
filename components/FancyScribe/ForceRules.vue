<script setup>
const props = defineProps({
  rules: { type: Object, required: true },
  onePerPage: { type: Boolean, required: false },
});
const duplicateKeyTypes = [
  "Deadly Demise",
  "Scouts",
  "Feel no pain",
  "Firing Deck",
];
const _rules = computed(() => {
  const result = {};
  for (const key in props.rules) {
    const _key =
      duplicateKeyTypes.find((item) =>
        key.toLocaleLowerCase().includes(item.toLocaleLowerCase()),
      ) ?? key;
    result[_key] = props.rules[key];
  }
  return result;
});
const keys = Object.keys(_rules.value);
const hide = ref(false);
</script>

<template>
  <div
    style="max-width: 282mm"
    class="mx-auto flex py-6"
    :class="{
      '!print:hidden': hide,
    }"
  >
    <div class="avoid-page-break">
      <label class="flex justify-end gap-4 pb-2 print:hidden">
        <input v-model="hide" type="checkbox" />
        <span class="print:hidden">Don't print this card.</span>
      </label>

      <!-- balanced column layout https://stackoverflow.com/a/66915792 -->
      <div
        class="[column-fill:_balance] mx-auto box-border columns-1 gap-10 after:box-inherit before:box-inherit 2xl:columns-3 sm:columns-2"
        style="
          gap: 8px;
          padding: 20px;
          border: 2px solid var(--primary-color);
          margin-bottom: 32px;
        "
      >
        <div
          v-for="rule of keys"
          :key="rule"
          style="line-height: 1.4"
          class="mx-auto py-[8px] prose"
        >
          <span style="font-weight: 700">{{ rule }}: </span>
          <span style="white-space: pre-line">{{ _rules[rule] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
