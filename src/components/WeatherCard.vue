<script lang="ts">
import { defineComponent } from "vue";
import Temperature from "./Temperature.vue";
import Humidity from "./Humidity.vue";

export default defineComponent({
  components: { Temperature, Humidity },
  name: "WeatherCard",
  computed: {
    store() {
      return this.$store;
    },
  }});
</script>

<template>
  <v-row>
    <v-col>
      <v-card elevation="5">
        <v-container fluid>
          <v-row justify="space-between">
            <v-col>
              <v-card class="card" title="Temperatur" :elevation="0">
                <div class="d-flex align-center">
                  <v-icon
                    icon="mdi-white-balance-sunny"
                    color="yellow"
                    size="x-large"
                  />
                  <div class="text-h2 ml-4">
                    {{
                      store.state.temperature.latest
                        ? parseFloat(
                            store.state.temperature.latest.value
                          ).toFixed(1)
                        : "-"
                    }}°C
                  </div>
                </div>
                <Temperature></Temperature>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="card" title="Luftfeuchtigkeit" elevation="0">
                <div class="d-flex align-center">
                  <v-icon
                    icon="mdi-water-outline"
                    color="blue"
                    size="x-large"
                  />
                  <div class="text-h2 ml-4">
                    {{
                      store.state.humidity.latest
                        ? parseFloat(store.state.humidity.latest.value).toFixed(
                            1
                          )
                        : "-"
                    }}%
                  </div>
                </div>
                <Humidity></Humidity>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="card" title="Wind" elevation="0">
                <div class="d-flex align-center">
                  <v-icon
                    icon="mdi-weather-windy"
                    color="grey"
                    size="x-large"
                  />
                  <div class="text-h4 ml-4">Bald verfügbar</div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-col>
  </v-row>
</template>