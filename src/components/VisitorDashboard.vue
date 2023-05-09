<script lang="ts">
import { defineComponent } from "vue";
import Weather from "./Weather.vue";

// Logo

export default defineComponent({
  components: { Weather },
  name: "VisitorDashboard",

  data() {
    return {};
  },
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="5">
          <v-container fluid>
            <v-row justify="space-between">
              <v-col>
                <v-card title="Temperatur" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-white-balance-sunny"
                      color="yellow"
                      size="x-large"
                    />
                    <div class="text-h2 ml-4">17°C</div>
                  </div>
                </v-card>
              </v-col>
              <v-col>
                <v-card title="Luftfeuchtigkeit" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-water-outline"
                      color="blue"
                      size="x-large"
                    />
                    <div class="text-h2 ml-4">34%</div>
                  </div>
                </v-card>
              </v-col>
              <v-col>
                <v-card title="Wind" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon
                      icon="mdi-weather-windy"
                      color="grey"
                      size="x-large"
                    />
                    <div class="text-h2 ml-4">8km/h</div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card title="Besucherzahl" elevation="5">
          <v-container>
            <v-row>
              <v-col>
                <div class="d-flex align-center">
                  <div class="text-h2">187</div>
                  <v-icon icon="mdi-arrow-top-right ml-4" color="green" />
                </div>
              </v-col>
              <v-col> 2 </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <!-- <v-card title="B" elevation="5">
                        test
                    </v-card> -->
        <weather></weather>
      </v-col>
    </v-row>
  </v-container>
</template>
