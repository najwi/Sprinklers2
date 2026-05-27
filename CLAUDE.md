# CLAUDE.md

## Project overview

IoT sprinkler controller with two parts:

- **`esp/`** — ESP8266 Arduino/C++ firmware: serves the REST API and the Angular app from LittleFS flash storage
- **`sprinklers-app/`** — Angular 18 SPA that talks to the ESP's HTTP API
- **`api_mock/`** — Node.js mock server (`server.js`) mirroring the ESP REST API for local frontend dev; `proxy.conf.json` rewrites `/api/*` → `http://localhost:3000/*`
