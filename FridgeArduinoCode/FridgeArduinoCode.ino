#include <HTTPClient.h>

#include <Arduino_JSON.h>

#include <WiFi.h>
#include <WiFiClient.h>

#include <HX711_ADC.h>
#if defined(ESP8266) || defined(ESP32) || defined(AVR)
#include <EEPROM.h>
#endif

#include <dht11.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels



// .................. weight sensor - start .................. //
const int HX711_dout = 15;  //mcu > HX711 dout pin
const int HX711_sck = 4;    //mcu > HX711 sck pin

HX711_ADC LoadCell(HX711_dout, HX711_sck);

const int calVal_eepromAdress = 0;
unsigned long t = 0;

void weight() {
  LoadCell.begin();
  LoadCell.setReverseOutput();           //uncomment to turn a negative output value to positive
  unsigned long stabilizingtime = 2000;  // preciscion right after power-up can be improved by adding a few seconds of stabilizing time
  boolean _tare = true;                  //set this to false if you don't want tare to be performed in the next step
  LoadCell.start(stabilizingtime, _tare);
  if (LoadCell.getTareTimeoutFlag() || LoadCell.getSignalTimeoutFlag()) {
    Serial.println("Timeout, check MCU>HX711 wiring and pin designations");
    while (1)
      ;
  } else {
    LoadCell.setCalFactor(1.0);  // user set calibration value (float), initial value 1.0 may be used for this sketch
    Serial.println("Startup is complete");
  }
  while (!LoadCell.update())
    ;
  calibrate();  //start calibration procedure
}

float weightValue = 0.0;
void getWeight(void* vParameters) {
  while (true) {
    static boolean newDataReady = 0;
    const int serialPrintInterval = 5;  //increase value to slow down serial print activity

    // check for new data/start next conversion:
    if (LoadCell.update()) newDataReady = true;

    // get smoothed value from the dataset:
    if (newDataReady) {
      if (millis() > t + serialPrintInterval) {
        float i = LoadCell.getData();
        Serial.print("Load_cell output val: ");
        Serial.println(i);

        weightValue = i / 1000;
        newDataReady = 0;
        t = millis();
      }
    }

    // receive command from serial terminal
    if (Serial.available() > 0) {
      char inByte = Serial.read();
      if (inByte == 't') LoadCell.tareNoDelay();       //tare
      else if (inByte == 'r') calibrate();             //calibrate
      else if (inByte == 'c') changeSavedCalFactor();  //edit calibration value manually
    }

    // check if last tare operation is complete
    if (LoadCell.getTareStatus() == true) {
      Serial.println("Tare complete");
    }

    vTaskDelay(20000 / portTICK_PERIOD_MS);  // FreeRTOS delay, non-blocking
  }
}

void calibrate() {
  Serial.println("***");
  Serial.println("Start calibration:");
  Serial.println("Place the load cell an a level stable surface.");
  Serial.println("Remove any load applied to the load cell.");
  Serial.println("Send 't' from serial monitor to set the tare offset.");

  boolean _resume = false;
  while (_resume == false) {
    LoadCell.update();
    if (Serial.available() > 0) {
      if (Serial.available() > 0) {
        char inByte = Serial.read();
        if (inByte == 't') LoadCell.tareNoDelay();
      }
    }
    if (LoadCell.getTareStatus() == true) {
      Serial.println("Tare complete");
      _resume = true;
    }
  }

  Serial.println("Now, place your known mass on the loadcell.");
  Serial.println("Then send the weight of this mass (i.e. 100.0) from serial monitor.");

  float known_mass = 0;
  _resume = false;
  while (_resume == false) {
    LoadCell.update();
    if (Serial.available() > 0) {
      known_mass = Serial.parseFloat();
      if (known_mass != 0) {
        Serial.print("Known mass is: ");
        Serial.println(known_mass);
        _resume = true;
      }
    }
  }

  LoadCell.refreshDataSet();                                           //refresh the dataset to be sure that the known mass is measured correct
  float newCalibrationValue = LoadCell.getNewCalibration(known_mass);  //get the new calibration value

  Serial.print("New calibration value has been set to: ");
  Serial.print(newCalibrationValue);
  Serial.println(", use this as calibration value (calFactor) in your project sketch.");
  Serial.print("Save this value to EEPROM adress ");
  Serial.print(calVal_eepromAdress);
  Serial.println("? y/n");

  _resume = false;
  while (_resume == false) {
    if (Serial.available() > 0) {
      char inByte = Serial.read();
      if (inByte == 'y') {
        #if defined(ESP8266) || defined(ESP32)
                EEPROM.begin(512);
        #endif
                EEPROM.put(calVal_eepromAdress, newCalibrationValue);
        #if defined(ESP8266) || defined(ESP32)
                EEPROM.commit();
        #endif
        EEPROM.get(calVal_eepromAdress, newCalibrationValue);
        Serial.print("Value ");
        Serial.print(newCalibrationValue);
        Serial.print(" saved to EEPROM address: ");
        Serial.println(calVal_eepromAdress);
        _resume = true;

      } else if (inByte == 'n') {
        Serial.println("Value not saved to EEPROM");
        _resume = true;
      }
    }
  }

  Serial.println("End calibration");
  Serial.println("***");
  Serial.println("To re-calibrate, send 'r' from serial monitor.");
  Serial.println("For manual edit of the calibration value, send 'c' from serial monitor.");
  Serial.println("***");
}

