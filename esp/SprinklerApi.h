std::vector<Sprinkler> sprinklers;

void getAllSprinklersJson(String& json){
  JsonDocument doc;
  JsonArray array = doc.to<JsonArray>();
  
  for(Sprinkler& item : sprinklers){
    item.addToArray(array);
  }

  serializeJson(doc, json);
}

void saveSprinklersConfig(){
  String json;
  getAllSprinklersJson(json);
  File file = LittleFS.open("/sprinklers_config.json", "w");
  file.print(json);
  file.close();
}

void putSprinkler(){
  String id = server.arg("id");

  auto it = std::find_if(sprinklers.begin(), sprinklers.end(), [&id](const auto& item){
    return item.id == id;
  });

  if(it == sprinklers.end()){
    server.send(404);
    return;
  }

  String body = server.arg("plain");
  JsonDocument doc;
  deserializeJson(doc, body);

  it->fromJson(doc.as<JsonVariant>());

  saveSprinklersConfig();
  server.send(202);
}

void deleteSprinkler(){
  String id = server.arg("id");
  
  auto it = std::find_if(sprinklers.cbegin(), sprinklers.cend(), [&id](const auto& item){
    return item.id == id;
  });

  if(it == sprinklers.cend()){
    server.send(404);
    return;
  }

  sprinklers.erase(it);
  saveSprinklersConfig();
  server.send(202);
}

void postSprinkler(){
  String body = server.arg("plain");
  JsonDocument doc;
  deserializeJson(doc, body);
  Sprinkler item;
  item.fromJson(doc.as<JsonVariant>());
  sprinklers.push_back(std::move(item));

  saveSprinklersConfig();
  server.send(201);
}

void getSprinklers(){
  String json;
  getAllSprinklersJson(json);
  server.send(200, "application/json", json);
}

void loadSprinklersConfig(){
  JsonDocument doc;
  File file = LittleFS.open("/sprinklers_config.json", "r");

  if(!file){
    Serial.println("Sprinklers config file not found");
    return;
  }

  deserializeJson(doc, file);

  for(JsonVariant item : doc.as<JsonArray>()){
    Sprinkler s;
    s.fromJson(item);
    sprinklers.push_back(std::move(s));
  }

  file.close();
}
