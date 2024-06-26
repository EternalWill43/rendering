let TotalTime = 0.0;

// Target frames per second, measured in fractions of seconds
const TargetFrameTime = 1.0 / 60.0;

// Global canvas width and heights
let CanvasWidth;
let CanvasHeight;

// Global screen centers
let CenterX;
let CenterY;

/*** Internal Functions & letiables ***/

// FPS counter, refresh rate, and internal timer
let FrameRateTime = 0;        // Seconds elapsed since last FPS post
let FrameRateCount = 0;       // Number of frames since last FPS post
let FrameRateRefresh = 1;     // Time interval between each FPS post

// Global canvas and graphics handle
let CanvasHandle = null;
let ContextHandle = null;

// Backbuffer canvas handle
let BackCanvasHandle = null;
let BackContextHandle = null;

// Main application entry point; this MUST be called before any other functions
// Calls the user overloaded "Init(...)" function and starts
// the main render loop
function Main() {
    // Get context handles
    CanvasHandle = document.getElementById("SampleCanvas");
    ContextHandle = CanvasHandle.getContext("2d");

    // Get the canvas size
    CanvasWidth = ContextHandle.canvas.clientWidth;
    CanvasHeight = ContextHandle.canvas.clientHeight;

    // Get the canvas center
    CenterX = CanvasWidth / 2;
    CenterY = CanvasHeight / 2;

    // Create an image backbuffer
    BackCanvasHandle = document.createElement("canvas");
    BackCanvasHandle.width = CanvasWidth;
    BackCanvasHandle.height = CanvasHeight;
    BackContextHandle = BackCanvasHandle.getContext("2d");

    // Call the custom init function
    Init();

    // Start the render cycle
    RenderLoop();
}

// Main render loop
// This should setup a timer at the end to call itself again
// This function throttles itself to only update at a target FPS
function RenderLoop() {
    // Start timing this render cycle
    let StartTime = new Date();

    // Clear backbuffer
    BackContextHandle.clearRect(0, 0, CanvasWidth, CanvasHeight);

    // Save context state
    BackContextHandle.save();

    // Render the scene
    RenderScene(BackContextHandle);

    // Restore the context state
    BackContextHandle.restore();

    // Swap the backbuffer with the frontbuffer
    // We take the contents of the backbuffer and draw onto the front buffer
    let ImageData = BackContextHandle.getImageData(0, 0, CanvasWidth, CanvasHeight);
    ContextHandle.putImageData(ImageData, 0, 0);

    // End time
    let EndTime = new Date();

    // Measure the difference
    // Note that "value of" returns millis, we divide back into seconds
    let TimeElapsed = (EndTime.valueOf() - StartTime.valueOf()) / 1000;
    let SleepTime = TargetFrameTime - TimeElapsed;

    // If target sleep time is negative, simply don't sleep
    // This is in cases where we take longer than intended to render a scene
    if (SleepTime < 0)
        SleepTime = 0;

    // Calculate the cycle time of how long it took to execute this frame
    let CycleTime = TimeElapsed + SleepTime;

    // Calculate FPS when needed
    FrameRateTime += CycleTime;
    if (FrameRateTime >= FrameRateRefresh) {
        // Post FPS
        let FPS = FrameRateCount / FrameRateRefresh;
        document.getElementById("FPSTextBox").value = FPS + " / " + (1 / TargetFrameTime);

        // Reset time and frame count
        FrameRateTime = 0;
        FrameRateCount = 0;
    }

    // Grow frame count
    FrameRateCount++;

    // Callback to self after sleep-off time
    // Note that we convert back to seconds and then set this sleeping function
    TotalTime += CycleTime;
    setTimeout(RenderLoop, SleepTime * 1000);
}

/*** Graphics Primitive Wrappers ***/

// Render a point given a point and a color
function RenderPoint(x, y, width, color) {
    // Shortext context handle
    let ctx = BackContextHandle;

    // Save context
    ctx.save();

    // Set color
    if (color != undefined)
        ctx.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    else
        ctx.fillStyle = "rgb(0, 0, 0)";

    // Draw from point to point
    ctx.fillRect(x - width / 2, y - width / 2, width, width);

    // Revert context
    ctx.restore();

    // Done rendering line
}

// Render a line given two points, a width, and a color
function RenderLine(x1, y1, x2, y2, width, color) {
    // Shortext context handle
    let ctx = BackContextHandle;

    // Save context
    ctx.save();

    // Set width and cap style
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";

    // Set color
    if (color != undefined)
        ctx.strokeStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    else
        ctx.strokeStyle = "rgb(0, 0, 0)";

    // Draw from point to point
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.stroke();

    // Revert context
    ctx.restore();

    // Done rendering line
}

// Render a triangle given three points, a width, and a color
function RenderTriangle(x1, y1, x2, y2, x3, y3, width, color) {
    // Shortext context handle
    let ctx = BackContextHandle;

    // Save context
    ctx.save();

    // Set width and cap style
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";

    // Set color
    if (color != undefined)
        ctx.strokeStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    else
        ctx.strokeStyle = "rgb(0, 0, 0)";

    // Draw from point to point
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.stroke();

    // Revert context
    ctx.restore();

    // Done rendering triangle
}

// Render a triangle given three points, a width, and a color
function RenderFillTriangle(x1, y1, x2, y2, x3, y3, width, color) {
    // Shortext context handle
    let ctx = BackContextHandle;

    // Save context
    ctx.save();

    // Set width and cap style
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";

    // Set color
    if (color != undefined)
        ctx.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    else
        ctx.fillStyle = "rgb(0, 0, 0)";

    // Draw from point to point
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();

    // Revert context
    ctx.restore();

    // Done rendering triangle
}

// Render a checkered background (Colors are set internally)
function RenderBackground() {
    // Shortext context handle
    let ctx = BackContextHandle;

    // Draw a checkered light background
    let SquareSize = 8;

    // Draw an error background
    ctx.fillStyle = "rgb(8, 32, 128)";
    ctx.fillRect(0, 0, CanvasWidth, CanvasHeight);

    // For each screen chunk
    for (let y = 0; y < Math.floor((CanvasHeight + SquareSize) / SquareSize); y++) {
        for (let x = 0; x < Math.floor((CanvasWidth + SquareSize) / SquareSize); x++) {
            // Select the color based on positions
            let TargetColor = { R: 175, G: 175, B: 175 };

            // If we are in a lighter square positions, make color lighter
            if (x % 2 != y % 2)
                TargetColor.R = TargetColor.G = TargetColor.B = 235;

            // Render recntagle
            ctx.fillStyle = "rgb(" + TargetColor.R + "," + TargetColor.G + "," + TargetColor.B + ")";
            ctx.fillRect(x * SquareSize, y * SquareSize, SquareSize, SquareSize);
        }
    }

    // Done rendering background
}