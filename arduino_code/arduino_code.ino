#include <Adafruit_NeoPixel.h>

/* declare variables */

// NeoPixel 
#define PIN 5
#define NUM_LEDS 1
#define DELAYVAL 200
//create a NeoPixel strip
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

// end NeoPixel

// servo
const int servoPin = 9;
// end servo

int handRotateL,handHeightL,fingerDistL,handRotateR,handHeightR,fingerDistR;
int COMMA_1, COMMA_2, COMMA_3, COMMA_4, COMMA_5, COMMA_6, COMMA_7, COMMA_8;
String inData, isLeftString, handRotateLString, handHeightLString, fingerDistLString, isRightString, handRotateRString, handHeightRString, fingerDistRString;


// https://www.arduino.cc/en/Reference/StringLibrary

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize serial port
  Serial.begin(9600);

  // start the strip and blank it out
  strip.setBrightness(0);
  setAll(0,0,0);
  strip.begin();

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(servoPin, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  
  // read the input from p5.js
  if ( Serial.available()) { // when there is input
    inData = Serial.readStringUntil('\n'); // read it until new line
    COMMA_1 = inData.indexOf(','); // find the first comma
    isLeftString = inData.substring(0, COMMA_1);

    COMMA_2 = inData.indexOf(',', COMMA_1+1);
    handRotateLString = inData.substring(COMMA_1+1, COMMA_2);
    handRotateL = handRotateLString.toInt();

    COMMA_3 = inData.indexOf(',', COMMA_2+1);
    handHeightLString = inData.substring(COMMA_2+1, COMMA_3);
    handHeightL = handHeightLString.toInt();

    COMMA_4 = inData.indexOf(',', COMMA_3+1);
    fingerDistLString = inData.substring(COMMA_3+1, COMMA_4);
    fingerDistL = fingerDistLString.toInt();

    COMMA_5 = inData.indexOf(',', COMMA_4+1); // find the first comma
    isRightString = inData.substring(COMMA_4+1, COMMA_5);

    COMMA_6 = inData.indexOf(',', COMMA_5+1);
    handRotateRString = inData.substring(COMMA_5+1, COMMA_6);
    handRotateR = handRotateRString.toInt();

    COMMA_7 = inData.indexOf(',', COMMA_6+1);
    handHeightRString = inData.substring(COMMA_6+1, COMMA_7);
    handHeightR = handHeightRString.toInt();

    COMMA_8 = inData.indexOf(',', COMMA_7+1);
    fingerDistRString = inData.substring(COMMA_7+1, COMMA_8);
    fingerDistR = fingerDistRString.toInt();
  } 


  
//    Serial.print("indata: ");
//    Serial.println(inData);

    strip.setBrightness(handHeightR);
    setAll(handRotateR,handHeightR,0);
} 

/* NeoPixel functions */

/* end NeoPixel functions */


/* helper functions for NeoPixel */
void showStrip() {
 #ifdef ADAFRUIT_NEOPIXEL_H
   // NeoPixel
   strip.show();
 #endif
 #ifndef ADAFRUIT_NEOPIXEL_H
   // FastLED
   FastLED.show();
 #endif
}

void setPixel(int Pixel, byte red, byte green, byte blue) {
 #ifdef ADAFRUIT_NEOPIXEL_H
   // NeoPixel
   strip.setPixelColor(Pixel, strip.Color(red, green, blue));
 #endif
 #ifndef ADAFRUIT_NEOPIXEL_H
   // FastLED
   leds[Pixel].r = red;
   leds[Pixel].g = green;
   leds[Pixel].b = blue;
 #endif
}

void setAll(byte red, byte green, byte blue) {
  for(int i = 0; i < NUM_LEDS; i++ ) {
    setPixel(i, red, green, blue);
  }
  showStrip();
}
/* end helper */
