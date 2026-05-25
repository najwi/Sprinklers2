# CLAUDE.md

## Project overview

IoT sprinkler controller with two parts:

- **`esp/`** — ESP8266 Arduino/C++ firmware: serves the REST API and the Angular app from LittleFS flash storage
- **`sprinklers-app/`** — Angular 18 SPA that talks to the ESP's HTTP API
