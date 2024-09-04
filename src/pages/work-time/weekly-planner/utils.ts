import { IODataStructure } from "@inseefrlab/lunatic-edt/src/interface/WeeklyPlannerTypes";
import { LunaticData } from "interface/lunatic/Lunatic";

export const createDataWeeklyPlanner = (data: LunaticData) => {
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