void changeSavedCalFactor() {
  float oldCalibrationValue = LoadCell.getCalFactor();
  boolean _resume = false;
  Serial.println("***");
  Serial.print("Current value is: ");
  Serial.println(oldCalibrationValue);
  Serial.println("Now, send the new value from serial monitor, i.e. 696.0");
  float newCalibrationValue;
  while (_resume == false) {
    if (Serial.available() > 0) {
      newCalibrationValue = Serial.parseFloat();
      if (newCalibrationValue != 0) {
        Serial.print("New calibration value is: ");
        Serial.println(newCalibrationValue);
        LoadCell.setCalFactor(newCalibrationValue);
        _resume = true;
      }
    }
  }
  _resume = false;
  Serial.print("Save this value to EEPROM adress ");
  Serial.print(calVal_eepromAdress);
  Serial.println("? y/n");
  while (_resume == false) {
    if (Serial.available() > 0) {
      char inByte = Serial.read();
      if (inByte == 'y') {
        #if defined(ESP8266) || defined(ESP32)
                EEPROM.begin(512);
        #endif
                EEPROM.put(calVal_eepromAdress, newCalibrationValue);
        #if defined(ESP8266) || defined(ESP32)
                EEPROM.commit();
        #endif
        EEPROM.get(calVal_eepromAdress, newCalibrationValue);
        Serial.print("Value ");
        Serial.print(newCalibrationValue);
        Serial.print(" saved to EEPROM address: ");
        Serial.println(calVal_eepromAdress);
        _resume = true;
      } else if (inByte == 'n') {
        Serial.println("Value not saved to EEPROM");
        _resume = true;
      }
    }
  }
  Serial.println("End change calibration value");
  Serial.println("***");
}
// .................. weight sensor - end .................. //


// .................. voltage sensor - start .................. //
// sensor
int analogPin = 34;
float adc_voltage = 0.0;
float in_voltage = 0.0;
float R1 = 30000.0;  // 30 kOhms
float R2 = 7500.0;   // 7.5 kOhms
float ref_voltage = 3.3;
int adc_value = 0;

// power calculation
float current = 2.0;  // Assume 2A constant current (modify as needed)
float total_voltage = 0.0;
int sample_count = 0;
float average_voltage = 0.0;
float power = 0.0;
float energy = 0.0;  // watt-hours (Wh)

