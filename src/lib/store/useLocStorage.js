// 참고 문서: https://joyofcode.xyz/svelte-todo-app#:~:text=%F0%9F%96%8C%EF%B8%8F%20Create%20a%20new%20file%20useStorage.ts%20inside%20src/stores.

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import moment from 'moment';
export function createLocStorage(key, initialValue) {
    let serialize = JSON.stringify;
    let deserialize = JSON.parse;

    if (browser) {
        //get stored value
        let storedValue = deserialize(localStorage.getItem(key));

        //if value is stored, use it. Otherwise use initialValue
        let store = writable(storedValue || initialValue);

        //subscribe to store and save changes to localStorage
        store.subscribe(value => localStorage.setItem(key, serialize(value)));

        return store;
    }
    //TODO: 뭘 리턴해야할지 모르겠음. 일단 undefined 리턴
    return undefined;
}

export const todoList = createLocStorage('todoList', []);

export const selectedDate = createLocStorage('selectedDate', moment());

export const settings = createLocStorage('settings', {
    working: 50,
    breaking: 10,
    repeat: 3, //tod o 마지막에 breaking없음
    dayStartTime: 9,
    dayEndTime: 24,
    alarmSession: true,
    alarmDone: true,
    bgm: null,
}
);
