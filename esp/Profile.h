#include <algorithm>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <vector>

struct Rule {
  String sprinklerId;
  String name;
  bool isActive;
  String startTime;
  String endTime;
  bool isManualOn;
  String manualTime;

  void fromJson(const JsonVariant doc) {
    sprinklerId = doc["sprinklerId"].as<String>();
    name = doc["name"].as<String>();
    isActive = doc["isActive"].as<bool>();
    startTime = doc["startTime"].as<String>();
    endTime = doc["endTime"].as<String>();
    isManualOn = doc["isManualOn"].as<bool>();
    manualTime = doc["manualTime"].as<String>();
  }

  void addToArray(JsonArray array) const {
    JsonObject obj = array.add<JsonObject>();
    obj["SprinklerId"] = sprinklerId;
    obj["name"] = name;
    obj["isActive"] = isActive;
    obj["startTime"] = startTime;
    obj["endTime"] = endTime;
    obj["isManualOn"] = isManualOn;
    obj["manualTime"] = manualTime;
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
