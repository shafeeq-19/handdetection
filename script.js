/////////////////////////////////////////////////////////////////////
var model
var image
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
        
        // console.log("=====@@@@@@@@",model)
        const predictions = await model.estimateHands(video);
        // console.log(predictions);
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
  // const style = {
  //   0: { color: "yellow", size: 10 },1: { color: "gold", size: 6 },2: { color: "green", size: 10 },3: { color: "gold", size: 6 },4: { color: "gold", size: 6 },
  //   5: { color: "purple", size: 10 },6: { color: "gold", size: 6 },7: { color: "gold", size: 6 },8: { color: "gold", size: 6 },9: { color: "blue", size: 10 },
  //   10: { color: "gold", size: 6 },11: { color: "gold", size: 6 },12: { color: "gold", size: 6 },13: { color: "red", size: 10 },14: { color: "#4ef542", size: 6 },
  //   15: { color: "gold", size: 6 },16: { color: "gold", size: 6 },17: { color: "orange", size: 10 },18: { color: "gold", size: 6 },
  //   19: { color: "gold", size: 6 },20: { color: "gold", size: 6 },
  // };
  const style = {13: { color: "red", size: 10 },14: { color: "#4ef542", size: 6 },
  };
  var loop_array=[13,14]
const drawHand = (predictions, ctx) => {
    // Check if we have predictions
    if (predictions.length > 0) {
      // Loop through each prediction
      predictions.forEach((prediction) => {
        // Grab landmarks
        const landmarks = prediction.landmarks;
        console.log("====",landmarks)
        const x1 = landmarks[13][0];
          // Get y point
        const y1 = landmarks[13][1];
        // ctx.beginPath();
        // ctx.arc(x1, y1, style[13]["size"], 0, 3 * Math.PI);
        // // Set line color
        // ctx.fillStyle = style[13]["color"];
        // ctx.fill();
        const x2 = landmarks[14][0];
          // Get y point
        const y2 = landmarks[14][1];

        const x3 = landmarks[8][0];
          // Get y point
        const y3 = landmarks[8][1];
        // Start drawing
        // ctx.beginPath();
        // ctx.arc(x3, y3, 10, 0, 3 * Math.PI);
        // // Set line color
        // ctx.fillStyle = 'red';
        // ctx.fill();

     

        //Get center pont 

        const centerX = (x1 + x2) / 2;
        const centerY = (y1 + y2) / 2;
        // ctx.beginPath();
        // ctx.arc(centerX, centerY, 10, 0, 3 * Math.PI);
        // // Set line color
        // ctx.fillStyle = '#f5c242';
        // ctx.fill();

        /// image place in center point

        // Create an image element
        var imgvalue = sessionStorage.getItem('imgurl');

        image = new Image();
        image.src = imgvalue; // Replace with the path to your image
        image.id = "ring_image";
        image.onload = function() {
          const desiredWidth = 30; // Replace with your desired width
          const desiredHeight = 15; // Replace with your desired height

          // Calculate the top-left position to place the image at the center
          const imageX = centerX - desiredWidth / 2;
          const imageY = centerY - desiredHeight / 2;

          // Draw the image with the desired size at the center position
          ctx.drawImage(image, imageX, imageY, desiredWidth, desiredHeight);
      };

      });
    }
  };

