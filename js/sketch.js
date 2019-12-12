// p5 <-> arduino:
// https://medium.com/@yyyyyyyuan/tutorial-serial-communication-with-arduino-and-p5-js-cd39b3ac10ce

// Leap motion hand documentation:
// https://developer-archive.leapmotion.com/documentation/v2/javascript/api/Leap.Hand.html

let serial;
let portName = '/dev/tty.usbserial-14110';
let inData;
let outData;

let bgVal;

let handX = 100,handY = 100;

let song, volume, speed, filter, filterFreq, filterRes;


/* ------------------- leap motion stuff ------------------- */

let handNum;
let haveLeftHand, leftHand, handRotateL, handHeightL, fingerDistL;
let haveRightHand, rightHand, handRotateR, handHeightR, fingerDistR;
let isLeftHand, isRightHand;

// ++++++++++++++++++++++++ WIP ++++++++++++++++++++++++


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
        haveLeftHand = 1;
        leftHand = frame.hands[i];
        fingerDistL = int(leftHand.sphereRadius);
        handRotateL = leftHand.palmNormal[1]; // -1: palm facing down; 1: palm facing up
        handHeightL = int(leftHand.stabilizedPalmPosition[1]);
      }

      if (frame.hands[i].type == 'right') {
        // console.log('have right hand');
        haveRightHand = 1;
        rightHand = frame.hands[i];
        fingerDistR = int(rightHand.sphereRadius);
        handRotateR = rightHand.palmNormal[1];
        handHeightR = int(rightHand.stabilizedPalmPosition[1]);
      }
    }

    if (haveLeftHand == 1 && haveRightHand == 1) {
      // console.log("have both hands");
    }

  } else {
    // console.log('no hands in the frame');
    haveLeftHand = 0;
    haveRightHand = 0;
    fingerDistL = 0;
    handRotateL = 0;
    handHeightL = 0;
    fingerDistR = 0;
    handRotateR = 0;
    handHeightR = 0;
  }

  updateHTML(haveLeftHand, leftHand, fingerDistL, handRotateL, handHeightL, haveRightHand, rightHand, fingerDistR, handRotateR, handHeightR);

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

/* ------------------------ set up ------------------------ */

function preload() {
  soundFormats('mp3');
  song = loadSound('files/song.mp3');
}

function setup() {
  createCanvas(500, 500);
  colorMode(HSB)

  /* music part */
  // song.loop();
  filter = new p5.LowPass();
  // Disconnect soundfile from master output.
  // Then, connect it to the filter, so that we only hear the filtered sound
  song.disconnect();
  song.connect(filter);

  //set up communication port
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('list', printList); // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing

  serial.list(); // list the serial ports
  // serial.open(portName, {baudrate: 115200}, portOpen); // open a serial port
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
  if (serial.available() > 0) {
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
  bgVal = int(map(handRotateR, -1, 1, 0, 255))+int(map(handHeightR, 0, 500, 0, 255));
  background(bgVal/2, bgVal/2, 255)

  ellipse(map((handRotateR), -1, 1, 20, height), map((handHeightR), 0, 500, 0, width), 20, 20);
  

  /* from p5 */
  // outData = 
  //   haveLeftHand + "," + 
  //   int(map(handRotateL, -1, 1, 0, 255)) + "," +
  //   int(map(handHeightL, 0, 500, 0, 255)) + "," +
  //   int(map(fingerDistL, 0, 100, 0, 255)) + "," +
  //   haveRightHand + "," + 
  //   int(map(handRotateR, -1, 1, 0, 255)) + "," +
  //   int(map(handHeightR, 0, 500, 0, 255)) + "," + 
  //   int(map(fingerDistR, 0, 100, 0, 255)) + "\n";

  outData =
    int(map(handRotateR, -1, 1, 0, 255)) + "," +
    map(handHeightR, 0, 500, 0, 255) + "\n";

  console.log("outdata: " + outData);
  serial.write(outData);
  serial.clear(); // clean

  songPlay();

  // Map handRotateR to a the cutoff frequency from the lowest
  // frequency (10Hz) to the highest (22050Hz) that humans can hear
  filterFreq = map(handRotateR, -1, 1, 10, 24000);

  // Map handHeightR to resonance (volume boost) at the cutoff frequency
  filterRes = map(handHeightR, 0, 500, 30, 5);

  // set filter parameters
  filter.set(filterFreq, filterRes);

}

function songPlay() {
  if(haveLeftHand == 1 && !song.isPlaying()){
    song.play();
  } else if(haveLeftHand == 0 && song.isPlaying()){
    song.stop();
  }  
}