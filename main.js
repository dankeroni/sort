/* jshint esversion: 6, loopfunc:true */
(function() {
    var canv, canvas, context, drawLoop, max, barWidth, doneIndex, currentArray = [], readwrites = [];

    $(document).ready(function () {
        canv = $('#mainCanvas');
        canvas = canv.get(0);
        context = canvas.getContext('2d');
        addRunListener();
        resizeCanvas();
        $(window).resize(resizeCanvas);
    });

    function addRunListener() {
        canv.unbind('click');
        canv.click(() => run(bubbleSort));
    }

    function addPauseListener() {
        canv.unbind('click');
        canv.click(() => {stopDrawLoop(); addResumeListener();});
    }

    function addResumeListener() {
        canv.unbind('click');
        canv.click(() => {startDrawLoop(); addPauseListener();});
    }

    function startDrawLoop() {
        drawLoop = setInterval(() => drawArray(), 10);
    }

    function stopDrawLoop() {
        clearInterval(drawLoop);
    }

    function run(algorithm) {
        readwrites = [];
        doneIndex = 0;
        var array = Array.from({length: 50}, () => Math.floor(1 + Math.random() * 99999));
        //array.sort((a, b) => b-a);
        currentArray = (array.slice());
        //Just to be sure
        stopDrawLoop();
        max = Math.max(...array);
        barWidth = canvas.width / array.length;
        startDrawLoop();
        addPauseListener();
        algorithm(array);
    }

    function bubbleSort(array) {
        var tempArrayLength = array.length;
        var sorted = true;
        while (sorted) {
            sorted = false;
            for (var i = 0; i < tempArrayLength-1; i++) {
                readwrites.push({type: 0, index1: i, index2: i+1});
                if (array[i] > array[i+1]) {
                    var temp = array[i];
                    array[i] = array[i+1];
                    array[i+1] = temp;
                    sorted = true;
                    readwrites.push({type: 1, index1: i, index2: i+1});
                }
            }
            tempArrayLength--;
        }
    }

    function drawArray() {
        var readwrite;
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (readwrites.length > 0) {
            readwrite = readwrites.shift();
            //0: read, 1: write
            if (readwrite.type == 1) {
                var temp = currentArray[readwrite.index1];
                currentArray[readwrite.index1] = currentArray[readwrite.index2];
                currentArray[readwrite.index2] = temp;
            }
        } else if (doneIndex < currentArray.length) {
            doneIndex++;
        } else {
            stopDrawLoop();
            addRunListener();
        }

        $.each(currentArray, (index, value) => drawBar(index, value, barWidth, index < doneIndex ? '#00ff00' : '#fff', max));

        if (typeof readwrite !== 'undefined') {
            var color = readwrite.type === 0 ? '#0000ff' : '#ff0000';
            drawBar(readwrite.index1, currentArray[readwrite.index1], barWidth, color, max);
            drawBar(readwrite.index2, currentArray[readwrite.index2], barWidth, color, max);
        }

        context.fillStyle = "#fff";
        context.font = "30px Arial";
        context.fillText("Click Anywhere - Bubblesort", 50, 50);
    }

    function drawBar(index, value, barWidth, color, max) {
        var scaledHeight = (value / max) * canvas.height;
        context.fillStyle = color;
        context.fillRect(index * barWidth, canvas.height - scaledHeight, barWidth, scaledHeight);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawArray();
    }
})();
