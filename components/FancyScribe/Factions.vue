<script setup>
defineProps({ factions: {type: Array, required: true} })
</script>

<template>
  <div
    class="ml-2 !print:bg-[#bcbcbe] !print:text-dark"
    style="
    position: absolute;
    left: 0px;
    bottom: -16px;
    padding: 0px 4px 0px 42px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background-color: #09171a;
    border: 2px solid var(--primary-color);
    color: rgb(255, 255, 255); border-left: none;
    width: calc(100% - 0.9rem);
    min-height: 54px;"
  >
    <span style="font-size: 0.9em; font-weight: 400;">
      FACTION KEYWORDS:
    </span>
    <span
      style="font-size: 0.8em; font-weight: 600;"
      class="uppercase"
    >
      {{ factions.join(", ") }}
    </span>
  </div>
</template>
