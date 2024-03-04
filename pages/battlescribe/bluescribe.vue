<script setup>
const { data, pending } = await useFetch("/api/battlescribe/bluescribe");
const primaryColor = "#536766";
</script>

<template>
  <div>
    <FancyScribeRoster
      v-if="data.fancyscribe"
      :roster="data.fancyscribe"
      :style="{
        '--primary-color': primaryColor,
        '--primary-color-transparent': `${primaryColor}60`,
      }"
      class="bg-light text-dark"
    />
    <Spinner v-if="pending" class="mx-auto h-64px w-64px" />
    <span v-else-if="!data">No data found</span>
    <div v-else-if="false" class="m-10">
      <template v-if="data.catalogue">
        <!-- <BattleScribeEntryLink
          v-for="entry of data.catalogue.entryLinks"
          :key="entry.id"
          :entry-link="entry"
          :library="data.library"
        >
        </BattleScribeEntryLink> -->
      </template>

      <!-- <BattleScribeRoster
        :game-system="data.gameData.gameSystem"
        :catalogue="data.catalogue"
      ></BattleScribeRoster> -->

      <!-- <BattleScribeUnit
        v-for="unit of data.units"
        :key="unit.name"
        class="p-2"
        :unit="unit"
        :library="data.library"
      >
      </BattleScribeUnit> -->

      <template v-if="data.models">
        <!-- <BattleScribeModel
          v-for="entry of data.models"
          :key="entry.id"
          :model="entry"
          :library="data.library"
        ></BattleScribeModel> -->
        <!-- <div v-for="entry of data.models" :key="entry.id">
          <div
            class="text-4xl font-barlow"
            style="
              letter-spacing: 0.1px;
              line-height: 1;
              text-transform: uppercase;
              z-index: 1;
              position: relative;
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 2px;
            "
          >
            {{ entry.name }}
            <span
              v-for="cost of entry.costs"
              :key="`${cost.value}-${cost.name}`"
              style="text-transform: initial; font-size: 1.2rem"
            >
              {{ cost.value }}{{ cost.name }}
            </span>
          </div>
          <div
            v-for="profile of entry.profiles.filter(
              (profile) => profile.typeName === 'Unit',
            )"
            :key="profile.name"
          >
            <div style="display: flex; gap: 1.2rem">
              <div
                v-for="characteristic of profile.characteristics"
                :key="characteristic.name"
                style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                "
              >
                <div
                  style="font-size: 0.9em; font-weight: 800"
                  class="text-center capitalize"
                >
                  {{ characteristic.name }}
                </div>
                <div
                  class="flex justify-center text-center text-dark font-barlow"
                  style="
                    padding: 2px;
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
                    class="bg-slate-600"
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
                    {{ characteristic["#text"] }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> -->
      </template>
    </div>
  </div>
</template>
