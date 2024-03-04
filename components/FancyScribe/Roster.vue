<script setup>
defineProps({
  roster: { type: Object, required: true },
  onePerPage: { type: Boolean, default: false },
});
</script>

<template>
  <div style="position: relative">
    <div
      class="print:hidden"
      style="
        background-color: var(--primary-color);
        color: #fff;
        padding: 4px 16px;
        font-size: 1.7em;
        font-weight: 800;
        text-transform: uppercase;
        margin-bottom: 12px;
      "
    >
      {{ roster.name }} [{{ roster.cost.points }} pts]
    </div>
    <FancyScribeForce
      v-for="(force, index) of roster.forces"
      :key="index"
      :force="force"
      :one-per-page="onePerPage"
    />
  </div>
</template>
