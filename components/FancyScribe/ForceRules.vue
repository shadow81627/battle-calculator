<script setup>
const props = defineProps(['rules', 'onePerPage'])
const keys = Object.keys(props.rules);
</script>

<template>
  <div class="avoid-page-break">
    <label class="print:hidden flex justify-end gap-4 pb-2">
      <input type="checkbox" xchange="() => setHide(!hide)" />
      <span class="print:hidden">Don't print this card.</span>
    </label>

    <!-- balanced column layout https://stackoverflow.com/a/66915792 -->
    <div
      class="columns-2 2xl:columns-3 gap-10 [column-fill:_balance] box-border mx-auto before:box-inherit after:box-inherit"
      style="gap: 8px; padding: 20px; border: 2px solid var(--primary-color); margin-bottom: 32px;">
      <div v-for="rule of keys" :key="rule" style="line-height: 1.4;" class="prose mx-auto py-[8px]">
        <span style="font-weight: 700;">{{ rule }}:</span> <span style="white-space: pre-line">{{ rules[rule] }}</span>
      </div>
    </div>
  </div>
</template>
