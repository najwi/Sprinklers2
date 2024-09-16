#include <ESP8266WiFi.h>
#include <LittleFS.h>

// Replace with your network credentials
const char* ssid = "TUX-NET";
const char* password = "REDACTED";

// Create a web server object
WiFiServer server(80);

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

  // Start the server
  server.begin();
}

// Function to determine the content type based on the file extension
String getContentType(String filename) {
  if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".svg")) return "image/svg+xml";
  else if (filename.endsWith(".png")) return "image/png";
  else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return "image/jpeg";
  return "text/plain";  // Default type if no match
}

// Function to serve a file based on the request
void serveFile(WiFiClient client, String path) {
  // If root path is requested, serve the index.html
  if (path == "/") {
    path = "/index.html";
  }

  Serial.println("PATH = " + path);

  // Open the requested file from LittleFS
  File file = LittleFS.open(path, "r");
  if (!file) {
    // If file is not found, send 404 response
    client.println("HTTP/1.1 404 Not Found");
    client.println("Content-Type: text/plain");
    client.println();
    client.println("404: File Not Found");
    return;
  }

  // Determine the content type
  String contentType = getContentType(path);

  // Send HTTP headers
  client.println("HTTP/1.1 200 OK");
  client.println("Content-Type: " + contentType);
  client.println("Connection: close");
  client.println();

  // Define a buffer size
  const size_t bufferSize = 4096;
  uint8_t buffer[bufferSize];
  size_t bytesRead;

  // Read and write file content in chunks
  while ((bytesRead = file.read(buffer, bufferSize)) > 0) {
    client.write(buffer, bytesRead);
  }

  Serial.println("File served successfully. " + path);

  // Close the file
  file.close();
}

void loop() {
  // Check if a client has connected
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  // Wait for the client to send a request
  while (!client.available()) {
    delay(1);
  }

  // Read the request
  String request = client.readStringUntil('\r');
  Serial.println(request);
  client.flush();  // Clear remaining request data

  // Extract the requested file path from the request
  String path = "/";
  if (request.startsWith("GET ")) {
    int startPos = request.indexOf(' ') + 1;
    int endPos = request.indexOf(' ', startPos);
    path = request.substring(startPos, endPos);
  }

  // Serve the requested file
  serveFile(client, path);

  // Satisfy browser
  while (client.available()) {
    client.read();
  }

  // Close the connection
  client.stop();
  Serial.println("Client disconnected");
}
