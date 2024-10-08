
import { IODataStructure } from "../../../interface/lunatic-edt/WeeklyPlannerTypes";
import { LunaticData } from "../../../interface/lunatic/Lunatic";

/**
 * Creates a weekly planner data structure (IODataStructure[]) from the provided LunaticData.
 *
 * This function processes the collected data from a LunaticData object and generates
 * an array of IODataStructure necessary to display and manage the weekly planner.
 * This data structure was originally sent to StromaeBackOffice to be saved, 
 * but it is now removed from the collected data before sending it.
 * 
 * @param {LunaticData} data - The input data retrieved from StromaeBackOffice.
 * @returns {IODataStructure[]} The resulting weekly planner data structure.
 *
 */
export const createDataWeeklyPlanner = (data: LunaticData): IODataStructure[] => {
    const result: IODataStructure[] = [];
    const timeFormatRegex = /^S_\d{2}H\d{2}$/;
    if (!data.COLLECTED) {
        return result;
    }

    // Get variable of structure dateJ and dateJ_started
    for (let i = 0; i < 7; i++) {
        if (Array.isArray(data.COLLECTED.DATES?.COLLECTED)) {
            result.push({
                [`dateJ${i + 1}`]: String(data.COLLECTED.DATES.COLLECTED[i] ?? ""),
            });
        } else {
            result.push({
                [`dateJ${i + 1}`]: "",
            });
        }

        if (Array.isArray(data.COLLECTED.DATES_STARTED?.COLLECTED)) {
            result.push({
                [`dateJ${i + 1}_started`]: String(data.COLLECTED.DATES_STARTED.COLLECTED[i] ?? ""),
            });
        } else {
            result.push({
                [`dateJ${i + 1}_started`]: "",
            });
        }
    }

    // Get variables of the form dateJx_time
    for (const key in data.COLLECTED) {
        if (!timeFormatRegex.test(key)) {
            break;
        }

        const collectedData = data.COLLECTED[key]?.COLLECTED;
        if (Array.isArray(collectedData)) {
            for (let i = 0; i < 7; i++) {
                const value = String(collectedData[i] ?? "");
                if (value !== "") {
                    result.push({
                        [`dateJ${i + 1}_${key}`]: value,
                    });
                }
            }
        }
    }

    return result;
};
