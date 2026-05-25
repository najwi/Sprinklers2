#include <algorithm>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <vector>

struct Rule {
  String sprinklerId;
  String name;
  bool isActive;
  int startTime;
  int endTime;
  int manualStartTime;
  int manualDuration;
  int dayInterval;

  void fromJson(const JsonVariant doc) {
    sprinklerId = doc["sprinklerId"].as<String>();
    name = doc["name"].as<String>();
    isActive = doc["isActive"].as<bool>();
    startTime = doc["startTime"].as<int>();
    endTime = doc["endTime"].as<int>();
    manualDuration = doc["manualDuration"].as<int>();
    manualStartTime = doc["manualStartTime"].as<int>();
    dayInterval = doc["dayInterval"] | 1;
    if (manualStartTime == -2) {
      manualStartTime = timeClient.getEpochTime() % 86400;
    }
  }

  void addToArray(JsonArray array) const {
    JsonObject obj = array.add<JsonObject>();
    obj["sprinklerId"] = sprinklerId;
    obj["name"] = name;
    obj["isActive"] = isActive;
    obj["startTime"] = startTime;
    obj["endTime"] = endTime;
    obj["manualStartTime"] = manualStartTime;
    obj["manualDuration"] = manualDuration;
    obj["dayInterval"] = dayInterval;
  }
};

struct Profile {
  String id;
  String name;
  bool isActive;
  std::vector<Rule> rules;

  void fromJson(const JsonVariant doc) {
    id = doc["id"].as<String>();
    name = doc["name"].as<String>();
    isActive = doc["isActive"].as<bool>();

    rules.clear();
    for (JsonVariant ruleDoc : doc["rules"].as<JsonArray>()) {
      Rule rule;
      rule.fromJson(ruleDoc);
      rules.push_back(std::move(rule));
    }
  }

  void addToArray(JsonArray array) const {
    JsonObject obj = array.add<JsonObject>();
    obj["id"] = id;
    obj["name"] = name;
    obj["isActive"] = isActive;

    JsonArray rulesArray = obj["rules"].to<JsonArray>();
    for (const Rule& rule : rules) {
      rule.addToArray(rulesArray);
    }
  }
};
