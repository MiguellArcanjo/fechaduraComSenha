#include <ESP32Servo.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

Servo myServo;

const char* ssid = "brisa-3647547";
const char* password = "cbcdrohk";
const char* passwordEndpoint = "http://192.168.0.10:3333/password";
const char* deleteEndpoint = "http://192.168.0.10:3333/password/"; 

const int ledPinVerde = 18; 
const int ledPinVermelho = 12; 
const int servoPin = 13; 

int pos = 90; 
String storedPassword = "321";

void setup() {
  Serial.begin(115200);
  myServo.attach(servoPin); 
  pinMode(ledPinVerde, OUTPUT);  
  pinMode(ledPinVermelho, OUTPUT);  

  myServo.write(pos); 

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Conectado ao WiFi");
}

void loop() {
  if (shouldCheckPassword()) { 
    HTTPClient http;
  
    if (!http.begin(passwordEndpoint)) {
      Serial.println("Falha ao iniciar a requisição HTTP");
      return;
    }
  
    int httpCode = http.GET();
  
    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) { 
        String payload = http.getString();
        Serial.println("Resposta do servidor:");
        Serial.println(payload);
        
        DynamicJsonDocument doc(1024); 
        DeserializationError error = deserializeJson(doc, payload);
        if (error) {
          Serial.print("Falha ao parsear JSON: ");
          Serial.println(error.c_str());
          return;
        }
        
        JsonArray values = doc["values"].as<JsonArray>();
        if (values.size() > 0) {
          JsonObject firstValue = values[0];
          String receivedPassword = firstValue["senha"].as<String>();
          int receivedId = firstValue["id"].as<int>();
          
          if (receivedPassword == storedPassword) {
            Serial.println("Senha correta. Executando ação.");
            performAction(receivedId); 
          } else {
            Serial.println("Senha incorreta.");
            deletePassword(receivedId);
          }
        } else {
          Serial.println("Nenhum valor encontrado no JSON.");
        }

      } else {
        Serial.printf("Erro na requisição: %d\n", httpCode);
      }
    } else {
      Serial.printf("Erro na requisição HTTP: %s\n", http.errorToString(httpCode).c_str());
    }
  
    http.end();
  }
  
  delay(2000); 
}

bool shouldCheckPassword() {
  return true; 
}

void performAction(int id) {

  for (pos = 90; pos <= 180; pos += 1) {
    myServo.write(pos);
    digitalWrite(ledPinVerde, LOW); 
    digitalWrite(ledPinVermelho, HIGH);
    delay(15); 
  }
  delay(2000); 

  deletePassword(id);

  for (pos = 180; pos >= 0; pos -= 1) {
    myServo.write(pos);
    digitalWrite(ledPinVerde, HIGH); 
    digitalWrite(ledPinVermelho, LOW);
    delay(15); 
  }
  delay(1000); 
}

void deletePassword(int id) {
  HTTPClient http;
  String url = String(deleteEndpoint) + String(id);

  if (!http.begin(url)) {
    Serial.println("Falha ao iniciar a requisição HTTP para deletar senha");
    return;
  }

  http.addHeader("Content-Type", "application/json");
  int httpCode = http.sendRequest("DELETE");

  http.end();
}
