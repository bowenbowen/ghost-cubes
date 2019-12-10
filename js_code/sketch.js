// p5 <-> arduino:
// https://medium.com/@yyyyyyyuan/tutorial-serial-communication-with-arduino-and-p5-js-cd39b3ac10ce

// Leap motion hand documentation:
// https://developer-archive.leapmotion.com/documentation/v2/javascript/api/Leap.Hand.html

let serial;
let portName = '/dev/tty.usbserial-14110';
let inData;
let outData;


let latestData = "waiting for data";

let handX = 100,
  handY = 100;



/* ------------------- leap motion stuff ------------------- */

let handNum;
let haveLeftHand, leftHand, handRotateL, handHeightL, fingerDistL;
let haveRightHand, rightHand, handRotateR, handHeightR, fingerDistR;
let currentActiveCube; // ++++++++++++++++++++++++ WIP ++++++++++++++++++++++++


Leap.loop(function (frame) {

  handNum = frame.hands.length;

  if (frame.hands.length > 0) {

    let hand = frame.hands[0];
    handX = hand.stabilizedPalmPosition[0];
    handY = hand.stabilizedPalmPosition[1];

    // update hand stats
    for (let i = 0; i < frame.hands.length; i++) {
      if (frame.hands[i].type == 'left') {
        // console.log('have left hand');
        haveLeftHand = true;
        leftHand = frame.hands[i];
        fingerDistL = leftHand.sphereRadius;
        handRotateL = leftHand.palmNormal[1]; // -1: palm facing down; 1: palm facing up
        handHeightL = leftHand.stabilizedPalmPosition[1];
      }

      if (frame.hands[i].type == 'right') {
        // console.log('have right hand');
        haveRightHand = true;
        rightHand = frame.hands[i];
        fingerDistR = rightHand.sphereRadius;
        handRotateR = rightHand.palmNormal[1];
        handHeightR = rightHand.stabilizedPalmPosition[1];
      }
    }

    if (haveLeftHand == true && haveRightHand == true) {
      // console.log("have both hands");
    }

    // currentActiveCube = getActiveCube(frame.hands[0], minX, maxX, minY, maxY); // ++++++++++++++++++++++++ WIP ++++++++++++++++++++++++

  } else {
    // console.log('no hands in the frame');
    haveLeftHand = false;
    haveRightHand = false;
    fingerDistL = 0;
    handRotateL = 0;
    handHeightL = 0;
    fingerDistR = 0;
    handRotateR = 0;
    handHeightR = 0;
  }

  updateHTML(haveLeftHand, leftHand, fingerDistL, handRotateL, handHeightL, haveRightHand, rightHand, fingerDistR, handRotateR, handHeightR);

  // reset variables for the next frame
  // haveLeftHand = false;
  // haveRightHand = false;
  currentActiveCube = null;
});

function updateHTML(haveLeftHand, leftHand, fingerDistL, handRotateL, handHeightL,
  haveRightHand, rightHand, fingerDistR, handRotateR, handHeightR) {
  document.getElementById("haveLeftHand").innerHTML = haveLeftHand;
  if (haveLeftHand == true) {
    document.getElementById("fingerDistL").innerHTML = fingerDistL;
    document.getElementById("handRotateL").innerHTML = handRotateL;
    document.getElementById("handHeightL").innerHTML = handHeightL;
  } else {
    document.getElementById("fingerDistL").innerHTML = '-';
    document.getElementById("handRotateL").innerHTML = '-';
    document.getElementById("handHeightL").innerHTML = '-';
  }

  document.getElementById("haveRightHand").innerHTML = haveRightHand;
  if (haveRightHand == true) {
    document.getElementById("fingerDistR").innerHTML = fingerDistR;
    document.getElementById("handRotateR").innerHTML = handRotateR;
    document.getElementById("handHeightR").innerHTML = handHeightR;
  } else {
    document.getElementById("fingerDistR").innerHTML = '-';
    document.getElementById("handRotateR").innerHTML = '-';
    document.getElementById("handHeightR").innerHTML = '-';
  }
}

function getActiveCube(hand, minX, maxX, minY, maxY) {
  let x_1 = minX + (maxX - minX) * 1 / 3;
  let x_2 = minX + (maxX - minX) * 2 / 3;
  let y_1 = minY + (maxY - minY) * 1 / 3;
  let y_2 = minY + (maxY - minY) * 2 / 3;
  let Xpos = hand.stabilizedPalmPosition[0];
  let Ypos = hand.stabilizedPalmPosition[1];
  let cubeIndex; // starting from 0

  if (Ypos <= y_1) {

    if (Xpos <= x_1) {
      cubeIndex = 0;
    } else if (Xpos > x_1 && Xpos < x_2) {
      cubeIndex = 1;
    } else if (Xpos >= x_2) {
      cubeIndex = 2;
    }

  } else if (Ypos > y_1 && Ypos < y_2) {

    if (Xpos <= x_1) {
      cubeIndex = 3;
    } else if (Xpos > x_1 && Xpos < x_2) {
      cubeIndex = 4;
    } else if (Xpos >= x_2) {
      cubeIndex = 5;
    }

  } else if (Ypos >= y_1) {

    if (Xpos <= x_1) {
      cubeIndex = 6;
    } else if (Xpos > x_1 && Xpos < x_2) {
      cubeIndex = 7;
    } else if (Xpos >= x_2) {
      cubeIndex = 8;
    }

  }
  return cubeIndex;
}


/* ------------------------ set up ------------------------ */

function setup() {
  createCanvas(500, 500);

  //set up communication port
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  serial.open(portName); // open a serial port
}

// Following functions print the serial communication status to the console for debugging purposes

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
  // Display the list the console:
  print(i + " " + portList[i]);
  }
 }
 
 function serverConnected() {
   print('connected to server.');
 }
 
 function portOpen() {
   print('the serial port opened.')
 }
 
 function serialEvent() {
  if(serial.available() > 0){
    inData = Number(serial.readLine());
  } else {
    console.log("No Input");
  }
 }
 
 function serialError(err) {
   print('Something went wrong with the serial port. ' + err);
 }
 
 function portClose() {
   print('The serial port closed.');
 }


/* ------------------------ draw ------------------------ */

function draw() {
  background(100);
  // console.log(handX);

  ellipse(map(round(handX), -width * 0.25, width * 0.25, 0, width), 50, 20, 20);

  // let outData = haveLeftHand + "," + handRotateL + "," + handHeightL + "," + fingerDistL + "," + haveRightHand + "," + handRotateR + "," + handHeightR + "," + fingerDistR;

  let outData = int(map(handHeightR, 0, 500, 0, 255)) + "," + int(map(handRotateR, -1, 1, 0, 255))+"\n";


  console.log("outdata: " + outData);

  serial.write(outData);
  serial.clear();
}