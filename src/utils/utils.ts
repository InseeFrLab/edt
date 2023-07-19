import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Location } from "react-router-dom";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";

function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}

function objectEquals(a: any, b: any) {
    for (let prop in a) {
        if (a != null && Object.prototype.hasOwnProperty.call(a, prop)) {
            if (b != null && Object.prototype.hasOwnProperty.call(b, prop)) {
                if (typeof a[prop] === "object") {
                    if (!objectEquals(a[prop], b[prop])) return false;
                } else {
                    if (a[prop] !== b[prop]) return false;
                }
            } else {
                return false;
            }
        }
    }
    return true;
}

function getSurveyIdFromUrl(context: OrchestratorContext, location: Location) {
    const pathSurveyRoot =
        getCurrentSurveyRootPage() == EdtRoutesNameEnum.ACTIVITY ? "activity/" : "work-time/";
    let idSurveyPath = location.pathname.split(pathSurveyRoot)[1].split("/")[0];
    let idSurvey = context.idSurvey != idSurveyPath ? idSurveyPath : context.idSurvey;
    return idSurvey;
}

export { getSurveyIdFromUrl, groupBy, objectEquals };
