#define DEBUG
#define DEBUG_NTPClient

#ifdef DEBUG
  #define DEBUG_PRINT(x)  Serial.print(x)
  #define DEBUG_PRINTLN(x) Serial.println(x)
#else
  #define DEBUG_PRINT(x)   // Do nothing
  #define DEBUG_PRINTLN(x) // Do nothing
#endif

#include <ESP8266WiFi.h>
#include <LittleFS.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <vector>
#include <map>
#include <algorithm>
#include "Sprinkler.h"
#include <TimeLib.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ESP8266HTTPClient.h>
#include "Secrets.h"

ESP8266WebServer server(80);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "tempus1.gum.gov.pl", 7200, 4 * 60 * 60 * 1000);

#include "SprinklerApi.h"
#include "ProfilesApi.h"

const int reconnectRetryTimeout = 10;

void setup() {
#ifdef DEBUG
  Serial.begin(115200);
#endif
  DEBUG_PRINTLN();
  DEBUG_PRINTLN("Starting");

  initPins();

  // Initialize LittleFS
  if (!LittleFS.begin()) {
    DEBUG_PRINTLN("Failed to mount file system");
    return;
  }

  // Connect to Wi-Fi
  WiFi.begin(SSID, PASSWORD);
  connectToWifi();

  defineRoutes();
  loadSprinklersConfig();
  loadProfilesConfig();
  timeClient.begin();

  server.begin();
}

void loop() {
  connectToWifi();
  timeClient.update();
  server.handleClient();
  updateSprinklers();
}

void connectToWifi() {
  if (WiFi.status() == WL_CONNECTED) return;
  
  DEBUG_PRINT("\nConnecting to WiFi");
  
  int retryCount = 0;
  
  while (WiFi.status() != WL_CONNECTED) {
    if (retryCount == reconnectRetryTimeout && timeClient.isTimeSet()){
      DEBUG_PRINTLN("\nReconnect timeout reached, continuing without wifi connection");
      return;
    }
    delay(1000);
    DEBUG_PRINT(".");
    retryCount++;
  }

  DEBUG_PRINTLN();
  DEBUG_PRINTLN("Connected to WiFi");
  DEBUG_PRINT("IP Address: ");
  DEBUG_PRINTLN(WiFi.localIP());
#ifdef DEBUG
  WiFi.printDiag(Serial);
#endif
}

void defineRoutes() {
  server.onNotFound(serveFile);
  server.on("/api/sprinklers", HTTP_GET, getSprinklers);
  server.on("/api/sprinklers", HTTP_POST, postSprinkler);
  server.on("/api/sprinklers", HTTP_DELETE, deleteSprinkler);
  server.on("/api/sprinklers", HTTP_PUT, putSprinkler);
  server.on("/api/profiles", HTTP_GET, getProfiles);
  server.on("/api/profiles", HTTP_POST, postProfile);
  server.on("/api/profiles", HTTP_DELETE, deleteProfile);
  server.on("/api/profiles", HTTP_PUT, putProfile);
  server.on("/api/time", HTTP_GET, getTime);
}

void getTime() {
  int time = timeClient.getEpochTime() % 86400;
  server.send(200, "text/plain", String(time));
}

// Function to determine the content type based on the file extension
String getContentType(String filename) {
  if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "text/javascript";
  else if (filename.endsWith(".svg")) return "image/svg+xml";
  else if (filename.endsWith(".png")) return "image/png";
  else if (filename.endsWith(".json")) return "application/json";
  else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
  return "text/plain";  // Default type if no match
}

