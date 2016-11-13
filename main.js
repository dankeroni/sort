/* jshint esversion: 6, loopfunc:true */
(function() {
    var canv, canvas, context, drawLoop, max, doneIndex, currentArray = [], readwrites = [];

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
        canv.click(() => run(insertion));
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
        //Generate an array of random numbers, range 100-10000 inclusive
        var array = Array.from({length: 50}, () => Math.floor(100 + Math.random() * 9899));
        //array.sort((a, b) => a - b);
        currentArray = (array.slice());
        max = Math.max(...array);
        addPauseListener();
        algorithm(array);
        startDrawLoop();
    }

    function bubble(array) {
        var tempArrayLength = array.length;
        var swapped = true;
        while (swapped) {
            swapped = false;
            for (let i = 0; i < tempArrayLength-1; i++) {
                if (compare(i, i+1, array) == 1) {
                    swapped = true;
                    swap(i, i+1, array);
                }
            }
            tempArrayLength--;
        }
    }

    function bogo(array) {
        var l = array.length;
        function isSorted(array) {
            for (let i = 0; i < l - 1; i++) {
                if (compare(i, i+1, array) == 1) return false;
            }
            return true;
        }

        while (!isSorted(array)) {
            for (let i = 0; i < l - 1; i++) {
                let i1 = Math.floor(Math.random() * l), i2 = Math.floor(Math.random() * l);
                swap(i1, i2, array);
            }
        }
    }

    function insertion(array) {
        for (let i = 1; i < array.length; i++) {
            for (let tempI = i; tempI > 0 && compare(tempI-1, tempI, array) == 1; tempI--) {
                swap(tempI-1, tempI, array);
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
                this.readwrite = readwrites.shift();
                //0: read, 1: write
                if (this.readwrite.type == 1) {
                    let temp = currentArray[this.readwrite.index1];
                    currentArray[this.readwrite.index1] = currentArray[this.readwrite.index2];
                    currentArray[this.readwrite.index2] = temp;
                }
            } else if (doneIndex < currentArray.length) {
                this.readwrite = null;
                doneIndex++;
            } else {
                stopDrawLoop();
                addRunListener();
            }
        }

        $.each(currentArray, (index, value) => drawBar(index, value, barWidth, index < doneIndex ? '#00ff00' : '#fff', max));

        if (typeof this.readwrite != 'undefined' && this.readwrite !== null) {
            let color = this.readwrite.type === 0 ? '#0000ff' : '#ff0000';
            drawBar(this.readwrite.index1, currentArray[this.readwrite.index1], barWidth, color, max);
            drawBar(this.readwrite.index2, currentArray[this.readwrite.index2], barWidth, color, max);
        }

        context.fillStyle = "#fff";
        context.font = "30px Arial";
        context.fillText("Click Anywhere - Insertion Sort", 50, 50);
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