void calculatePowerUsage(void* vParameters) {
  while (true) {
    // Read ADC value
    adc_value = analogRead(analogPin);

    // Calculate ADC voltage
    adc_voltage = (adc_value * ref_voltage) / 4095.0; // ESP32 uses 12-bit ADC (0-4095)

    // Calculate input voltage using voltage divider formula
    in_voltage = adc_voltage * (R1 + R2) / R2;

    // Ensure voltage is non-negative
    if (in_voltage < 0) {
      in_voltage = 0;
    }

    // Update total voltage and sample count
    total_voltage += in_voltage;
    sample_count++;

    // Calculate average voltage
    average_voltage = total_voltage / sample_count;

    // Calculate instantaneous power
    power = in_voltage * current;

    // Ensure power is non-negative
    if (power > 0) {
      // Calculate energy: Power * Time (convert delay to hours)
      energy += power * (0.5 / 3600.0); // 0.5 seconds delay converted to hours
    }

    // Print values to Serial Monitor
    Serial.print("ADC Voltage: ");
    Serial.println(adc_voltage, 3);
    Serial.print("Input Voltage: ");
    Serial.println(in_voltage, 3);
    Serial.print("Instantaneous Power (W): ");
    Serial.println(power, 3);
    Serial.print("Energy Usage (Wh): ");
    Serial.println(energy, 3);

    vTaskDelay(500 / portTICK_PERIOD_MS);  // FreeRTOS delay, non-blocking
  }
}
// .................. voltage sensor - end .................. //


// .................. current sensor - start .................. //
const int sensorPin = 27;  // Pin connected to the ACS712 sensor
const float VREF = 3.3;    // Reference voltage of esp32
const int ADC_RESOLUTION = 1024; // ADC resolution (10-bit)
const float ACS712_SENSITIVITY = 0.185; // Sensitivity in V/A (e.g., 185 mV/A for 5A module)

int rawValue = 0;          // Raw ADC value
float voltage = 0;         // Voltage from sensor
// float current = 0;         // Calculated current

void calculateCurrentUsage(void* vParameters){
  while(true){

    // Read the raw value from the sensor
    rawValue = analogRead(sensorPin);

    // Convert raw value to voltage
    voltage = (rawValue * VREF) / ADC_RESOLUTION;

    // Calculate current (in Amperes)
    current = (voltage - VREF / 2) / ACS712_SENSITIVITY;

    // Print the results
    // Serial.print("Raw Value: ");
    // Serial.print(rawValue);
    // Serial.print(" | Voltage: ");
    // Serial.print(voltage, 3);
    Serial.print(" V | Current: ");
    Serial.print(current, 3);
    Serial.println(" A");

    vTaskDelay(500 / portTICK_PERIOD_MS);  // FreeRTOS delay, non-blocking
  }
}
// .................. current sensor - end .................. //


// .................. door sensor - start .................. //
int doorState = -1;  // 0 - close, 1 - open
void doorStatus(void* vParameters) {
  while (true) {

    if (doorState != digitalRead(16)) {
      doorState = digitalRead(16);

      boolean isDoorOpen;
      if (doorState == 1) {
        isDoorOpen = true;
      } else if (doorState == 0) {
        isDoorOpen = false;
      }
      updateDbDoorStatus(isDoorOpen);
    }

    vTaskDelay(500 / portTICK_PERIOD_MS);
  }
}

void updateDbDoorStatus(boolean isDoorOpen) {
  Serial.println("");
  Serial.print("Door: ");
  Serial.println(isDoorOpen);
}
// .................. door sensor - end .................. //


// .................. humidity & tempreature sensor - start .................. //
dht11 DHT11 = dht11();
float humidity = 0.0;
float temperature = 0.0;

void humidityAndTemperature(void* vParameters) {
  while (true) {
    int chk = DHT11.read(22);  // Pin 4 is used for DHT11 data

    Serial.print("Humidity (%): ");
    Serial.println((float)DHT11.humidity, 2);
    humidity = (float)DHT11.humidity;

    Serial.print("Temperature (C): ");
    Serial.println((float)DHT11.temperature, 2);
    temperature = (float)DHT11.temperature;

    vTaskDelay(2000 / portTICK_PERIOD_MS);
  }
}
// .................. humidity & tempreature sensor - end .................. //


// .................. gas sensor - start .................. //
int sensorValue;
int digitalValue;

void gasSensor(void* vParameters){
  while(true){

    sensorValue = analogRead(35); // read analog input pin 0
    digitalValue = digitalRead(5);

    Serial.print("Gas: ");
    Serial.println(sensorValue);

    vTaskDelay(3000 / portTICK_PERIOD_MS);  // Wait 3 seconds
  }
}
// .................. gas sensor - end .................. //


// .................. display - start .................. //
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

