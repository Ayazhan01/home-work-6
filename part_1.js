const video = document.querySelector(".webcam");

const canvas = document.querySelector(".video").transferControlToOffscreen();
const ctx = canvas.getContext("2d");

const backgroundCanvas = document.querySelector(".background").transferControlToOffscreen();
const backgroundCtx = backgroundCanvas.getContext("2d");

canvas.width = 1000;
canvas.height = 500;
backgroundCanvas.width = 1000;
backgroundCanvas.height = 500;

const SIZE = 20;

const faceDetector = new FaceDetector();

async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1000, height: 500 },
    });
    video.srcObject = stream;

    await video.play();
}

function censorBackground(boundingBox) {
    backgroundCtx.imageSmoothingEnabled = false;

    backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    // draw small full picture 
    backgroundCtx.drawImage(
        video,
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height,
        0,
        0,
        SIZE,
        SIZE);

    // draw many small pictures
    backgroundCtx.drawImage(
        backgroundCanvas, // source
        0, // where do we start the source pull from?
        0,
        SIZE,
        SIZE,
        //drawing args
        0,
        0,
        backgroundCanvas.width,
        backgroundCanvas.height
    );

    // make face area transparent
    backgroundCtx.clearRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
}

function hideBackground({ boundingBox }) {
    const { width, height, top, left } = boundingBox;
    ctx.strokeStyle = "#ffc600";
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    censorBackground(boundingBox);
    ctx.strokeRect(left, top, width, height);
}

async function detect() {
    const faces = await faceDetector.detect(video);
    faces.forEach(hideBackground);

    requestAnimationFrame(detect);
}

populateVideo().then(detect);