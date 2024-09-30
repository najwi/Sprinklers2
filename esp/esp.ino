#include <ESP8266WiFi.h>
#include <LittleFS.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <vector>
#include <algorithm>
#include "Sprinkler.h"
#include <TimeLib.h>
#include <WiFiUdp.h>
#include <NTPClient.h>
#include <ESP8266HTTPClient.h>

ESP8266WebServer server(80);

#include "SprinklerApi.h"
#include "ProfilesApi.h"

const char* ssid = "TUX-NET";
const char* password = "REDACTED";
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "tempus1.gum.gov.pl", 0, 4 * 60 * 60 * 1000);

void setup() {
  Serial.begin(115200);

  // Initialize LittleFS
  if (!LittleFS.begin()) {
    Serial.println("Failed to mount file system");
    return;
  }

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("\nConnecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Connected to WiFi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  defineRoutes();
  loadSprinklersConfig();
  loadProfilesConfig();
  initTime();

  server.begin();
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

  Serial.println("PATH = " + path);

  // Open the requested file from LittleFS
  File file = LittleFS.open(path, "r");

  if (!file) {
    server.send(404, "text/plain", "404: File Not Found");
    return;
  }

  String contentType = getContentType(path);
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
  Serial.println("File served " + path);
}

void initTime() {
  WiFiClientSecure client;
  client.setInsecure();
  HTTPClient http;
  http.begin(client, "https://timeapi.io/api/timezone/zone?timeZone=Europe%2FWarsaw");

  if (http.GET() == 200) {
    String payload = http.getString();
    JsonDocument doc;
    deserializeJson(doc, payload);
    int offset = doc["currentUtcOffset"]["seconds"].as<int>();
    timeClient.setTimeOffset(offset);
  }

  timeClient.begin();
}

void loop() {
  timeClient.update();
  server.handleClient();
}
