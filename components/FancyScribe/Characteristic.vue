<script setup>
defineProps({
  title: { type: String, required: true },
  characteristic: { type: String, required: true },
  index: { type: Number, required: true },
});
</script>

<template>
  <div style="display: flex; flex-direction: column; align-items: center">
    <div v-if="index === 0" style="font-size: 0.9em; font-weight: 800">
      {{ title }}
    </div>
    <div
      style="
        color: var(--primary-color);
        padding: 2px;
        background: var(--primary-color);
        clip-path: polygon(
          12% 0px,
          100% 0px,
          100% 20%,
          100% 88%,
          88% 100%,
          20% 100%,
          0px 100%,
          0px 12%
        );
      "
    >
      <div
        style="
          min-width: 3rem;
          min-height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgb(232, 237, 231);
          clip-path: polygon(
            10% 0px,
            100% 0px,
            100% 20%,
            100% 90%,
            90% 100%,
            20% 100%,
            0px 100%,
            0px 10%
          );
          padding: 3px;
          font-size: 1.6em;
          font-weight: 800;
        "
      >
        {{ characteristic }}
      </div>
    </div>
  </div>
</template>
