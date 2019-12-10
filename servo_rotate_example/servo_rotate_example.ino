
#include <Servo.h>

Servo myservo;  // create servo object to control a servo

int servoPin = 9;
int servoAngle;
int servoAngleInc = 1;  // how many degrees to rotate the servo by
int servoRotateDelay = 5;


void setup() {
  Serial.begin(9600);
  myservo.attach(servoPin);  // attaches the servo on pin 9 to the servo object
  servoAngle = 0;
}

void loop() {

  myservo.write(servoAngle);

  // change the angle for next time through the loop:
  servoAngle = servoAngle + servoAngleInc;

  // reverse the direction of the rotation at the ends of the rotation:
  if (servoAngle <= 0 || servoAngle >= 180) {
    servoAngleInc = -servoAngleInc;
  }
  delay(servoRotateDelay);
  
//  Serial.println(myservo.read());
}
