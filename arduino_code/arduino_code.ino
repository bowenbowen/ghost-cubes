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

// data vairables
//boolean haveLeftHand = false;
//float handRotateL = 30;
//float handHeightL = 60;
//float fingerDistL = 90;
//
//boolean haveRightHand = false;
//float handRotateR = 30;
//float handHeightR = 60;
//float fingerDistR = 90;
// end data variables


int handHeightR = 0;
int handRotateR = 0;
String inData;
String handHeightRString;


// https://www.arduino.cc/en/Reference/StringLibrary

// the setup function runs once when you press reset or power the board
void setup() {
  // initialize serial port
  Serial.begin(9600);

  // start the strip and blank it out
  strip.setBrightness(0);
  strip.begin();

  // initialize digital pin LED_BUILTIN as an output.
  pinMode(servoPin, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  
  // read the input from p5.js
  if ( Serial.available()) { // when there is input
    inData = Serial.readStringUntil('\n'); // read it until new line
    int firstValueEnd = inData.indexOf(','); // find the first comma
    handHeightRString = inData.substring(0, firstValueEnd); // first string
    handHeightR = handHeightRString.toInt();

    int secondValueEnd = inData.indexOf(',', firstValueEnd+1);
    String handRotateRString = inData.substring(firstValueEnd+1, secondValueEnd);
    handRotateR = handRotateRString.toInt();

//    haveLeftHand = getValue(inData, ' ', 0);
//    handRotateL = getValue(inData, ' ', 1).toFloat();
//    handHeightL = getValue(inData, ' ', 2).toFloat();
//    fingerDistL = getValue(inData, ' ', 3).toFloat();
//    
//    haveRightHand = getValue(inData, ' ', 4);
//    handRotateR = getValue(inData, ' ', 5).toFloat();
//    handHeightR = getValue(inData, ' ', 6).toFloat();
//    fingerDistR = getValue(inData, ' ', 7).toFloat();
  } 
//
  Serial.print("indata: ");
  Serial.println(inData);
//
//  Serial.print("handHeightRString:");
//  Serial.println(handHeightRString);
//
//  Serial.print("handHeightR:");
//  Serial.println(handHeightR);

  strip.setBrightness(handHeightR);
  setAll(handRotateR,255,0);
}


// split string in C: https://stackoverflow.com/questions/9072320/split-string-into-string-array

String getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }
  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
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
