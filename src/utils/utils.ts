import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import {
    isAndroid,
    isChrome,
    isDesktop,
    isEdge,
    isFirefox,
    isIOS,
    isMacOs,
    isMobile,
    isSafari,
} from "react-device-detect";
import { Location } from "react-router-dom";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";
import { isPwa } from "service/responsive";

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
    } else if (obj1[prop] !== obj2[prop]) return false;
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

const getDevice = () => {
    if (isIOS || isMacOs) {
        return "ios";
    } else if (isAndroid || isDesktop) {
        return "android";
    } else return "";
};

const getNavigator = () => {
    if (isChrome) {
        return "chrome";
    } else if (isEdge) {
        return "edge";
    } else if (isFirefox) {
        return "firefox";
    } else if (isSafari) {
        return "safari";
    } else return "";
};

const getDeviceNavigatorIsAvaiableForInstall = () => {
    const device = getDevice();
    const navigator = getNavigator();

    if (device == "ios" && ["chrome", "edge", "safari"].includes(navigator)) {
        return true;
    } else if (device == "android" && ["chrome", "edge", "firefox"].includes(navigator)) {
        return true;
    } else {
        return null;
    }
};
function getClassCondition(condition: boolean, classNameYes: any, classNameNo: any) {
    return condition ? classNameYes : classNameNo;
}

function getCookie(name: string): string | null {
    const nameLenPlus = name.length + 1;
    return (
        document.cookie
            .split(";")
            .map(c => c.trim())
            .filter(cookie => {
                return cookie.substring(0, nameLenPlus) === `${name}=`;
            })
            .map(cookie => {
                return decodeURIComponent(cookie.substring(nameLenPlus));
            })[0] || null
    );
}

function sumAllOfArray(array: number[]): number {
    return array.reduce((a, b) => a + b, 0);
}

function isAndroidNav() {
    console.log(isPwa, isMobile, isAndroid);
    return !isPwa() && isMobile && isAndroid;
}

export {
    addArrayToSession,
    addItemToSession,
    getArrayFromSession,
    getClassCondition,
    getCookie,
    getDevice,
    getDeviceNavigatorIsAvaiableForInstall,
    getItemFromSession,
    getNavigator,
    getSurveyIdFromUrl,
    getUniquesValues,
    groupBy,
    isAndroidNav,
    objectEquals,
    sumAllOfArray,
};
