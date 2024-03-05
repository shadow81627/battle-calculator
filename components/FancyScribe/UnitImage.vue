<script setup>
import { useStorage } from "@vueuse/core";

const props = defineProps({
  imageId: { type: String, default: null },
});

const image = computed(() => useStorage(props.imageId).value);
const hasImage = computed(() => image.value && image.value !== "undefined");

function updateImage(e) {
  if (e.target.files && e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function (ev) {
      image.value = ev.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  }
}
</script>

<template>
  <ClientOnly>
    <div
      style="
        position: absolute;
        right: 0;
        height: 240px;
        top: 0;
        width: 500px;
        max-width: 100%;
      "
    >
      <img
        v-if="hasImage"
        :src="image"
        alt=""
        style="width: 100%; height: 100%; object-fit: contain"
      />
      <div
        class="absolute right-[1px] top-[2px] hidden gap-1 print:hidden md:flex"
      >
        <label
          class="text-dark btn print:hidden"
          style="
            border: 1px solid #999;
            padding: 1px 4px;
            font-size: 0.8rem;
            background-color: #f0f0f0;
          "
        >
          <input
            type="file"
            class="print:hidden"
            accept=".jpg,.png,.jpeg,.gif,.bmp,.tif,.tiff,.webp,.svg,.jfif,.pjpeg,.pjp,.avif,.apng,.ico,.cur,.ani"
            style="display: none"
            @change="updateImage"
          />
          {{ hasImage ? "Change image" : "Upload image " }}
        </label>
        <button
          v-if="hasImage"
          class="text-dark btn print:hidden"
          style="
            border: 1px solid #999;
            padding: 1px 4px;
            font-size: 0.8rem;
            background-color: #f0f0f0;
          "
          @click="() => (image = undefined)"
        >
          Clear image
        </button>
      </div>
    </div>
  </ClientOnly>
</template>
