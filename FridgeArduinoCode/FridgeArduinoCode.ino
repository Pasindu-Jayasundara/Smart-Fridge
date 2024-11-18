#include <WiFi.h>

void setup() {

  Serial.begin(115200);
  Serial.print("Connecting ");

  // connect to wifi using wifi name & password
  WiFi.begin("Pasindu's Galaxy M14","pasi1234");

  // if not connected keep trying to connect
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }

  // WiFi.localIp() => server ip
  Serial.println(WiFi.localIP());

}

void loop() {
}
