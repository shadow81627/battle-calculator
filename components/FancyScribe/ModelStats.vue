<script setup>
const props = defineProps({
  modelStat: { type: Object, required: true },
  'index': { type: Number, required: true },
  'showName': { type: Boolean, required: true },
  'modelList': { type: Array, required: true }
})
let {wounds} = props.modelStat
const { move, toughness, save, leadership, name, oc, }
  = props.modelStat
if (!wounds)
  wounds = '/'

const showWeapons = props.index === 0
</script>

<template>
  <div style="display: flex; gap: 1.2rem;">
    <FancyScribeCharacteristic
      title="M"
      :characteristic="move"
      :index="index"
    />
    <FancyScribeCharacteristic
      title="T"
      :characteristic="toughness"
      :index="index"
    />
    <FancyScribeCharacteristic
      title="SV"
      :characteristic="save"
      :index="index"
    />
    <FancyScribeCharacteristic
      title="W"
      :characteristic="wounds"
      :index="index"
    />
    <FancyScribeCharacteristic
      title="LD"
      :characteristic="leadership"
      :index="index"
    />
    <FancyScribeCharacteristic
      title="OC"
      :characteristic="oc"
      :index="index"
    />
    <div
      class="flex flex-wrap items-center gap-2"
      style="margin-top: 16px; text-shadow: rgb(0, 0, 0) 0px 0px 5px;"
    >
      <div
        v-if="showName"
        style="white-space:nowrap"
      >
        {{ name }}
      </div>
      <div
        v-if="showWeapons"
        style="font-size: 0.7em"
      >
        <div
          v-for="model of modelList"
          :key="model"
        >
          {{ model }}
        </div>
      </div>
    </div>
  </div>
</template>
