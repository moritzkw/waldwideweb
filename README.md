# WaldWideWeb

## Features
### Allgemein
- Dark & Light Mode über Icon oben rechts
- Responsivität: Alle Seiten können unabhängig von der Bildschirmgröße dargestellt werden
### Besucher Dashboard
- Kein Login für das Besucher Dashboard benötigt (Landingpage)
- Teperature & Luftfeuchtigkeit mit Daten aus dem Backend dargestellt
- Wind & Besucherzahl werden angebunden, sobald die Sensoren die Werte zur Verfügung stellen
- Detailansicht für Temperature & Luftfeuchtigkeit durch Klick verfügbar
- In Detailsansicht Tagesverlauf & Tagesdurchschnitt, Minimal- und Maximalwert der Messwerte für die letzten 7 Tage sichtbar
- Login über icon oben Rechts möglich
### Förster Dashboard
- Nur für angemeldete Förster erreichbar
- Über Icon oben rechts Abmeldung möglich
- Bei erneutem Aufruf der Seite ist man dank Cookies immernoch angemeldet
- Selbe Datendarstellung wie im Besucher Dashboard
- Karte mit Übersicht aller Sensoren
- Durch Klicken auf die Sensor-Marker auf der Karte werden Sensor Details in Popup angezeigt
- Über dieses Popup kann die Position bearbeitet werden
- Dabei kann der Positions-Marker auf der Karte verschoben und die neue Position mit Klick auf den Button gespeichert werden
### Admin Dashboard
- Nur für angemeldete Admins erreichbar
- Über Icon oben rechts Abmeldung möglich
- Bei erneutem Aufruf der Seite ist man dank Cookies immernoch angemeldet
- Anzeige der aktuellen Firmware-Version mit dessen Upload-Datum
- Durch Datei-Input kann eine neue Firmware in Form einer binär-Datei mit der geswünschten Versionsnummer hochgeladen werden
- Anzeige aller Nutzer mit deren zugewiesen Nutzerrolle in einer Liste
- Über Button kann ein neuer Nutzer hinzugefügt werden
- Jeder Nutzer kann über das entsprechende Icon gelöscht werden
- Über ein anders Icon kann der Nutzer bearbeitet werden (Nutzername, Passwort und Nutzerrolle)

# Vue 3 + TypeScript + Vite

[![status-badge](https://ci.haveachin.de/api/badges/haveachin/waldwideweb/status.svg)](https://ci.haveachin.de/haveachin/waldwideweb)

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
