#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

class Clock {
public:
  unsigned int time;

  void init() {
    WiFiClientSecure client;
    client.setInsecure();
    HTTPClient http;
    http.begin(client, "https://timeapi.io/api/time/current/zone?timeZone=Europe%2FWarsaw");
    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      JsonDocument doc;
      deserializeJson(doc, payload);

      time = doc["seconds"].as<int>();
      time += doc["minute"].as<int>() * 60;
      time += doc["hour"].as<int>() * 3600;

      Serial.println(time);
      Serial.println(payload);
    } else {
      Serial.println("HTTP error " + httpCode);
    }
    http.end();
  }

  void update(){
    auto uptime = millis();
    Serial.println(uptime / 1000);
  }
};