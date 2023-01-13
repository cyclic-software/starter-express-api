var hm = document.querySelector('.heatmap');

var heatmap = h337.create({
    container: hm,
    radius: 60
});


var trackData = false;

setInterval(function() {
    trackData = true;
}, 50);

var idleTimeout, idleInterval;

var lastX, lastY;
var idleCount;

function startIdle() {
    idleCount = 0;

    function idle() {
        heatmap.addData({
            x: lastX,
            y: lastY
        });
        idleCount++;
        if (idleCount > 10) {
            clearInterval(idleInterval);
        }
    };
    idle();
    idleInterval = setInterval(idle, 1000);
};

const video = $('#webcam')[0];
const ctrack = new clm.tracker();
ctrack.init();

const overlay = $('#overlay')[0];
const overlayCC = overlay.getContext('2d');

const videoElement = $('#webcam')[0];
const canvasElement = $('#overlay')[0];
const canvasCtx = canvasElement.getContext('2d');

var test, test2;

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // test2 = results.image;
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
            var i = 0;
            test = landmarks;
            for (var l of landmarks) {
                const x = l['x'];
                const y = l['y'];
                // console.log(x, y)
                canvasCtx.beginPath();
                canvasCtx.arc(x * canvasElement.width, y * canvasElement.height, 1, 0, 3 * Math.PI);
                canvasCtx.fillStyle = "aqua";
                // 468 max
                // 111-leftbottom 70 278 261
                /* if (i == 111 || i == 70 || i == 300 || i == 372)
                    canvasCtx.fillStyle = "aqua"; */
                canvasCtx.fill();
                i++;
            }
            // const eyesRect = getEyesRectangle(currentPosition);
            overlayCC.strokeStyle = 'red';
            overlayCC.strokeRect(landmarks[111]['x'] * canvasElement.width, landmarks[111]['y'] * canvasElement.height,
                (landmarks[372]['x'] - landmarks[111]['x']) * canvasElement.width, (landmarks[70]['y'] - landmarks[111]['y']) * canvasElement.height);

            // The video might internally have a different size, so we need these
            // factors to rescale the eyes rectangle before cropping:
            const resizeFactorX = video.videoWidth / video.width;
            const resizeFactorY = video.videoHeight / video.height;

            // // Crop the eyes from the video and paste them in the eyes canvas:
            const eyesCanvas = $('#eyes')[0];
            const eyesCC = eyesCanvas.getContext('2d');

            eyesCC.drawImage(
                video,
                landmarks[111]['x'] * canvasElement.width * resizeFactorX, landmarks[111]['y'] * canvasElement.height * resizeFactorY,
                (landmarks[372]['x'] - landmarks[111]['x']) * canvasElement.width * resizeFactorX, (landmarks[70]['y'] - landmarks[111]['y']) * canvasElement.height * resizeFactorY,
                0, 0, eyesCanvas.width, eyesCanvas.height
            );
        }
    }
    canvasCtx.restore();
}



