
//참고 repo: https://github.com/jnsprnw/webworker-sveltekit/tree/main
self.onmessage = function (e) {
    // console.log(e.data);
    switch (e.data.action) {
        case 'play':            
            playTimer(e.data.leftTime);
            break;
        case 'stop':
            stopTimer();
            break;
        case 'reset':
            resetTimer();
            break;
    }
};

let timer = null;
let leftTime = 0;

function playTimer(leftTime) {    
    timer = setInterval(function () {
        leftTime--;
        if (leftTime >= 0) {
            postMessage({ leftTime });
        } else{
            stopTimer()
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    stopTimer();
    leftTime = 0;
    timer = null;
    postMessage({leftTime});
}