// Function to serve a file based on the request
void serveFile() {
  String path = server.uri();
  if (path == "/" || path == "/settings") {
    path = "/index.html";
  }

  DEBUG_PRINTLN("PATH = " + path);

  if (!path.endsWith("index.html")){
    server.sendHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
  }

  String contentType = getContentType(path);
  
  if (LittleFS.exists(path+".gz")){
    path = path + ".gz";
    server.sendHeader("Content-Encoding", "gzip");
    DEBUG_PRINTLN("Setting .gz path = " + path);
  }

  // Open the requested file from LittleFS
  File file = LittleFS.open(path, "r");

  if (!file) {
    server.send(404, "text/plain", "404: File Not Found");
    return;
  }

  const size_t bufferSize = 4096;
  uint8_t* buffer = new uint8_t[bufferSize];

  server.setContentLength(file.size());
  server.send(200, contentType, "");

  // Read file in chunks and send to client
  while (file.available()) {
    size_t bytesRead = file.read(buffer, bufferSize);
    server.client().write(buffer, bytesRead);
  }

  delete[] buffer;
  file.close();
  DEBUG_PRINTLN("File served " + path);
}

void updateSprinklers() {
  std::map<String, bool> map;
  int time = timeClient.getEpochTime() % 86400;
  bool saveChanges = false;

  for (const Sprinkler& sprinkler : sprinklers) {
    map[sprinkler.id] = false;
  }

  for (Profile& profile : profiles) {
    for (Rule& rule : profile.rules) {
      // Automatic
      if (profile.isActive && rule.isActive) {
        if (rule.startTime < rule.endTime) {
          if (rule.startTime <= time && rule.endTime > time) {
            map[rule.sprinklerId] = true;
          }
        } else if (rule.startTime > rule.endTime) {
          if (rule.startTime <= time || rule.endTime > time) {
            map[rule.sprinklerId] = true;
          }
        }
      }

      // Manual
      if (rule.manualStartTime != -1) {
        int manualEndTime = (rule.manualStartTime + rule.manualDuration) % 86400;
        if (rule.manualStartTime < manualEndTime) {
          if (rule.manualStartTime <= time && manualEndTime > time) {
            map[rule.sprinklerId] = true;
          } else {
            rule.manualStartTime = -1;
            saveChanges = true;
          }
        } else {
          if (rule.manualStartTime <= time || manualEndTime > time) {
            map[rule.sprinklerId] = true;
          } else {
            rule.manualStartTime = -1;
            saveChanges = true;
          }
        }
      }
    }
  }

  for (const Sprinkler& sprinkler : sprinklers) {
    if (map[sprinkler.id]) {
      DEBUG_PRINTLN("Turning ON " + String(sprinkler.pinNumber));
      digitalWrite(getRealPin(sprinkler.pinNumber), LOW);
    } else {
      //DEBUG_PRINTLN("Turning OFF " + String(sprinkler.pinNumber));
      digitalWrite(getRealPin(sprinkler.pinNumber), HIGH);
    }
  }

  if (saveChanges) {
    saveProfilesConfig();
  }
}

void initPins() {
  pinMode(16, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(4, OUTPUT);
  pinMode(0, OUTPUT);
  pinMode(2, OUTPUT);
  pinMode(14, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(13, OUTPUT);
  pinMode(15, OUTPUT);
  disableAllPins();
}

void disableAllPins(){
  digitalWrite(16, HIGH);
  digitalWrite(5, HIGH);
  digitalWrite(4, HIGH);
  digitalWrite(0, HIGH);
  digitalWrite(2, HIGH);
  digitalWrite(14, HIGH);
  digitalWrite(12, HIGH);
  digitalWrite(13, HIGH);
  digitalWrite(15, HIGH);
}

int getRealPin(int pin) {
  int real_pin = -1;
  switch (pin) {
    case 0:
      real_pin = 16;
      break;
    case 1:
      real_pin = 5;
      break;
    case 2:
      real_pin = 4;
      break;
    case 3:
      real_pin = 0;
      break;
    case 4:
      real_pin = 2;
      break;
    case 5:
      real_pin = 14;
      break;
    case 6:
      real_pin = 12;
      break;
    case 7:
      real_pin = 13;
      break;
    case 8:
      real_pin = 15;
      break;
  }
  return real_pin;
}