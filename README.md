# Sprinklers

IoT sprinkler controller for ESP8266. The ESP serves a REST API and an Angular SPA from LittleFS flash storage.

## Hardware

- ESP8266 (e.g. NodeMCU or Wemos D1 Mini)
- 8-channel relay module (active-LOW)

## Prerequisites

### Firmware

- [Arduino IDE](https://www.arduino.cc/en/software) with the **ESP8266 Arduino core** installed
  - Board Manager URL: `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
  - Board: **NodeMCU 1.0 (ESP-12E Module)** (or your variant)
- [LittleFS Filesystem Uploader plugin](https://github.com/earlephilhower/arduino-littlefs-upload) for Arduino IDE 2.x
- Required Arduino libraries (install via Library Manager):
  - `ArduinoJson`
  - `NTPClient`
  - `Time`

### Frontend

- Node.js 18+ and npm
- `gzip` on your PATH (Linux/macOS built-in; Windows: use Git Bash or WSL)

## Setup

### 1. WiFi credentials

Create `esp/Secrets.h` (excluded from source control):

```cpp
#define SSID "your-wifi-ssid"
#define PASSWORD "your-wifi-password"
```

### 2. Build and prepare filesystem

```bash
npm install --prefix sprinklers-app
bash build.sh
```

`build.sh` builds the Angular app, copies the output to `esp/data/`, and gzips all assets.

### 3. Upload LittleFS filesystem

Open `esp/esp.ino` in Arduino IDE, then:

`Ctrl+Shift+P` → **Upload LittleFS Filesystem Image**

This flashes all files in `esp/data/` to the ESP's LittleFS partition.

### 4. Flash the firmware

**Sketch → Upload** (`Ctrl+U`)

The ESP will connect to WiFi, sync time via NTP, and start serving the app on port 80.

## Development

Run the Angular dev server against the mock API (no hardware required):

```bash
cd sprinklers-app
npm install
npm run start:mock
```

## Project structure

```
esp/                   ESP8266 firmware (Arduino)
  esp.ino              Entry point — WiFi, NTP, routes, sprinkler loop
  Sprinkler.h          Sprinkler data model
  Profile.h            Profile/Rule data model
  SprinklerApi.h       REST CRUD for /api/sprinklers
  ProfilesApi.h        REST CRUD for /api/profiles
  Secrets.h            WiFi credentials (not committed)
  data/                Files served from LittleFS (populated by build.sh)
sprinklers-app/        Angular 18 SPA
api_mock/              Local Express mock API for frontend development
build.sh               Build Angular → copy → gzip → esp/data/
```

## Notes

- Relay module is active-LOW: GPIO `HIGH` = off, `LOW` = on.
- Times are stored as seconds since midnight (0–86399).
- NTP server: `tempus1.gum.gov.pl`, UTC+2 offset hardcoded in `esp.ino`.
- Gzipped files in LittleFS are served with `Content-Encoding: gzip` automatically; non-index files get a 1-year cache header.
