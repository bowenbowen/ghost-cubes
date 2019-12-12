#include <Adafruit_NeoPixel.h>
#include <Servo.h> 

/* declare variables */

// NeoPixel 
#define PIN 5
#define NUM_LEDS 9
#define DELAYVAL 200
//create a NeoPixel strip
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, PIN, NEO_GRB + NEO_KHZ800);

// end NeoPixel

// servo
const int servoPin = 9;
Servo myServo;
int pos = 0;
// end servo

int handRotateL,handHeightL,fingerDistL,handRotateR,handHeightR,fingerDistR;
int COMMA_1, COMMA_2, COMMA_3, COMMA_4, COMMA_5, COMMA_6, COMMA_7, COMMA_8;
String inData, isLeft, handRotateLString, handHeightLString, fingerDistLString, isRight, handRotateRString, handHeightRString, fingerDistRString;


// the setup function runs once when you press reset or power the board
void setup() {
  // initialize serial port
  Serial.begin(9600);

  // start the strip and blank it out
  strip.begin();
  strip.setBrightness(0);

  myServo.attach(9);
  myServo.write(180);
}

// the loop function runs over and over again forever
void loop() {

    if ( Serial.available() ) { // when there is input
      inData = Serial.readStringUntil('\n'); // read it until new line
      COMMA_1 = inData.indexOf(','); // find the first comma
      handRotateRString = inData.substring(0, COMMA_1);
      handRotateR = handRotateRString.toInt();
  
      COMMA_2 = inData.indexOf(',', COMMA_1+1);
      handHeightRString = inData.substring(COMMA_1+1, COMMA_2);
      handHeightR = handHeightRString.toInt();
    }

    pos = map(handRotateR, 0, 255, 170, 0);
    strip.setBrightness((handRotateR+handHeightR)/2);
    setAll(handRotateR,handHeightR,0);    
    myServo.write(pos);
}

/* call this when testing the light */
void testLight(){
    strip.setBrightness(255);
    setAll(0,0,0);
    RGBLoop(); 
}

/* NeoPixel functions */
void RGBLoop(){
  for(int j = 0; j < 3; j++ ) {
    // Fade IN
    for(int k = 0; k < 256; k++) {
      switch(j) {
        case 0: setAll(k,0,0); break;
        case 1: setAll(0,k,0); break;
        case 2: setAll(0,0,k); break;
      }
      showStrip();
      delay(3);
    }
    // Fade OUT
    for(int k = 255; k >= 0; k--) {
      switch(j) {
        case 0: setAll(k,0,0); break;
        case 1: setAll(0,k,0); break;
        case 2: setAll(0,0,k); break;
      }
      showStrip();
      delay(3);
    }
  }
}

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
