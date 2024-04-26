
//참고 repo: https://github.com/jnsprnw/webworker-sveltekit/tree/main
let timer = null;
let leftTime = 25;

let stopTimerInterval = null;
let stopTime = 0;

self.onmessage = (e) => {
    // console.log(e.data);
    switch (e.data.action) {
        case 'play':
            playTimer(e.data.leftTime);
            break;
        case 'stop':
            stopTimer(e.data.stopTime, e.data.sessionSwitched);
            break;
        case 'reset':
            resetTimer();
            break;
    }
};

async function playTimer(leftTime) {
    await clearInterval(stopTimerInterval);
    stopTimerInterval = null;
    timer = setInterval(async () => {
        leftTime--;
        if (leftTime >= 0) {
            postMessage({ leftTime });
        } else {
            await stopTimer()
        }
    }, 1000);
}

async function stopTimer(stopTime, sessionSwitched) {
    await clearInterval(timer);
    if(!sessionSwitched){
        stopTimerInterval = setInterval(() => {
            stopTime++;
            postMessage({ stopTime });
        }, 1000);
    }   
}

async function resetTimer() {
    await stopTimer();
    clearInterval(stopTimerInterval);
    clearInterval(timer);
    leftTime = 25;
    timer = null;
    stopTimerInterval = null;
    stopTime = 0;
    postMessage({ leftTime });
}


