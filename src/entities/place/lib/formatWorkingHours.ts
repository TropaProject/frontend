// entities/place/lib/formatWorkingHours.ts
import type { FullWorkingHours, WorkingHoursDay } from "@/entities/place/model/types";

const DAY_LABELS: Record<string, string> = {
    mon: "понедельник", tue: "вторник", wed: "среда", thu: "четверг", fri: "пятница", sat: "суббота", sun: "воскресенье",
};

const DAY_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

const FULL_DAY_TO_SHORT: Record<string, string> = {
    "monday": "mon", "tuesday": "tue", "wednesday": "wed",
    "thursday": "thu", "friday": "fri", "saturday": "sat", "sunday": "sun",
};

const RANGE_TO_DAYS: Record<string, string[]> = {
    // Полная неделя
    "Mo-Su": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    "Пн-Вс": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    "Mon-Sun": ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],

    // Будни
    "Mo-Fr": ["mon", "tue", "wed", "thu", "fri"],
    "Пн-Пт": ["mon", "tue", "wed", "thu", "fri"],
    "Mon-Fri": ["mon", "tue", "wed", "thu", "fri"],

    // Выходные
    "Sa-Su": ["sat", "sun"],
    "Сб-Вс": ["sat", "sun"],
    "Sat-Sun": ["sat", "sun"],

    // Пн-Сб
    "Mo-Sa": ["mon", "tue", "wed", "thu", "fri", "sat"],
    "Пн-Сб": ["mon", "tue", "wed", "thu", "fri", "sat"],
    "Mon-Sat": ["mon", "tue", "wed", "thu", "fri", "sat"],

    // Пн-Чт
    "Mo-Th": ["mon", "tue", "wed", "thu"],
    "Пн-Чт": ["mon", "tue", "wed", "thu"],
    "Mon-Thu": ["mon", "tue", "wed", "thu"],

    // Пт-Вс
    "Fr-Su": ["fri", "sat", "sun"],
    "Пт-Вс": ["fri", "sat", "sun"],
    "Fri-Sun": ["fri", "sat", "sun"],

    // Пт-Сб
    "Fr-Sa": ["fri", "sat"],
    "Пт-Сб": ["fri", "sat"],
    "Fri-Sat": ["fri", "sat"],

    // Вт-Чт
    "Tu-Th": ["tue", "wed", "thu"],
    "Вт-Чт": ["tue", "wed", "thu"],
    "Tue-Thu": ["tue", "wed", "thu"],

    // Ср-Вс
    "We-Su": ["wed", "thu", "fri", "sat", "sun"],
    "Ср-Вс": ["wed", "thu", "fri", "sat", "sun"],
    "Wed-Sun": ["wed", "thu", "fri", "sat", "sun"],

    // Пн-Ср
    "Mo-We": ["mon", "tue", "wed"],
    "Пн-Ср": ["mon", "tue", "wed"],
    "Mon-Wed": ["mon", "tue", "wed"],

    // Чт-Вс
    "Th-Su": ["thu", "fri", "sat", "sun"],
    "Чт-Вс": ["thu", "fri", "sat", "sun"],
    "Thu-Sun": ["thu", "fri", "sat", "sun"],

    // Пн-Вт
    "Mo-Tu": ["mon", "tue"],
    "Пн-Вт": ["mon", "tue"],
    "Mon-Tue": ["mon", "tue"],

    // Отдельные дни
    "Mo": ["mon"], "Пн": ["mon"], "Mon": ["mon"],
    "Tu": ["tue"], "Вт": ["tue"], "Tue": ["tue"],
    "We": ["wed"], "Ср": ["wed"], "Wed": ["wed"],
    "Th": ["thu"], "Чт": ["thu"], "Thu": ["thu"],
    "Fr": ["fri"], "Пт": ["fri"], "Fri": ["fri"],
    "Sa": ["sat"], "Сб": ["sat"], "Sat": ["sat"],
    "Su": ["sun"], "Вс": ["sun"], "Sun": ["sun"],
};

