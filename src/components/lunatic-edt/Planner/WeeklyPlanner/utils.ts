import { DayDetailType, IODataStructure, WeeklyPlannerDataType } from "../../../../interface/lunatic-edt/WeeklyPlannerTypes";
import { convertTime, formateDateToFrenchFormat } from "../../../../utils/lunatic-edt/utils";

export const INTERVAL = 15;
const DAY_TIME_SEPARATOR = "_";
const STARTED_LABEL = "started";

/**
 * Converts a time string in the format "HHhMM" to a Date object.
 *
 * @param {string} time - The time string to be converted.
 * @returns {Date} - A Date object representing the given time on the current date.
 */
const convertTimeAsDate = (time: string): Date => {
    const result: Date = new Date();
    const splittedTime = time.split("h");
    result.setHours(Number(splittedTime[0]));
    result.setMinutes(Number(splittedTime[1]));
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
};

/**
 * Updates the current day object with the given value and language, and pushes the current detail to the day's details.
 *
 * @param {DayDetailType | undefined} currentDetail - The current detail object (start-end-duration).
 * @param {WeeklyPlannerDataType} currentDay - The current day to be updated.
 * @param {string} value - The date value to be set for the current day.
 * @param {string} language - The language to be used for formatting the day name.
 * @returns {WeeklyPlannerDataType}
 */
const keyWithoutSeparator = (
    currentDetail: DayDetailType | undefined,
    currentDay: WeeklyPlannerDataType,
    value: string,
    language: string,
) => {
    if (currentDetail) {
        currentDay.detail.push(currentDetail);
    }
    const dayFormatted = formateDateToFrenchFormat(new Date(value), language, { weekday: "long" });
    currentDay = {
        hasBeenStarted: false,
        date: value,
        day: dayFormatted,
        detail: [],
    };
    return currentDay;
};

/**
 * Transforms an array of collected datastructure into weekly planner data types.
 *
 * @param {IODataStructure[]} input - An array of IO data structures (collected data).
 * @param {string} language - The language to be used for day names.
 * @returns {WeeklyPlannerDataType[]} - An array of weekly planner data objects.
 */
export const transformToWeeklyPlannerDataType = (
    input: IODataStructure[],
    language: string,
): WeeklyPlannerDataType[] => {
    const result: WeeklyPlannerDataType[] = [];
    let currentDay: WeeklyPlannerDataType = {
        hasBeenStarted: false,
        date: "",
        day: "",
        detail: [],
    };
    let currentDetail: DayDetailType | undefined = undefined;
    let previousTime: Date;

    input &&
        input.length > 1 &&
        input.forEach(i => {
            const key = Object.keys(i)?.[0];
            const value = Object.values(i)[0];
            if (!key.includes(DAY_TIME_SEPARATOR)) {
                currentDay = keyWithoutSeparator(currentDetail, currentDay, value, language);
                currentDetail = undefined;
                result.push(currentDay);
            } else if (key.includes(STARTED_LABEL)) {
                currentDay.hasBeenStarted = value === "true";
            } else {
                const timeAsString = key.split(DAY_TIME_SEPARATOR)[1];
                const timeAsDate = convertTimeAsDate(timeAsString);
                currentDay.hasBeenStarted = true;
                if (!currentDetail) {
                    currentDetail = {
                        start: timeAsString,
                        end: timeAsString,
                        duration: INTERVAL,
                    };
                } else {
                    const nextSlot = previousTime;
                    nextSlot.setMinutes(nextSlot.getMinutes() + INTERVAL);
                    if (nextSlot.getTime() === timeAsDate.getTime()) {
                        currentDetail.end = timeAsString;
                        currentDetail.duration = currentDetail.duration + INTERVAL;
                    } else {
                        currentDay.detail.push(currentDetail);
                        currentDetail = {
                            start: timeAsString,
                            end: timeAsString,
                            duration: INTERVAL,
                        };
                    }
                }
                previousTime = timeAsDate;
            }
        });

    if (currentDetail) {
        currentDay.detail.push(currentDetail);
    }
    return result;
};

/**
 * Transforms weekly planner data into an IO data structure.
 *
 * @param {WeeklyPlannerDataType[]} data - An array of weekly planner data objects.
 * @returns {[IODataStructure, string[], string[], any[]]} - A tuple containing:
 *   - IODataStructure: An object representing which date are to be collected.
 *   - string[]: An array of dates for the week.
 *   - string[]: An array of strings indicating whether each day has been started.
 *   - any[]: An array of arrays, each containing time keys for the hours set for each day.
 */
export const transformToIODataStructure = (
    data: WeeklyPlannerDataType[],
): [IODataStructure[], string[], string[], any[]] => {
    const result: IODataStructure[] = [];
    const datesWeek: string[] = new Array(7);
    const datesWeekStarted: string[] = new Array(7);
    const hourSetter = new Array(7);
    for (let i = 0; i < 7; i++) {
        const dayKey = `dateJ${i + 1}`;
        result.push({ [dayKey]: data[i]?.date });
        const dayStarted = `${dayKey}${DAY_TIME_SEPARATOR}${STARTED_LABEL}`;
        result.push({ [dayStarted]: data[i]?.hasBeenStarted.toString() });
        datesWeek[i] = data[i]?.date;
        datesWeekStarted[i] = data[i]?.hasBeenStarted.toString();

        data[i]?.detail.forEach(d => {
            const time: Date = new Date();
            const splittedTime = d.start.split("H");
            time.setHours(Number(splittedTime[0]));
            time.setMinutes(Number(splittedTime[1]));
            const times = [];
            for (let j = 0; j < d.duration / INTERVAL; j++) {
                const timeKey = `${dayKey}${DAY_TIME_SEPARATOR}${convertTime(time)}`;
                result.push({ [timeKey]: "true" });
                time.setMinutes(time.getMinutes() + INTERVAL);
                times.push(timeKey);
            }
            hourSetter[i] = times;
        });
    }
    return [result, datesWeek, datesWeekStarted, hourSetter];
};

/**
 * Returns number between 0 and 100 depending on how many days of the week for which editing has been started
 * at the end discrete values between 1/7 and 7/7 rounded as %
 * @returns
 */
export const getProgressBarValue = (activityData: WeeklyPlannerDataType[]): number => {
    return Math.round((activityData.filter(a => a.hasBeenStarted === true).length / 7) * 100);
};