const faceMesh = new FaceMesh({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.1/${file}`;
    }
});
faceMesh.onResults(onResults);

// Instantiate a camera. We'll feed each frame we receive into the solution.
const camera = new Camera(videoElement, {
    onFrame: async() => {
        await faceMesh.send({ image: videoElement });
    },
    width: 400,
    height: 300
});

camera.start();

/* $('#overlay').mousemove(function(e) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        test2, 0, 0, canvasElement.width, canvasElement.height);


    // console.log((e.screenX - 20) / 400, (e.screenY - 210) / 300)
    var a = (e.screenX - 20) / 400;
    var b = (e.screenY - 210) / 300;
    var i = 0;

    for (var l of test) {
        const x = l['x'];
        const y = l['y'];
        // console.log(x, y)
        canvasCtx.beginPath();
        canvasCtx.arc(x * canvasElement.width, y * canvasElement.height, 1, 0, 3 * Math.PI);
        canvasCtx.fillStyle = "green";
        // 468 max
        // 329 437 453 465
        if (x.toFixed(2) == a.toFixed(2) && y.toFixed(2) == b.toFixed(2)) {
            canvasCtx.fillStyle = "aqua";
            console.log(i)
        }
        canvasCtx.fill();
        i++;
    }
    canvasCtx.restore();

}); */


/* function trackingLoop() {

    requestAnimationFrame(trackingLoop);

    let currentPosition = ctrack.getCurrentPosition();
    overlayCC.clearRect(0, 0, 400, 300);

    if (currentPosition) {
        ctrack.draw(overlay);
    }

    if (currentPosition) {
        // Draw facial mask on overlay canvas:
        ctrack.draw(overlay);

        // Get the eyes rectangle and draw it in red:
        const eyesRect = getEyesRectangle(currentPosition);
        overlayCC.strokeStyle = 'red';
        overlayCC.strokeRect(eyesRect[0], eyesRect[1], eyesRect[2], eyesRect[3]);

        // The video might internally have a different size, so we need these
        // factors to rescale the eyes rectangle before cropping:
        const resizeFactorX = video.videoWidth / video.width;
        const resizeFactorY = video.videoHeight / video.height;

        // Crop the eyes from the video and paste them in the eyes canvas:
        const eyesCanvas = $('#eyes')[0];
        const eyesCC = eyesCanvas.getContext('2d');

        eyesCC.drawImage(
            video,
            eyesRect[0] * resizeFactorX, eyesRect[1] * resizeFactorY,
            eyesRect[2] * resizeFactorX, eyesRect[3] * resizeFactorY,
            0, 0, eyesCanvas.width, eyesCanvas.height
        );
    }
}

function onStreaming(stream) {
    video.srcObject = stream;
    ctrack.start(video);
    trackingLoop()
}

navigator.mediaDevices.getUserMedia({ video: true }).then(onStreaming); */


function getEyesRectangle(positions) {
    const minX = positions[23][0] - 5;
    const maxX = positions[28][0] + 5;
    const minY = positions[24][1] - 5;
    const maxY = positions[26][1] + 5;

    const width = maxX - minX;
    const height = maxY - minY;

    return [minX, minY, width, height];
}

function getImage() {
    // Capture the current image in the eyes canvas as a tensor.
    return tf.tidy(function() {
        const image = tf.browser.fromPixels($('#eyes')[0]);
        // Add a batch dimension:
        const batchedImage = image.expandDims(0);
        // Normalize and return it:
        return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
    });
}

var dataset = {
    train: {
        n: 0,
        x: null,
        y: null,
    },
    val: {
        n: 0,
        x: null,
        y: null,
    },
}

function captureExample() {
    // Take the latest image from the eyes canvas and add it to our dataset.
    tf.tidy(function() {
        const image = getImage();
        const mousePos = tf.tensor1d([mouse.x, mouse.y]).expandDims(0);

        // Choose whether to add it to training (80%) or validation (20%) set:
        const subset = dataset[Math.random() > 0.2 ? 'train' : 'val'];

        if (subset.x == null) {
            // Create new tensors
            subset.x = tf.keep(image);
            subset.y = tf.keep(mousePos);
        } else {
            // Concatenate it to existing tensors
            const oldX = subset.x;
            const oldY = subset.y;

            subset.x = tf.keep(oldX.concat(image, 0));
            subset.y = tf.keep(oldY.concat(mousePos, 0));
        }

        // Increase counter
        subset.n += 1;
    });
    // console.log(dataset)
    upd();

}

$('body').keyup(function(event) {
    // On space key:
    if (event.keyCode == 32) {
        captureExample();

        event.preventDefault();
        return false;
    }
});

// Track mouse movement:
const mouse = {
    x: 0,
    y: 0,

    handleMouseMove: function(event) {
        // Get the mouse position and normalize it to [-1, 1]
        mouse.x = (event.clientX / $(window).width()) * 2 - 1;
        mouse.y = (event.clientY / $(window).height()) * 2 - 1;

    },
}

document.onmousemove = mouse.handleMouseMove;

let currentModel;

function createModel() {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        kernelSize: 5,
        filters: 20,
        strides: 1,
        activation: 'relu',
        inputShape: [$('#eyes').height(), $('#eyes').width(), 3],
    }));

    model.add(tf.layers.maxPooling2d({
        poolSize: [2, 2],
        strides: [2, 2],
    }));

    model.add(tf.layers.flatten());

    model.add(tf.layers.dropout(0.2));

    // Two output values x and y
    model.add(tf.layers.dense({
        units: 2,
        activation: 'tanh',
    }));

    // Use ADAM optimizer with learning rate of 0.0005 and MSE loss
    model.compile({
        optimizer: tf.train.adam(0.0005),
        loss: 'meanSquaredError',
    });

    return model;
}

function fitModel() {
    let batchSize = Math.floor(dataset.train.n * 0.1);
    if (batchSize < 4) {
        batchSize = 4;
    } else if (batchSize > 64) {
        batchSize = 64;
    }

    if (currentModel == null) {
        currentModel = createModel();
    }
    let n = 0;
    currentModel.fit(dataset.train.x, dataset.train.y, {
        batchSize: batchSize,
        epochs: 20,
        shuffle: true,
        validationData: [dataset.val.x, dataset.val.y],
        callbacks: {
            onEpochEnd: async function(epoch, logs) {
                n++;
                $('#status').text("Epochs: " + n + '/20');
            }
        }
    }).then(info => {
        alert('Done')
    });
}


$('#train').click(function() {
    fitModel();
});

function moveTarget() {
    if (currentModel == null) {
        return;
    }
    tf.tidy(function() {
        const image = getImage();
        const prediction = currentModel.predict(image);

        // Convert normalized position back to screen position:
        const targetWidth = $('#target').outerWidth();
        const targetHeight = $('#target').outerHeight();

        // It's okay to run this async, since we don't have to wait for it.
        prediction.data().then(prediction => {
            const x = ((prediction[0] + 1) / 2) * ($(window).width() - targetWidth);
            const y = ((prediction[1] + 1) / 2) * ($(window).height() - targetHeight);

            // Move target there:
            const $target = $('#target');
            $target.css('left', x + 'px');
            $target.css('top', y + 'px');
            /*  o = $('#target').offset();
             $(".dot").css({
                 "top": y - o.top,
                 "left": x - o.left
             }); */

            // Add data to the heatmap
            if (idleTimeout) clearTimeout(idleTimeout);
            if (idleInterval) clearInterval(idleInterval);

            if (trackData) {
                lastX = x;
                lastY = y;
                heatmap.addData({
                    x: lastX,
                    y: lastY
                });
                trackData = false;
            }
            idleTimeout = setTimeout(startIdle, 500);
        });
    });
}

setInterval(moveTarget, 10);


/* $(document).mousemove(function(e) {
    //Get 'container' offset:
    o = $('.cursor').offset();
    //Track mouse position:
    $(".dot").css({
        "top": e.pageY - o.top,
        "left": e.pageX - o.left
    });
}); */

openTab(event, 'Train');

function openTab(evt, name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab ");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none ";
    }
    /* tablinks = document.getElementsByClassName("tablinks ");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active ", " ");
    } */
    document.getElementById(name).style.display = "block ";
    document.getElementById(name).className += ' active '

}

/* window.setInterval(function() {
    // console.log(is_colliding($('#drive'), $('#target')));
    if (is_colliding($('#drive'), $('#target'))) {
        $('#drive').css('border', '5px solid green');
    } else {
        $('#drive').css('border', '5px solid red');
    }
}, 500); */

var is_colliding = function($div1, $div2) {
    // Div 1 data
    var d1_offset = $div1.offset();
    var d1_height = $div1.outerHeight(true);
    var d1_width = $div1.outerWidth(true);
    var d1_distance_from_top = d1_offset.top + d1_height;
    var d1_distance_from_left = d1_offset.left + d1_width;

    // Div 2 data
    var d2_offset = $div2.offset();
    var d2_height = $div2.outerHeight(true);
    var d2_width = $div2.outerWidth(true);
    var d2_distance_from_top = d2_offset.top + d2_height;
    var d2_distance_from_left = d2_offset.left + d2_width;

    var not_colliding = (d1_distance_from_top < d2_offset.top || d1_offset.top > d2_distance_from_top || d1_distance_from_left < d2_offset.left || d1_offset.left > d2_distance_from_left);

    // Return whether it IS colliding
    return !not_colliding;
};

function download(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {
        type: contentType,
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

$('#down').click(function() {
    const data = toJSON();
    const json = JSON.stringify(data);
    download(json, 'dataset.json', 'text/plain');
});

$('#clr').click(function() {
    dataset = {
        train: {
            n: 0,
            x: null,
            y: null,
        },
        val: {
            n: 0,
            x: null,
            y: null,
        },
    };
    upd();
});

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('drive', {
        height: '472.5',
        width: '840',
        videoId: '8BdSzXQ6fCU',
        playerVars: {
            start: 441,
            controls: 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // event.target.playVideo();
}

var snd = new Audio("sound.mp3");

function show() {
    snd.play();
    $('#text').css('display', 'inline');
    setTimeout(hide, 5000); // 5 seconds
}

function hide() {
    $('#text').css('display', 'none');
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        var t = 0,
            f = 0;
        console.log('Playing')
        var r1 = Math.random() * 26
        var r2 = Math.random() * 56 + 30

        console.log(r1, r2)
        setTimeout(() => {
            show()
        }, r1 * 1000)
        setTimeout(() => {
            show()
        }, r2 * 1000)
        window.setInterval(function() {
            // console.log(is_colliding($('#drive'), $('#target')));
            if (is_colliding($('#drive'), $('#target'))) {
                $('#drive').css('border', '5px solid green');
                t++;
            } else {
                $('#drive').css('border', '5px solid red');
                f++;
            }
        }, 500);
        setTimeout(() => {
            window.clearInterval();
            var p = t / (t + f) * 100;
            $('#drive').css('border', 'none');
            stopVideo()
            alert(p + '%')
        }, 60000);
        // done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}

document.getElementById('contentFile').onchange = function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        const data = reader.result;
        const json = JSON.parse(data);
        fromJSON(json);
        upd();
    };

    reader.readAsBinaryString(file);
}

function upd() {
    $('#nt').text("Train: " + dataset['train']['n']);
    $('#nv').text("Validation: " + dataset['val']['n']);
}

function toJSON() {
    const tensorToArray = function(t) {
        const typedArray = t.dataSync();
        return Array.prototype.slice.call(typedArray);
    };

    return {
        train: {
            shapes: {
                x: dataset.train.x.shape,
                y: dataset.train.y.shape,
            },
            n: dataset.train.n,
            x: tensorToArray(dataset.train.x),

            y: tensorToArray(dataset.train.y),
        },
        val: {
            shapes: {
                x: dataset.val.x.shape,
                y: dataset.val.y.shape,
            },
            n: dataset.val.n,
            x: tensorToArray(dataset.val.x),

            y: tensorToArray(dataset.val.y),
        },
    };
};

function fromJSON(data) {
    dataset.train.n = data.train.n;
    dataset.train.x = data.train.x && [
        tf.tensor(data.train.x, data.train.shapes.x),
    ];
    dataset.train.y = tf.tensor(data.train.y, data.train.shapes.y);
    dataset.val.n = data.val.n;
    dataset.val.x = data.val.x && [
        tf.tensor(data.val.x, data.val.shapes.x),
    ];
    dataset.val.y = tf.tensor(data.val.y, data.val.shapes.y);
};