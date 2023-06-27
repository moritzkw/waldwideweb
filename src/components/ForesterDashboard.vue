<script lang="ts">
import { defineComponent } from "vue";
import Weather from "./Weather.vue";
import Temperature from "./Temperature.vue";
import { GChart } from "vue-google-charts";
import { GoogleMap, Marker, InfoWindow } from "vue3-google-map";

export default defineComponent({
  components: { Weather, GChart, Temperature, GoogleMap, Marker, InfoWindow },
  name: "ForesterDashboard",

  data() {
    return {
      center: { lat: 49.121945, lng: 9.211429 },
      // Array will be automatically processed with visualization.arrayToDataTable function
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
      hoveredNode: null as any,
      infoWindowPosition: null as null | { lat: number; lng: number; },
      infoWindowOptions: {},
      infoWindowNode: null as null | { [key: string]: any },
      mapCenter: null,
      mapZoom: null,
    };
  },

  methods: {

    openInfoWindow(node: any) {
      this.infoWindowNode = node;
      // Set the position and options of the info window based on the marker's position
      this.infoWindowPosition = { lat: node.latitude, lng: node.longitude };
      this.infoWindowOptions = { maxWidth: 320, maxHeight: 320 };
    },

    getMarkerOptions(node: any) {
      const latitude = parseFloat(node.latitude);
      const longitude = parseFloat(node.longitude);

      // Überprüfe, ob die Werte numerisch sind
      if (isNaN(latitude) || isNaN(longitude)) {
        console.error('Ungültige Längen- oder Breitengrade:', node.latitude, node.longitude);
        return null;
      }

      // Erstelle die Optionen für den Marker
      const markerOptions = {
        position: { lat: latitude, lng: longitude },
        isHovered: this.isNodeHovered(node),
      };

      return markerOptions;
    },

    isNodeHovered(node: any) {
      return this.hoveredNode !== null && this.hoveredNode !== undefined && this.hoveredNode.uuid === node.uuid;
    },

    setHoveredNode(node: any) {
      this.hoveredNode = node;
    },
    clearHoveredNode() {
      this.hoveredNode = null;
    },
    handleNodeClick(node: any) {
      // Führe hier die gewünschte Logik aus, wenn auf ein Node geklickt wird
      console.log('Node clicked:', node);

      
    },

    handleNodeHover(node: any) {
      // Setze den gehoverten Node im Zustand der Komponente
      this.hoveredNode = node;
    },
  },

  mounted() {
    console.debug(this.store.state
    )
  },
  computed: {
    store() {
      return this.$store;
    },
  },
},
);
</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card elevation="5">
          <v-container fluid>
            <v-row justify="space-between">
              <v-col>
                <Temperature></Temperature>
              </v-col>
              <v-col>
                <v-card class="card" title="Luftfeuchtigkeit" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-water-outline" color="blue" size="x-large" />
                    <div class="text-h2 ml-4">
                      {{ store.state.humidity.latest ? store.state.humidity.latest.value : "-" }}%
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col>
                <v-card class="card" title="Wind" elevation="0">
                  <div class="d-flex align-center">
                    <v-icon icon="mdi-weather-windy" color="grey" size="x-large" />
                    <div class="text-h2 ml-4">
                      {{ "-" }} km/h
                    </div>
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
        <v-card class="card" title="Sensoren" :elevation="5">
          <v-container>
            <GoogleMap api-key="AIzaSyBiaS391syegtj4i98-M0E7ylzmItDTDsc" style="height: 500px" :center="center"
              :zoom="15">

              <!-- Iteriere über die Nodes und erstelle Marker -->
              <Marker v-for="node in store.state.nodes" :key="node.id" :options="getMarkerOptions(node)"
                @click="handleNodeClick(node)" @mouseover="handleNodeHover(node)" @mouseout="clearHoveredNode">
                <InfoWindow  :options="infoWindowOptions">
                  <div>
                    <p><strong>Erstellt:</strong> {{ new Date(node.createdAt).toLocaleString() }}</p>
                    <p><strong>Längengrad:</strong> {{ node.latitude }}</p>
                    <p><strong>Breitengrad:</strong> {{ node.longitude }}</p>
                    <p><strong>UUID:</strong> {{ node.uuid }}</p>
                    <v-btn>Position bearbeiten</v-btn>
                  </div>
                </InfoWindow> </Marker>

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
