// p5 <-> arduino:
// https://medium.com/@yyyyyyyuan/tutorial-serial-communication-with-arduino-and-p5-js-cd39b3ac10ce

// Leap motion hand documentation:
// https://developer-archive.leapmotion.com/documentation/v2/javascript/api/Leap.Hand.html

let serial;
let latestData = "waiting for data";

let handX = 100, handY = 100;



/* ------------------- leap motion stuff ------------------- */

let handNum;
let haveLeftHand, leftHand, handRotateL, handHeightL,fingerDistL;
let haveRightHand, rightHand, handRotateR, handHeightR, fingerDistR;
let totalFingerDist;


Leap.loop(function(frame) {
  
  handNum = frame.hands.length;

  if(frame.hands.length > 0){
    

    let hand = frame.hands[0];
    handX = hand.stabilizedPalmPosition[0];
    handY = hand.stabilizedPalmPosition[1];


    // update hand stats
    for (let i=0; i<frame.hands.length; i++){
      if(frame.hands[i].type == 'left'){
        console.log('have left hand');
        haveLeftHand = true;
        leftHand = frame.hands[i];
        fingerDistL = leftHand.sphereRadius;
        handRotateL = leftHand.palmNormal[1]; // -1: palm facing down; 1: palm facing up
        handHeightL = leftHand.stabilizedPalmPosition[1];
      }
      if(frame.hands[i].type == 'right'){
        console.log('have right hand');
        haveRightHand = true;
        rightHand = frame.hands[i];
        fingerDistR = rightHand.sphereRadius;
        handRotateR = rightHand.palmNormal[1];
        handHeightR = rightHand.stabilizedPalmPosition[1];
      }
    }
    
    if (haveLeftHand == true && haveRightHand == true){
      console.log("have both hands");
    }
    
  } else { console.log('no hands in the frame'); }

  updateHTML(haveLeftHand, leftHand, fingerDistL, handRotateL, handHeightL, haveRightHand, rightHand, fingerDistR, handRotateR, handHeightR);

  // reset variables for the next frame
  haveLeftHand = false; 
  haveRightHand = false; 
  
  
    
});

function updateHTML(haveLeftHand, leftHand, fingerDistL, handRotateL, handHeightL,
                    haveRightHand, rightHand, fingerDistR, handRotateR, handHeightR){
  document.getElementById("haveLeftHand").innerHTML = haveLeftHand;
  if (haveLeftHand == true){
    document.getElementById("fingerDistL").innerHTML = fingerDistL;
    document.getElementById("handRotateL").innerHTML = handRotateL;
    document.getElementById("handHeightL").innerHTML = handHeightL;
  } else {
    document.getElementById("fingerDistL").innerHTML = '-';
    document.getElementById("handRotateL").innerHTML = '-';
    document.getElementById("handHeightL").innerHTML = '-';
  }

  document.getElementById("haveRightHand").innerHTML = haveRightHand;
  if (haveRightHand == true){
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

function setup() {
 createCanvas(500, 500);

//  serial = new p5.SerialPort();

//  serial.list();
//  serial.open('/dev/tty.usbserial-1410');
//  serial.on('connected', serverConnected);
//  serial.on('list', gotList);
//  serial.on('data', gotData);
//  serial.on('error', gotError);
//  serial.on('open', gotOpen);
//  serial.on('close', gotClose);
  
}

function serverConnected() {
 print("Connected to Server");
}

function gotList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}

function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function gotData() {
 let currentString = serial.readLine();
  trim(currentString);
 if (!currentString) return;
 console.log(currentString);
 latestData = currentString;
}


/* ------------------------ draw ------------------------ */

function draw(){
  background(100);
  // console.log(handX);
  
  ellipse(map(round(handX), -width*0.25, width*0.25, 0, width), 50, 20, 20);
  // outData =  constrain(map(round(handX), -width*0.25, width*0.25, 0, 255),0,255);
  // serial.write(outData);
}