// https://svelte-ux.techniq.dev/docs/stores/timerStore
import { writable } from 'svelte/store';
export type TimerOptions<T> = {
  initial?: T;
  delay?: number;
  disabled?: boolean;

  /** Called on each interval tick.  Returned value is used to update store value, defaulting to current Date */
  onTick?: (current: T | null) => any;
};

/**
 * Subscribable timer store
 */
export default function timerStore<T = any>(options: TimerOptions<T> = {}) {
  let initial = options.initial ?? null;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let delay = options.delay ?? 1000;
  const isRunning = writable(false);

  const state = writable<T | null>(initial, () => {
    if (!options.disabled) {
      start();
    }

    return () => stop();
  });

  function start() {
    stop();
    intervalId = setInterval(() => {
      state.update((current) => options.onTick?.(current) ?? new Date());
    }, delay);
    isRunning.set(true);
  }

  function stop() {
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = null;
    isRunning.set(false);
  }

  function reset() {
    return state.set(initial);
  }

  function getDelay() {
    return delay;
  }

  function setDelay(value: number) {
    stop();
    delay = value;
    start();
  }


  return {
    ...state,
    start,
    stop,
    reset,
    isRunning,
    getDelay,
    setDelay,
  };
}

export function formatTime(date) {
  if (!date) {
    return '--:--';
  }
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatTimeFull(date) {
  if (!date) {
    return '__ --:-- ';
  }
  const AMPM = date.getHours() >= 12 ? 'PM' : 'AM';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${AMPM} ${hours}:${minutes}`;
}

export function formatDay(date) {
  if (!date) {
    return '____-__-__';
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const currentTime = timerStore({ initial: new Date() });
