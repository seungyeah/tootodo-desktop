import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { CalendarDate } from "@internationalized/date";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};

// date
import {
    type DateValue,
    getLocalTimeZone,
    today,
} from "@internationalized/date";

export type DateRange = {
    start: undefined | DateValue;
    end: undefined | DateValue;
};

export function getMonday(date: Date): CalendarDate {
    const dayOfWeek = date.getDay();
    // 일요일인 경우를 처리 (일요일을 주의 시작으로 간주하지 않기 위해 7을 더함)
    const day = dayOfWeek === 0 ? 7 : dayOfWeek;

    const monday = new Date(date);
    monday.setDate(date.getDate() - day + 1);
    return new CalendarDate(monday.getFullYear(), monday.getMonth() + 1, monday.getDate());
}

export function getThis3WeeksRange(): DateRange {
    const todayValue = today(getLocalTimeZone());
    const monday = getMonday(todayValue.toDate());
    return {
        start: monday.subtract({ days: 7 }),
        end: monday.add({ days: 13 }),
    };
}

export function getThisMonthRange(): DateRange {
    const todayValue = today(getLocalTimeZone());
    return {
        start: new CalendarDate(todayValue.year, todayValue.month, 1),
        end: new CalendarDate(todayValue.year, todayValue.month, 31),
    }
}

export function countMonths(
    dates: CalendarDate[],
): { month: number; count: number }[] {
    if (!dates) return [];
    let monthCounts = [{ month: 0, count: 0 }];

    dates.forEach((date) => {
    const month = date.toDate().getMonth() + 1; // 월을 1부터 시작하도록 변경
    let monthEntry = monthCounts.find((entry) => entry.month === month);

    if (monthEntry) {
        monthEntry.count++;
    } else {
        monthCounts.push({ month, count: 1 });
    }
    });

    // 기본 초기화 객체를 제거
    return monthCounts.filter((entry) => entry.month !== 0);
}

export function getDuration(start: CalendarDate, end: CalendarDate): number {
    if (!start || !end) return 0; // 두 날짜 간의 차이를 밀리초 단위로 계산
    const timeDifference = end.toDate() - start.toDate();

    // 밀리초를 일 단위로 변환
    const msInADay = 86_400_000;
    const diff = Math.floor(timeDifference / msInADay);
    return diff;
}

// 범위 내의 모든 날짜를 배열로 반환
export function getDatesInRange(start: CalendarDate, end: CalendarDate) {
    if (!start || !end) return [];
    let dates = [];
    let currentDate = start;

    while (currentDate.compare(end) <= 0) {
    dates.push(currentDate);
    currentDate = currentDate.add({ days: 1 });
    }

    return dates;
}``