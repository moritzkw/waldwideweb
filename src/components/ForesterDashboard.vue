<script lang="ts">
import { defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import { GChart } from "vue-google-charts";
import { GoogleMap, Marker, InfoWindow } from "vue3-google-map";
import WeatherCardVue from "./WeatherCard.vue";

export default defineComponent({
  components: { Weather, GChart, Temperature, GoogleMap, Marker, InfoWindow, WeatherCardVue },
  name: "ForesterDashboard",

  data() {
    return {
      editingNode: null as Node | null,
      editingPosition: null as { lat: number; long: number } | null,
      center: { lat: 49.118617, lng: 9.254468 },
      forestAreas: ["Wald A", "Wald B", "Wald C", "Wald D", "Wald E"],
      chartData: [
        ["Tag", "Besucher"],
        ["Donnerstag", 83],
        ["Freitag", 147],
        ["Samstag", 154],
        ["Sonntag", 169],
        ["Montag", 65],
        ["Dienstag", 49],
        ["Mittwoch", 72],
      ],
      chartOptions: {
        chart: {
          title: "Company Performance",
          subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
        // pointsVisible: true,
        legend: {
          position: "none",
        },
        hAxis: {
          baselineColor: "none",
          textPosition: "none",
          gridlines: { count: "0" },
          minorGridlines: { count: "0" },
        },
        vAxis: {
          textPosition: "none",
          gridlines: { count: "0" },
          minorGridlines: { count: "0" },
        },
        // curveType: 'function'
      },
      infoWindowPosition: null as null | { lat: number; lng: number },
      infoWindowOptions: {},
      infoWindowNode: null as null | { [key: string]: any },
      mapCenter: null,
      mapZoom: null,
    };
  },

  methods: {
    openInfoWindow(node: any) {
      this.infoWindowNode = node;
      this.infoWindowPosition = { lat: node.latitude, lng: node.longitude };
      this.infoWindowOptions = { maxWidth: 320, maxHeight: 320 };
    },

    getMarkerOptions(node: any) {
      const latitude = parseFloat(node.latitude);
      const longitude = parseFloat(node.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        console.error(
          "Ungültige Längen- oder Breitengrade:",
          node.latitude,
          node.longitude
        );
        return null;
      }

      const markerOptions = {
        position: { lat: latitude, lng: longitude },
        draggable: this.isNodeDraggable(node),
      };

      return markerOptions;
    },
    isNodeDraggable(node: any) {
      return this.editingNode === node;
    },
    handlePositionButtonClick(node: any) {
      if (this.editingNode === node) {
        this.store.commit("updateNode", {
          node: node,
          latitude: this.editingPosition.lat,
          longitude: this.editingPosition.long,
        });
        this.editingNode = null;
        this.editingPosition = null;
      } else {
        this.editingNode = node;
      }
    },
    handleDragEnd(event: any) {
      this.editingPosition = {
        lat: event.latLng.lat(),
        long: event.latLng.lng(),
      };
    },
  },
  mounted() {
    this.store.commit("fetchForForester");
  },
  computed: {
    store() {
      return this.$store;
    },
  },
});
</script>

<template>
  <v-container>
    <WeatherCardVue></WeatherCardVue>
    <v-row>
      <v-col>
        <v-card class="card" title="Sensoren" :elevation="5">
          <v-container>
            <GoogleMap api-key="AIzaSyBiaS391syegtj4i98-M0E7ylzmItDTDsc" style="height: 500px" :center="center"
              :zoom="14">
              <Marker v-for="node in store.state.nodes" :key="node.uuid" :options="getMarkerOptions(node)"
                @dragend="handleDragEnd">
                <InfoWindow :options="infoWindowOptions">
                  <div>
                    <div>
                      <h3 v-bind:title="node.uuid">Gerät ID:</h3>
                      <p>{{ node.uuid }}</p>
                    </div>
                    <br />
                    <p>
                      <strong>Erstellt:</strong>
                      {{ new Date(node.createdAt).toLocaleString() }}
                    </p>
                    <p v-if="node.updatedAt">
                      <strong>Aktualisiert:</strong>
                      {{ new Date(node.updatedAt).toLocaleString() }}
                    </p>
                    <p><strong>Längengrad:</strong> {{ node.latitude }}</p>
                    <p><strong>Breitengrad:</strong> {{ node.longitude }}</p>
                    <br />
                    <div class="text-center">
                      <v-btn variant="tonal" size="small" block rounded="xl" @click="handlePositionButtonClick(node)">
                        {{
                          editingNode === node
                          ? "Position Speichern"
                          : "Position bearbeiten"
                        }}
                      </v-btn>
                    </div>
                  </div>
                </InfoWindow>
              </Marker>
            </GoogleMap>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="card" title="Besucherzahl" :elevation="5">
          <v-container>
            <v-row>
              <v-col>
                <div class="d-flex align-center">
                  <div class="text-h2">
                    {{ "-" }}
                  </div>
                  <v-icon icon="mdi-arrow-top-right ml-4" color="green" />
                </div>
              </v-col>
              <v-col>
                <GChart type="LineChart" :data="chartData" :options="chartOptions" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="card" title="Waldgebiet" :elevation="5">
          <p class="pa-6">
            Wählen Sie das Waldgebiet aus, für das Sie die aktuellen Messwerte
            anzeigen wollen.
          </p>
          <v-combobox class="px-6" label="Waldgebiet auswählen" :items="forestAreas"></v-combobox>
        </v-card>
        <!-- <weather></weather> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.card:hover {
  cursor: pointer;
}

.node-overlay {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}
</style>