const isOpen = (hours: string): boolean =>
    !!(hours && hours !== "closed" && hours !== "закрыто");

const is24h = (hours: string): boolean =>
    hours === "00:00-23:59" || hours === "00:00-00:00" || hours.toLowerCase() === "круглосуточно";

const normalizeWorkingHours = (json: Record<string, unknown>): Record<string, string> => {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(json)) {
        // Формат 1: "mon": "10:00-22:00"
        if (DAY_ORDER.includes(key as typeof DAY_ORDER[number])) {
            result[key] = String(value);
            continue;
        }

        // Формат 2: "monday": "Круглосуточно"
        const shortKey = FULL_DAY_TO_SHORT[key.toLowerCase()];
        if (shortKey) {
            result[shortKey] = String(value);
            continue;
        }

        // Формат 3: "Mo-Su": ["06:00-23:00"]
        const days = RANGE_TO_DAYS[key];
        if (days && Array.isArray(value)) {
            const hours = String(value[0] ?? "closed");
            for (const day of days) {
                result[day] = hours;
            }
            continue;
        }

        // Формат 3 с одинарным значением: "Mo-Su": "06:00-23:00"
        if (days && typeof value === "string") {
            for (const day of days) {
                result[day] = value;
            }
        }
    }

    // Заполняем отсутствующие дни как closed
    for (const day of DAY_ORDER) {
        if (!result[day]) {
            result[day] = "closed";
        }
    }

    return result;
};

const formatDayRange = (days: string[]): string => {
    if (days.length === 0) return "";
    if (days.length === 7) return "Без выходных";

    const sorted = days.sort(
        (a, b) => DAY_ORDER.indexOf(a as typeof DAY_ORDER[number]) - DAY_ORDER.indexOf(b as typeof DAY_ORDER[number])
    );

    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        const prevIdx = DAY_ORDER.indexOf(end as typeof DAY_ORDER[number]);
        const currIdx = DAY_ORDER.indexOf(sorted[i] as typeof DAY_ORDER[number]);
        if (currIdx - prevIdx === 1) {
            end = sorted[i];
        } else {
            ranges.push(start === end ? DAY_LABELS[start] : `${DAY_LABELS[start]}-${DAY_LABELS[end]}`);
            start = sorted[i];
            end = sorted[i];
        }
    }
    ranges.push(start === end ? DAY_LABELS[start] : `${DAY_LABELS[start]}-${DAY_LABELS[end]}`);

    return ranges.join(", ").toUpperCase();
};

export const formatWorkingHours = (json: Record<string, unknown> | null): FullWorkingHours | undefined => {
    if (!json) return undefined;

    const normalized = normalizeWorkingHours(json);

    const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).toLowerCase().slice(0, 3);
    const todayHours = normalized[today];

    const schedule: WorkingHoursDay[] = DAY_ORDER.map((d) => ({
        day: DAY_LABELS[d],
        hours: normalized[d] || "closed",
        isToday: d === today,
    }));

    const allOpenDays = DAY_ORDER.filter(d => isOpen(normalized[d]));
    const all24h = allOpenDays.length === 7 && allOpenDays.every(d => is24h(normalized[d]));
    const allSame = allOpenDays.length === 7 && new Set(allOpenDays.map(d => normalized[d])).size === 1;

    let time: string;
    let status: string;
    let timeLabel: string;

    if (allOpenDays.length === 0) {
        time = "Закрыто";
        status = "Закрыто";
        timeLabel = "Часы работы";
    } else if (all24h) {
        time = "Круглосуточно";
        status = "Без выходных";
        timeLabel = "Часы работы";
    } else if (allSame) {
        time = normalized[allOpenDays[0]];
        status = "Без выходных";
        timeLabel = "Часы работы";
    } else {
        status = formatDayRange(allOpenDays);
        time = isOpen(todayHours) ? todayHours : "Сегодня выходной";
        timeLabel = "Часы работы (сегодня)";
    }

    return { time, status, schedule, timeLabel };
};