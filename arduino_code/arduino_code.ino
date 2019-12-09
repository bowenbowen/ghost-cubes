const int servoPin = 9;
const int ledPin = 11;

boolean haveLeftHand = false;
float handRotateL = 0;
float handHeightL = 0;
float fingerDistL = 0;

boolean haveRightHand = false;
float handRotateR = 0;
float handHeightR = 0;
float fingerDistR = 0;

// https://www.arduino.cc/en/Reference/StringLibrary
String inData; // variable for reading from serial port - from p5.js 

// the setup function runs once when you press reset or power the board
void setup() {
  Serial.begin(9600);
  // initialize digital pin LED_BUILTIN as an output.
  pinMode(servoPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
}



// the loop function runs over and over again forever
void loop() {
  if (Serial.available() > 0) {   // see if there's incoming serial data
    inData = Serial.read(); // read it
    haveLeftHand = getValue(inData, ' ', 0);
    handRotateL = getValue(inData, ' ', 1).toFloat();
    handHeightL = getValue(inData, ' ', 2).toFloat();
    fingerDistL = getValue(inData, ' ', 3).toFloat();
    
    haveRightHand = getValue(inData, ' ', 4);
    handRotateR = getValue(inData, ' ', 5).toFloat();
    handHeightR = getValue(inData, ' ', 6).toFloat();
    fingerDistR = getValue(inData, ' ', 7).toFloat();
  } else { }
  Serial.print("handRotateL: ");
  Serial.println(handRotateL);
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