void setupDisplay() {
  Wire.begin(21, 32);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;
  }
  delay(2000);
  display.clearDisplay();
  display.setTextColor(WHITE);
}

void displayData(void* vParameters) {
  while (true) {

    // display temperature
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("Smart Fridge");
    display.setTextSize(1);
    display.setCursor(0, 35);
    display.print("Temperature: ");
    display.setTextSize(2);
    display.setCursor(0, 45);
    display.print(temperature);
    display.print(" ");
    display.setTextSize(1);
    display.cp437(true);
    display.write(167);
    display.setTextSize(2);
    display.print("C");

    display.display();
    vTaskDelay(3000 / portTICK_PERIOD_MS);  // Wait 3 seconds

    // display humidity
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("Smart Fridge");
    display.setTextSize(1);
    display.setCursor(0, 35);
    display.print("Humidity: ");
    display.setTextSize(2);
    display.setCursor(0, 45);
    display.print(humidity);
    display.print(" %");
    display.display();

    vTaskDelay(3000 / portTICK_PERIOD_MS);

    // Weight display
    // display.clearDisplay();
    // display.setTextSize(1);
    // display.setCursor(0, 0);
    // display.print("Smart Fridge");
    // display.setTextSize(1);
    // display.setCursor(0, 35);
    // display.print("Weight: ");
    // display.setTextSize(2);
    // display.setCursor(0, 45);
    // display.print(weightValue);
    // display.print(" Kg");
    // display.display();

    // vTaskDelay(3000 / portTICK_PERIOD_MS);

    // Power Consumption display
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("Smart Fridge");
    display.setTextSize(1);
    display.setCursor(0, 35);
    display.print("Power: ");
    display.setTextSize(2);
    display.setCursor(0, 45);
    display.print(energy);
    display.print(" Wh");
    display.display();

    vTaskDelay(3000 / portTICK_PERIOD_MS);

    // Door Status display
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("Smart Fridge");
    display.setTextSize(1);
    display.setCursor(0, 35);
    display.print("Door: ");
    display.setTextSize(2);
    display.setCursor(0, 45);
    if (doorState == 1) {
      display.print("Open");
    } else if (doorState == 0) {
      display.print("Close");
    } else {
      display.print("Not Responding");
    }
    display.display();
    vTaskDelay(3000 / portTICK_PERIOD_MS);

    // gas display
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.print("Smart Fridge");
    display.setTextSize(1);
    display.setCursor(0, 35);
    display.print("Food Quality: ");
    display.setTextSize(2);
    display.setCursor(0, 45);
    if(sensorValue >= 400 && sensorValue <750){
      display.print("Middle");
    }else if(sensorValue <= 750){
      display.print("Going Bad...");
    }else{
      display.print("Good");
    }
    display.display();

    vTaskDelay(3000 / portTICK_PERIOD_MS);
  }
}
// .................. display - end .................. //


// .................. wifi - start .................. //
void setupWifi() {

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Smart Fridge");
  display.setCursor(0, 35);
  display.print("Connecting to WiFi ...");
  display.display();

  WiFi.begin("Pasindu's Galaxy M14", "pasi1234");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Smart Fridge");
  display.setCursor(0, 35);
  display.print("WiFi Connected");
  display.display();
}
// .................. wifi - end .................. //


// .................. load power usage - start .................. //
void loadPowerUsage(){

  JSONVar jsonObject;
  jsonObject["fridgeCode"] = "22620";

  String jsonString = JSON.stringify(jsonObject);

  HTTPClient request = HTTPClient();
  request.begin("https://redbird-suitable-conversely.ngrok-free.app/MyFridgeBackend/LoadPowerUsageToArduino");
  request.addHeader("Content-Type", "application/json");

  int status = request.POST(jsonString);

  if (status > 0) {

    if(status == HTTP_CODE_OK){

    String responseJson = request.getString();
    JSONVar responseObject = JSON.parse(responseJson);

    boolean isSuccess = responseObject["isSuccess"];
    if (isSuccess) {

      energy = (float)(responseObject["data"].operator double());

    } else {
      Serial.println(responseObject["data"]);
    }
    }
  } else {
    Serial.println("Request Error");
  }

  request.end();
}
// .................. load power usage - end .................. //


