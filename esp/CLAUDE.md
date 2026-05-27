# CLAUDE.md

## Architecture

The firmware is split across header files `#include`d by `esp.ino` in order:

- `Sprinkler.h` / `Profile.h` — data structs; serialization via ArduinoJson `fromJson`/`addToArray`
- `SprinklerApi.h` — CRUD for `/api/sprinklers`, persists to `/sprinklers_config.json` in LittleFS
- `ProfilesApi.h` — CRUD for `/api/profiles`, persists to `/profiles_config.json` in LittleFS
- `Secrets.h` — WiFi SSID and PASSWORD (not in source control; create locally)

`esp.ino` handles: WiFi connection, NTP, HTTP route registration, file serving, and the `updateSprinklers()` loop that reads current time and toggles GPIO pins.

## Key conventions

**Pin mapping:** Sprinklers store a virtual pin number (0–8); `getRealPin()` maps these to actual ESP8266 GPIO numbers. Relay modules are active-LOW: `HIGH` = off, `LOW` = on.

**Time:** All times are seconds since midnight (0–86399). NTP server is `tempus1.gum.gov.pl` with a hardcoded UTC+2 offset (7200 s).

**Manual override:** A Rule with `manualStartTime = -2` signals the firmware to use the current epoch time as the manual start time.

**Adding a Rule field:** Touch 4 places in `Profile.h` (struct declaration, `fromJson`, `addToArray`) + `esp.ino` (`updateSprinklers()` scheduling logic). `ProfilesApi.h` needs no change — it delegates to `Rule`. Default missing fields in `fromJson` with `| <default>` to keep existing `/profiles_config.json` compatible.

**Static file serving:** `serveFile()` appends `.gz` to the path if a gzipped version exists in LittleFS and sets the `Content-Encoding: gzip` header. All non-index files get a 1-year cache header.
