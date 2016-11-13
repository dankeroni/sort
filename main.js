/* jshint esversion: 6, loopfunc:true */
(function() {
    var canv, canvas, context, drawLoop, max, readwrite, doneIndex, currentArray = [], readwrites = [];

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
        canv.click(() => run(bubble));
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
        drawLoop = setInterval(() => drawArray(false), 10);
    }

    function stopDrawLoop() {
        clearInterval(drawLoop);
    }

    function run(algorithm) {
        readwrites = [];
        doneIndex = 0;
        var array = Array.from({length: 50}, () => Math.floor(1 + Math.random() * 99999));
        //array.sort((a, b) => a - b);
        currentArray = (array.slice());
        max = Math.max(...array);
        addPauseListener();
        algorithm(array);
        startDrawLoop();
    }

    function bubble(array) {
        var tempArrayLength = array.length;
        var sorted = true;
        while (sorted) {
            sorted = false;
            for (var i = 0; i < tempArrayLength-1; i++) {
                if (compare(i, i+1, array) == 1) {
                    sorted = true;
                    swap(i, i+1, array);
                }
            }
            tempArrayLength--;
        }
    }

    function bogo(array) {
        var l = array.length;
        function isSorted(array) {
            for (var i = 0; i < l - 1; i++) {
                if (compare(i, i+1, array) == 1) return false;
            }
            return true;
        }

        while (!isSorted(array)) {
            for (var i = 0; i < l - 1; i++) {
                var i1 = Math.floor(Math.random() * l), i2 = Math.floor(Math.random() * l);
                swap(i1, i2, array);
            }
        }
    }

    //Returns: -1=array[i1]<array[i2], 0=array[i1]==array[i2], 1=array[i1]>array[i2]
    function compare(i1, i2, array) {
        readwrites.push({type: 0, index1: i1, index2: i2});
        var v1 = array[i1], v2 = array[i2];
        return v1 > v2 ? 1 : v1 == v2 ? 0 : -1;
    }

    function swap(i1, i2, array) {
        readwrites.push({type: 1, index1: i1, index2: i2});
        var temp = array[i1];
        array[i1] = array[i2];
        array[i2] = temp;
    }

    function drawArray(resize) {
        var barWidth = canvas.width / currentArray.length;
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (!resize) {
            if (readwrites.length > 0) {
                readwrite = readwrites.shift();
                //0: read, 1: write
                if (readwrite.type == 1) {
                    var temp = currentArray[readwrite.index1];
                    currentArray[readwrite.index1] = currentArray[readwrite.index2];
                    currentArray[readwrite.index2] = temp;
                }
            } else if (doneIndex < currentArray.length) {
                readwrite = null;
                doneIndex++;
            } else {
                stopDrawLoop();
                addRunListener();
            }
        }

        $.each(currentArray, (index, value) => drawBar(index, value, barWidth, index < doneIndex ? '#00ff00' : '#fff', max));

        if (typeof readwrite != 'undefined' && readwrite !== null) {
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
        drawArray(true);
    }
})();
