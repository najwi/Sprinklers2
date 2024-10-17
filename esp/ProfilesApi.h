#include "Profile.h"

std::vector<Profile> profiles;

void getAllProfilesJson(String& json){
  JsonDocument doc;
  JsonArray array = doc.to<JsonArray>();
  
  for(Profile& item : profiles){
    item.addToArray(array);
  }

  serializeJson(doc, json);
}

void saveProfilesConfig(){
  String json;
  getAllProfilesJson(json);
  DEBUG_PRINTLN("Profiles json for save: " + json);
  File file = LittleFS.open("/profiles_config.json", "w");
  file.print(json);
  file.close();
}

void putProfile(){
  String body = server.arg("plain");
  JsonDocument doc;
  deserializeJson(doc, body);
  String id = doc["id"].as<String>();

  auto it = std::find_if(profiles.begin(), profiles.end(), [&id](const auto& item){
    return item.id == id;
  });

  if (it == profiles.end()){
    server.send(404);
    return;
  }

  DEBUG_PRINTLN("Rules count in doc: " + String(doc["rules"].as<JsonArray>().size()));

  it->fromJson(doc.as<JsonVariant>());

  DEBUG_PRINTLN("Rules count in created object: " + String(it->rules.size()));

  saveProfilesConfig();
  server.send(202);
}

void deleteProfile(){
  String id = server.arg("id");
  
  auto it = std::find_if(profiles.cbegin(), profiles.cend(), [&id](const auto& item){
    return item.id == id;
  });

  if(it == profiles.cend()){
    server.send(404);
    return;
  }

  profiles.erase(it);
  saveProfilesConfig();
  server.send(202);
}

void postProfile(){
  String body = server.arg("plain");
  JsonDocument doc;
  deserializeJson(doc, body);
  Profile item;
  item.fromJson(doc.as<JsonVariant>());
  profiles.push_back(std::move(item));

  saveProfilesConfig();
  server.send(201);
}

void getProfiles(){
  String json;
  getAllProfilesJson(json);
  server.send(200, "application/json", json);
}

void loadProfilesConfig(){
  JsonDocument doc;
  File file = LittleFS.open("/profiles_config.json", "r");

  if(!file){
    DEBUG_PRINTLN("Profiles config file not found");
    return;
  }

  deserializeJson(doc, file);

  for(JsonVariant item : doc.as<JsonArray>()){
    Profile p;
    p.fromJson(item);
    profiles.push_back(std::move(p));
  }

  file.close();
}
