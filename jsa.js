/////////////////////////////////////////////////////////////////////
var model
 model = await handpose.load();
(function() {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('videoElement');
    /////////////////////////////////////////////////////////////////
    if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia) {
              navigator.mediaDevices.getUserMedia({ video: true,
                    audio:false })
                .then(function (stream) {
                  video.srcObject = stream;
                })
                .catch(function (err) {
                  console.log("Something went wrong!");
                });
            }
    ///////////////////////////////////////////////////////////////
    video.addEventListener('play',function()
                          {
        draw(this, context,640,480);
    },false);
    ///////////////////////////////////////////////////////////////
    async function draw(video,context, width, height){
        context.drawImage(video,0,0,width,height);
        
        console.log("=====@@@@@@@@",model)
        const predictions = await model.estimateHands(video);
        console.log(predictions);
        /////////////////////////////////////////////////////////
        if (predictions.length > 0){
           for (let i = 0; i < predictions.length; i++) {
            drawHand(predictions,context);
            var probability = predictions[i].handInViewConfidence;
            var prob = (probability*100).toPrecision(5).toString();
            var text = "Confidence:"+prob+"%";
            context.font = "16pt Comic Sans MS";
            context.fillStyle = "#FF0000";
            context.fillText(text,425,20);
        }
            //////////////////////////////////////////////////////
           }
        setTimeout(draw,250,video,context,width,height);
        /////////////////////////////////////////////////////////
    }
})();
 
const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
  };
  
  // Infinity Gauntlet Style
  const style = {
    0: { color: "yellow", size: 10 },1: { color: "gold", size: 6 },2: { color: "green", size: 10 },3: { color: "gold", size: 6 },4: { color: "gold", size: 6 },
    5: { color: "purple", size: 10 },6: { color: "gold", size: 6 },7: { color: "gold", size: 6 },8: { color: "gold", size: 6 },9: { color: "blue", size: 10 },
    10: { color: "gold", size: 6 },11: { color: "gold", size: 6 },12: { color: "gold", size: 6 },13: { color: "red", size: 10 },14: { color: "#4ef542", size: 6 },
    15: { color: "gold", size: 6 },16: { color: "gold", size: 6 },17: { color: "orange", size: 10 },18: { color: "gold", size: 6 },
    19: { color: "gold", size: 6 },20: { color: "gold", size: 6 },
  };
  
const drawHand = (predictions, ctx) => {
    // Check if we have predictions
    if (predictions.length > 0) {
      // Loop through each prediction
      predictions.forEach((prediction) => {
        // Grab landmarks
        const landmarks = prediction.landmarks;
  
        // Loop through fingers
        for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
          let finger = Object.keys(fingerJoints)[j];
          //  Loop through pairs of joints
          for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
            // Get pairs of joints
            const firstJointIndex = fingerJoints[finger][k];
            const secondJointIndex = fingerJoints[finger][k + 1];
  
            // Draw path
            ctx.beginPath();
            ctx.moveTo(
              landmarks[firstJointIndex][0],
              landmarks[firstJointIndex][1]
            );
            ctx.lineTo(
              landmarks[secondJointIndex][0],
              landmarks[secondJointIndex][1]
            );
            ctx.strokeStyle = "plum";
            ctx.lineWidth = 6;
            ctx.stroke();
          }
        }
  
        // Loop through landmarks and draw em
        for (let i = 0; i < landmarks.length; i++) {
          // Get x point
          const x = landmarks[i][0];
          // Get y point
          const y = landmarks[i][1];
          // Start drawing
          ctx.beginPath();
          ctx.arc(x, y, style[i]["size"], 0, 3 * Math.PI);
          // Set line color
          ctx.fillStyle = style[i]["color"];
          ctx.fill();
        }
      });
    }
  };