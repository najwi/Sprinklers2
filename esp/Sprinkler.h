#include <ArduinoJson.h>
#include <Arduino.h>

struct Sprinkler
{
    int pinNumber;
    String name;
    String id;

    void fromJson(const JsonVariant doc)
    {
      pinNumber = doc["pinNumber"].as<int>();
      name = doc["name"].as<String>();
      id = doc["id"].as<String>();
    }

    void addToArray(const JsonArray array) const{
      JsonObject obj = array.add<JsonObject>();
      obj["pinNumber"] = pinNumber;
      obj["name"] = name;
      obj["id"] = id;
    }
};
