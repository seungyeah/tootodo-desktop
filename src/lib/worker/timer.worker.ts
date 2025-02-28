let timerInterval: ReturnType<typeof setInterval> | null = null;
let currentTime = 0;
let stopTime = 0;

self.onmessage = (e: MessageEvent) => {
    const { action, leftTime, stopTime: initialStopTime, sessionSwitched } = e.data;

    switch (action) {
        case 'play':
            if (timerInterval) clearInterval(timerInterval);
            currentTime = leftTime;

            timerInterval = setInterval(() => {
                if (currentTime > 0) {
                    currentTime--;
                    self.postMessage({ leftTime: currentTime });

                    if (currentTime === 0) {
                        clearInterval(timerInterval);
                        timerInterval = null;
                    }
                }
            }, 1000);
            break;

        case 'stop':
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            if (!sessionSwitched) {
                stopTime = initialStopTime + 1;
                self.postMessage({ stopTime });
            }
            break;

        case 'reset':
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            currentTime = 0;
            stopTime = 0;
            break;
    }
};
