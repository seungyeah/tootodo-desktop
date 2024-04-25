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


const remainingCycles = derived(
    timerSetting,
    ($timerSetting) => {
      const { working, breaking, cycles } = $timerSetting;
      const updatedCycles = [...cycles];
  
      for (let i = 0; i < updatedCycles.length; i++) {
        const cycle = updatedCycles[i];
  
        if (!cycle.endTime) {
          break;
        }
  
        if (i === updatedCycles.length - 1) {
          continue;
        }
  
        const nextCycle = updatedCycles[i + 1];
        nextCycle.startTime = new Date(cycle.endTime).getTime() + breaking * 60 * 1000;
        nextCycle.endTime = new Date(nextCycle.startTime).getTime() + working * 60 * 1000;
        nextCycle.leftTime = working;
      }
  
      return updatedCycles;
    }
  );


const remainCycles = derived(timerSetting, ($timerSetting) => {
    const { cycles, working, breaking } = $timerSetting;
   
    // 기존 cycles 배열을 복사하여 새로운 배열 생성
    const updatedCycles = [...cycles];
   
    // cycles 배열을 순회하며 endTime이 변경된 경우 다음 cycle의 startTime, endTime 업데이트
    for (let i = 0; i < updatedCycles.length - 1; i++) {
      const currentCycle = updatedCycles[i];
      const nextCycle = updatedCycles[i + 1];
   
      if (currentCycle.endTime !== cycles[i].endTime) {
        const newStartTime = new Date(currentCycle.endTime).getTime() + breaking * 60 * 1000;
        const newEndTime = newStartTime + working * 60 * 1000;
   
        nextCycle.startTime = new Date(newStartTime);
        nextCycle.endTime = new Date(newEndTime);
        nextCycle.leftTime = working;
      }
    }
   
    return updatedCycles;
   });