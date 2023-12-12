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

function hasOwnProperty(obj: any, prop: string) {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, prop);
}

function objectEquals(a: any, b: any) {
    for (let prop in a) {
        if (hasOwnProperty(a, prop)) {
            if (hasOwnProperty(b, prop)) {
                comparaisonPropsValues(a, b, prop);
            } else {
                return false;
            }
        }
    }
    return true;
}

function comparaisonPropsValues(obj1: any, obj2: any, prop: string) {
    if (typeof obj1[prop] === "object") {
        if (!objectEquals(obj1[prop], obj2[prop])) return false;
    } else {
        if (obj1[prop] !== obj2[prop]) return false;
    }
}

function getSurveyIdFromUrl(context: OrchestratorContext, location: Location) {
    const pathSurveyRoot =
        getCurrentSurveyRootPage() == EdtRoutesNameEnum.ACTIVITY ? "activity/" : "work-time/";
    let idSurveyPath = location.pathname.split(pathSurveyRoot)[1]?.split("/")[0];
    let idSurvey = context?.idSurvey != idSurveyPath ? idSurveyPath : context?.idSurvey;
    return idSurvey;
}

function addItemToSession(idSurvey: string, item: any) {
    sessionStorage.setItem(idSurvey, JSON.stringify(item));
}

function getItemFromSession(idSurvey: string) {
    return JSON.parse(sessionStorage.getItem(idSurvey ?? "") ?? "{}");
}

function addArrayToSession(nameItem: string, array: any[]) {
    let copyArray = "";
    array.forEach(item => {
        if (copyArray != "") copyArray += ";;";
        copyArray += JSON.stringify(item);
    });
    let arrayToString = copyArray.toString();
    sessionStorage.setItem(nameItem, arrayToString);
}

function getArrayFromSession(nameItem: string): any[] {
    let stringArray = sessionStorage.getItem(nameItem);
    if (stringArray) {
        let copyArrayString = stringArray.split(";;");
        let array = copyArrayString.map(c => JSON.parse(c ?? "{}"));
        return array;
    } else return [];
}

function getUniquesValues(listValues: any[]): any[] {
    return listValues.filter((value, index, self) => self.indexOf(value) === index);
}

export {
    addArrayToSession,
    addItemToSession,
    getArrayFromSession,
    getItemFromSession,
    getSurveyIdFromUrl,
    getUniquesValues,
    groupBy,
    objectEquals,
};
