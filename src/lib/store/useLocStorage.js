// 참고 문서: https://joyofcode.xyz/svelte-todo-app#:~:text=%F0%9F%96%8C%EF%B8%8F%20Create%20a%20new%20file%20useStorage.ts%20inside%20src/stores.

import { writable, derived } from 'svelte/store';

export function createLocStorage(key, initialValue) {
    let serialize = JSON.stringify;
    let deserialize = JSON.parse;

    if (typeof window !== 'undefined') {
        // 브라우저 환경일 때
        let storedValue = deserialize(localStorage.getItem(key));
        let store = writable(storedValue || initialValue);

        store.subscribe(value => localStorage.setItem(key, serialize(value)));
        return store;
    } else {
        // 브라우저가 아닌 환경일 때 (SSR, Node.js)
        return writable(initialValue);
    }
}

export const timerOpen = createLocStorage('timerOpen', false);
export const timerStopTime = createLocStorage('timerStopTime', 0);
export const timerSetting = createLocStorage('timerSetting', {
        working: 25,
        breaking: 5,
        cycles: [
            {startTime: "", endTime: "",done:false,leftTime:25,studyTime:0},
            {startTime: "", endTime: "",done:false,leftTime:25,studyTime:0},
            {startTime: "", endTime: "",done:false,leftTime:25,studyTime:0},
        ],
        remain: 5,
        duration: 90,
        startTime:"",
        endTime:"",
        // alarmSessionChanged: true,
        // alarmTimerDone: true,
    }
);


export const timerStatus = createLocStorage('timerStatus', {
    play: true,
    workSession: true,
    cycle: 0,
    startTime:"",
    endTime:"",
    leftTime: 0,
    studyTime: 0,
    stopTime:0,
});
