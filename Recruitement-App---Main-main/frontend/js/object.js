var model

console.log('loading coco-ssd model...')
cocoSsd.load().then(function (res) {
    model = res
    console.log('done')
    $("#upload_btn_div").attr('title', 'Ready')
    $("#web-cam-btn").attr('title', 'Ready')
    setTimeout(function () {
        $("#upload_btn_div").attr('title', '')
        $("#web-cam-btn").attr('title', '')
    }, 1000)
    $("#upload_btn_div>a").removeClass('disabled')
    $("#web-cam-btn>a").removeClass('disabled')
}, function () {
    //failure
    console.log('loading tf model failed')
    $("#upload_btn_div").attr('title', 'Failed to load tf model in browser')
    $("#web-cam-btn").attr('title', 'Failed to load tf model in browser')
});

function draw_sample_image_in_canvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    var imageObj = new Image();
    canvas.width = 888;
    canvas.height = 500;

    imageObj.onload = function () {
        ctx.drawImage(imageObj, 0, 0, 888, 500);
    };
    imageObj.src = 'images/tfjs-sample.png';
}
draw_sample_image_in_canvas()

function invoke_upload_image() {
    $("#upload-btn").click();
}

function draw_bbox(ctx, predictions, font) {
    predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];
        ctx.strokeRect(x, y, width, height);
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });
}

function draw_label(ctx, predictions) {
    predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];

        ctx.fillStyle = "#000000";
        ctx.fillText(prediction.class, x, y);
    });
}

function draw_res_image(canvas, ctx, image, predictions) {
    const font = "16px sans-serif";

    canvas.width = image.width;
    canvas.height = image.height;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 3;
    ctx.fillStyle = "#00FFFF";

    $('#spinner').hide()
    draw_bbox(ctx, predictions, font)
    draw_label(ctx, predictions)
}

function upload_image() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    var input_elem = document.querySelector('input[type=file]')
    var file = input_elem.files[0]; //sames as here
    const image = document.getElementById('img');

    var reader = new FileReader();
    reader.addEventListener("load", function () {
        image.src = reader.result;

        setTimeout(function () {
            if (image.height > 500) {
                image.width = image.width * (500 / image.height)
                image.height = 500
            }

            model.detect(image).then(function (predictions) {
                draw_res_image(canvas, ctx, image, predictions)
            })
        }, 1000)
    }, false);

    if (file) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        $('#spinner').show()
        reader.readAsDataURL(file);
    }
}

function drawVideoPredictions(predictions) {
    const c = document.getElementById("canvas");
    const ctx = c.getContext("2d");
    c.width = 700;
    c.height = 500;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];
        // Draw the bounding box.
        ctx.strokeStyle = "#00FFFF";
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);
        // Draw the label background.
        ctx.fillStyle = "#00FFFF";
        const textWidth = ctx.measureText(prediction.class).width;
        const textHeight = parseInt(font, 10); // base 10
        ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(prediction.class, x, y);
    });
}

var video
var localstream

function close_stream() {
    video = document.getElementById("video")
    video.pause()
    video.src = ""
    tracks = localstream.getTracks()
    tracks[0].stop();

    setTimeout(function () {
        draw_sample_image_in_canvas()
        $('#close-web-cam').addClass('display-none')
        $('#web-cam-btn').removeClass('display-none')
    }, 1000)
}

function detectFrame() {
    model.detect(video).then(predictions => {
        console.log("user",predictions.length)
        if(predictions.length>1){
            alert(`Please check your enviornment ${predictions.length} persons identified`)
        }
        if(predictions[0])
      { 
        //    console.log(predictions[0].class)

        if(predictions[0].class!="person"){
            if(predictions[0].class=="cell phone"){
                alert(`Dont use ${predictions[0].class}`)
            }
            else{
                alert(`${predictions[0].class} detected`)

            }
        }
        if(predictions[0].class=="person"){
        document.getElementById('proceed').disabled = false;
        }
      }
        drawVideoPredictions(predictions)
        if (video.srcObject.active) {
            requestAnimationFrame(detectFrame)
        }
    })
}

function load_webcam() {
    video = document.getElementById("video")

    navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                facingMode: "user",
                width: 700,
                height: 500
            }
        })
        .then(stream => {
            video.srcObject = stream
            localstream = stream
            video.onloadedmetadata = () => {
                video.play()
                $('#web-cam-btn').addClass('display-none')
                $('#close-web-cam').removeClass('display-none')
                detectFrame()
            }
        }, function () {
            $.toaster({ settings: { timeout: 5000 }, title: '', message: 'Error: Could not retrive webcam feed', priority: 'danger' });
        })
}


// function show(value){
//      document.getElementById("displayobject").innerHTML(`<h3>${value}<h3>`)

// }