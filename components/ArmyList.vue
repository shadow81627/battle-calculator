<script setup lang="ts">
import { minBy, sumBy } from "lodash-es";
import type Unit from "~/types/unit";

const props = defineProps<{ data: Unit[] }>();
function unitBestOffer(unit: Unit) {
  const offers = unit.offers?.filter((offer) => offer.price);
  const offer = minBy(offers, "price");
  return offer;
}
function unitPrice(item: Unit) {
  const offer = unitBestOffer(item);
  return (
    Math.ceil(offer?.price ?? 0) *
    Math.ceil(item.models / (offer?.eligibleQuantity ?? 1))
  );
}
const totals = computed(() => {
  const quantity = props.data.reduce(
    (sum, item) => sum + Math.ceil(item.quantity ?? 1),
    0,
  );
  const models = props.data.reduce(
    (sum, item) => sum + item.models * Math.ceil(item.quantity ?? 1),
    0,
  );
  const unitPoints = props.data.reduce(
    (sum, item) => sum + Math.ceil(item.points * (item.quantity ?? 1)),
    0,
  );
  const enhancementPoints =
    props.data.reduce(
      (sum, item) => sum + sumBy(item.enhancements, "points"),
      0,
    ) ?? 0;
  const points = unitPoints + enhancementPoints;
  return {
    quantity,
    models,
    points,
  };
});

const _data = computed(() => {
  return props.data
    .map((item) => {
      if (!item.quantity) return [item];
      const items = [...Array(Math.ceil(item.quantity))].map(() =>
        JSON.parse(JSON.stringify(item)),
      );
      const decimal = item.quantity % 1;
      if (decimal) {
        const last = items.slice(-1)[0];
        last.models = Math.ceil((last.models ?? 1) * decimal);
        last.points = Math.ceil(last.points * decimal);
      }
      return items;
    })
    .flat();
});
const route = useRoute();
</script>

<template>
  <table>
    <thead>
      <tr class="text-left">
        <th class="p-1">Name</th>
        <!-- <th class="p-1 text-right">
          Quantity
        </th> -->
        <th class="p-1 text-center">Models</th>
        <th class="p-1 text-center">Points</th>
        <th class="p-1 text-right">Price</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="unit of _data" :key="unit.name">
        <tr>
          <td class="p-1 text-left">
            <NuxtLink
              :to="`${route.path}/units/${unit._path.split('/').slice(-1)}`"
            >
              {{ unit.name }}
            </NuxtLink>
          </td>
          <!-- <td class="p-1 text-right">
          {{ unit.quantity }}
        </td> -->
          <td class="p-1 text-right">
            {{ unit.models }}
          </td>
          <td class="p-1 text-right">
            {{ unit.points }}
          </td>
          <td v-if="unit.offers" class="p-1 text-right">
            <a
              v-if="unitBestOffer(unit)?.url"
              :href="unitBestOffer(unit)?.url"
              class="text-blue-600 dark:text-blue-300"
              target="_blank"
            >
              ${{ unitPrice(unit) }}
            </a>
            <template v-else> ${{ unitPrice(unit) }} </template>
          </td>
        </tr>
        <tr
          v-for="enhancement of unit.enhancements ?? []"
          :key="enhancement.name"
        >
          <td class="p-1 text-left">Enhancement: {{ enhancement.name }}</td>
          <!-- <td class="p-1 text-right">
            {{ enhancement.quantity }}
          </td> -->
          <td class="p-1 text-right">
            <!-- {{ enhancement.models }} -->
          </td>
          <td class="p-1 text-right">
            {{ enhancement.points }}
          </td>
        </tr>
      </template>
      <tr>
        <td colspan="100%">
          <hr />
        </td>
      </tr>
      <tr class="font-bold">
        <td class="p-1 text-left">Total</td>
        <!-- <td class="p-1 text-right">
          {{ totals.quantity }}
        </td> -->
        <td class="p-1 text-right">
          {{ totals.models }}
        </td>
        <td class="p-1 text-right">
          {{ totals.points }}
        </td>
        <td class="p-1 text-right">
          ${{
            props.data.reduce((sum, item) => sum + (unitPrice(item) ?? 0), 0)
          }}
        </td>
      </tr>
    </tbody>
  </table>
  <section class="my-5">
    <div v-for="unit of _data" :key="unit.name">
      <div>
        <NuxtLink
          :to="`${route.path}/units/${unit._path.split('/').slice(-1)}`"
        >
          {{ unit.name }}
        </NuxtLink>
        ({{ unit.points }})
      </div>
      <div v-for="weapon of unit.weapons" :key="weapon.name">
        <span>&nbsp;&nbsp;•&nbsp;</span>
        <span>{{ weapon.models ?? unit.models }}x&nbsp;</span>
        <span>{{ weapon.name }}</span>
      </div>
      <div
        v-for="enhancement of unit.enhancements ?? []"
        :key="enhancement.name"
      >
        <span>&nbsp;&nbsp;•&nbsp;</span>Enhancement: {{ enhancement.name }} ({{
          enhancement.points
        }})
      </div>
      <div v-for="member of unit.members" :key="member.name">
        <span>&nbsp;&nbsp;•&nbsp;</span>
        {{ member.name }}
        <div v-for="weapon of member.weapons" :key="weapon.name">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;</span>
          <span
            >{{ weapon.models ?? member.models ?? unit.models }}x&nbsp;</span
          >
          <span>{{ weapon.name }}</span>
        </div>
      </div>
      <br />
    </div>
  </section>
</template>
