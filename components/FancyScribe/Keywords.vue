<script setup>
const props = defineProps({ keywords: { type: Array, required: true } });
const joinedKeywords = [...props.keywords].join(", ");
</script>

<template>
  <div
    class="relative md:absolute"
    style="
      right: -2px;
      bottom: -16px;
      padding: 0px 42px 0px 8px;
      display: flex;
      align-items: center;
      background-color: rgb(188, 188, 190);
      border: 2px solid var(--primary-color);
      width: calc(100% - 0.9rem);
      background-size: contain;
      min-height: 54px;
      gap: 3px;
    "
  >
    <span style="font-size: 1.1em">KEYWORDS:</span>
    <span
      :style="{
        fontSize: joinedKeywords.length > 70 ? '.8em' : '1em',
        fontWeight: 800,
      }"
    >
      {{ joinedKeywords }}
    </span>
  </div>
</template>
