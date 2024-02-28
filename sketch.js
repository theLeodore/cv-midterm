// Global Variables
let capture;
let poseNet;
let poses = []; // this array will contain our detected poses (THIS IS THE IMPORTANT STUFF)
const cam_w = 1140;
const cam_h = 820;
// const cam_w = 640;
// const cam_h = 480;

// heart set up
let hearts = [];
let colors = [];

// function setup() {
//   //createCanvas(400, 400);
//   colors = ["#edbba8", "#e66f3c", "#c6b6d5", "#f1d147", "#a4cd98", "#95accb"];
// }

// heart set up end

const options = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16, // 8, 16 (larger = faster/less accurate)
  flipHorizontal: true,
  minConfidence: 0.5,
  maxPoseDetections: 2, // 5 is the max
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "multiple",
  inputResolution: 257, // 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, or 801, smaller = faster/less accurate
  multiplier: 0.5, // 1.01, 1.0, 0.75, or 0.50, smaller = faster/less accurate
  quantBytes: 2,
};

function setup() {
  createCanvas(cam_w, cam_h);
  capture = createCapture(VIDEO);
  capture.size(cam_w, cam_h);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(capture, options, modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected.
  poseNet.on("pose", function (results) {
    poses = results;
  });

  // Hide the capture element, and just show the canvas
 capture.hide();
  //colorMode(HSB)colors = ["#edbba8", "#e66f3c", "#c6b6d5", "#f1d147", "#a4cd98", "#95accb"];
  
  colors = ["#edbba8", "#e66f3c", "#c6b6d5", "#f1d147", "#a4cd98", "#95accb"];
}

// this function gets called once the model loads successfully.
function modelReady() {
  console.log("Model loaded");
}

function draw() {
  // mirror the capture being drawn to the canvas
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();
  
  drawHearts();

  if (poses.length > 1) {
    connectWrists();
  }
}

function drawHearts() {
  for (let i=0; i<hearts.length; i++) {
    hearts[i].display();
    hearts[i].fall();
  }
  
  for (let i=0; i<hearts.length; i++) {
    if (hearts[i].y > height+20) {
      hearts.splice(i, 1); }}
}

function connectWrists() {
  
  // store person one data
  let pose0 = poses[0].pose;
  // store person two data
  let pose1 = poses[1].pose;
  
  let personLeft;
  let personRight;
  
  // check to see which side each person is on
  if(pose0.nose.x < pose1.nose.x) {
    personLeft = pose0;
    personRight = pose1;
  } else {
    personLeft = pose1;
    personRight = pose0;
  }
  
  // store the nose of each person
  let rightWrist = createVector(personLeft.rightWrist.x, personLeft.rightWrist.y);
  let leftWrist = createVector(personRight.leftWrist.x, personRight.leftWrist.y);
  
    fill(0)
    let wristDistance = leftWrist.dist(rightWrist);
  
  if(wristDistance < 80) {
    //fill(0, 255, 0);
    //drawHearts()

    let heartPosition = rightWrist.lerp(leftWrist, 0.5)
    hearts.push(new Heart(heartPosition.x, heartPosition.y));
  } else {
    fill("#e66f3c");
    ellipse(rightWrist.x, rightWrist.y, 20, 20)
    fill("#e66f3c");
    ellipse(leftWrist.x, leftWrist.y, 20, 20)
  }
  
  
  // new Heart();
    
    // new Heart(rightWrist.x, rightWrist.y, 30, 30);
    // new Heart(leftWrist.x, leftWrist.y, 30, 30);
  
  
}

// function mouseDragged() {
//   hearts.push(new Heart(rightWrist.x, leftWrist.x));
// }
  
  