void setup() {
  Serial.begin(115200);

  pinMode(16, INPUT_PULLUP);  // door sensor + pin
  pinMode(22, INPUT_PULLUP);  // dht11
  pinMode(18, OUTPUT);        // turn on
  pinMode(5, INPUT); // gas sensor digital pin

  //display
  setupDisplay();

  // weight
  // weight();

  // wifi
  setupWifi();

  // load power usage
  // loadPowerUsage();

  // Task 1 => calculate power usage
  xTaskCreatePinnedToCore(
    calculatePowerUsage,    // Task function
    "CalculatePowerUsage",  // Task name
    2048,                   // Stack size
    NULL,                   // Parameter
    1,                      // Priority
    NULL,                   // Task handle (NULL if not used)
    0                       // Core ID (set to 0 or 1)
  );

  // Task 2 => door status
  xTaskCreatePinnedToCore(
    doorStatus,    // Task function
    "doorStatus",  // Task name
    2048,          // Stack size
    NULL,          // Parameter
    1,             // Priority
    NULL,          // Task handle (NULL if not used)
    1              // Core ID (set to 0 or 1)
  );

  // Task 3 => humidity and tempreature
  xTaskCreatePinnedToCore(
    humidityAndTemperature,    // Task function
    "humidityAndTemperature",  // Task name
    2048,                      // Stack size
    NULL,                      // Parameter
    1,                         // Priority
    NULL,                      // Task handle (NULL if not used)
    0                          // Core ID (set to 0 or 1)
  );

  // Task 5 => display
  xTaskCreatePinnedToCore(
    displayData,    // Task function
    "displayData",  // Task name
    2048,           // Stack size
    NULL,           // Parameter
    1,              // Priority
    NULL,           // Task handle (NULL if not used)
    1               // Core ID (set to 0 or 1)
  );

  // Task 5 => weight
  // xTaskCreatePinnedToCore(
  //   getWeight,    // Task function
  //   "getWeight",  // Task name
  //   2048,         // Stack size
  //   NULL,         // Parameter
  //   1,            // Priority
  //   NULL,         // Task handle (NULL if not used)
  //   0             // Core ID (set to 0 or 1)
  // );

  // // Task 6 => gas sensor
  xTaskCreatePinnedToCore(
    gasSensor,    // Task function
    "gasSensor",  // Task name
    2048,      // Stack size
    NULL,      // Parameter
    1,         // Priority
    NULL,      // Task handle (NULL if not used)
    1          // Core ID (set to 0 or 1)
  );

  // // Task 7 => current sensor
  // xTaskCreatePinnedToCore(
  //   calculateCurrentUsage,    // Task function
  //   "calculateCurrentUsage",  // Task name
  //   2048,      // Stack size
  //   NULL,      // Parameter
  //   1,         // Priority
  //   NULL,      // Task handle (NULL if not used)
  //   0          // Core ID (set to 0 or 1)
  // );
}

void loop() {

  JSONVar jsonObject;
  jsonObject["fridgeCode"] = "22620";
  jsonObject["doorStatus"] = doorState;
  jsonObject["foodStatus"] = sensorValue;
  jsonObject["temperature"] = temperature;
  jsonObject["humidity"] = humidity;
  jsonObject["weight"] = weightValue;
  jsonObject["powerUsage"] = energy;

  String jsonString = JSON.stringify(jsonObject);

  HTTPClient request = HTTPClient();
  request.begin("https://redbird-suitable-conversely.ngrok-free.app/MyFridgeBackend/FromArduino");
  request.addHeader("Content-Type", "application/json");

  int status = request.POST(jsonString);

  if (status > 0) {

    if(status == HTTP_CODE_OK){

    String responseJson = request.getString();
    JSONVar responseObject = JSON.parse(responseJson);

    boolean isSuccess = responseObject["isSuccess"];
    if (isSuccess) {

      int turnOn = responseObject["data"];

      if (turnOn == 1) {
        digitalWrite(18, HIGH);
      } else if (turnOn == 0) {
        digitalWrite(18, LOW);
      } else {
        Serial.println(turnOn);
      }

    } else {
      Serial.println(responseObject["data"]);
    }
    }
  } else {
    Serial.println("Request Error");
  }

  request.end();
  delay(3000);

}