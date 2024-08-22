import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { isArray, isEqual, isObject, transform } from "lodash";
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
    console.log("getItemFromSession", idSurvey, sessionStorage.getItem(idSurvey));
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
    return !isPwa() && isMobile && isAndroid;
}

function formatDate(input: string) {
    dayjs.extend(customParseFormat);
    const inputFormatted = dayjs(input, "DD/MM/YYYY").format("YYYY-MM-DD");
    return inputFormatted;
}

//TODO: Test function to be removed
function difference(origObj: any, newObj: any) {
    function changes(newObj: any, origObj: { [x: string]: any }) {
        let arrayIndexCounter = 0;
        return transform(
            newObj,
            function (result: { [x: string]: any }, value: any, key: string | number) {
                if (!isEqual(value, origObj[key])) {
                    let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
                    result[resultKey] =
                        isObject(value) && isObject(origObj[key]) ? changes(value, origObj[key]) : value;
                }
            },
        );
    }
    console.log("Difference : ", changes(newObj, origObj));
    return changes(newObj, origObj);
}

/**
 * Merges specific fields from one object into another.
 *
 * This function merges the "variables" and "components" fields from the new object into the original object.
 * Both objects must be valid and of type object.
 *
 * @param origObj - The original object to merge into.
 * @param newObj - The new object containing fields to merge.
 * @returns The merged object.
 * @throws Will throw an error if either origObj or newObj is not a valid object.
 */
function mergeObjects(origObj: any, newObj: any): any {
    if (!origObj || !newObj || typeof origObj !== "object" || typeof newObj !== "object") {
        throw new Error("Both origObj and newObj must be valid objects.");
    }

    const fieldsToMerge = ["variables", "components"];

    fieldsToMerge.forEach(field => {
        // Check if the field exists and is an array in origObj
        if (Array.isArray(origObj[field])) {
            newObj[field] = newObj[field] || [];
            origObj[field].forEach((item: any) => {
                if (!newObj[field].some((newItem: any) => isEqual(newItem, item))) {
                    newObj[field].push(item);
                }
            });
        }
    });

    return newObj;
}

/**
 * Reverts a transformed array back to its original structure.
 * (Platine Back Office data transformation)
 * @param transformedArray - The array that has been transformed.
 * @param transformationLogic - A function that defines how to revert the transformation.
 * @returns The original array structure before transformation.
 * @throws Will throw an error if the transformedArray is not an array .
 */
const revertTransformedArray = (dataAct: any) => {
    const revertedDataAct: { [key: string]: any } = {};
    Object.keys(dataAct).forEach(key => {
        const revertedKey = key.startsWith("S_") ? key.substring(2) : key;
        revertedDataAct[revertedKey] = dataAct[key];
    });
    return revertedDataAct;
};

/**
 * Transforms the keys of an object by prefixing keys that start with a digit.
 * (Required for Platine Back Office data extract)
 *
 * @param dataAct - The input object whose keys need to be transformed.
 * @returns The transformed object with prefixed keys.
 */
const transformCollectedArray = (dataAct: any) => {
    const transformedDataAct: { [key: string]: any } = {};
    Object.keys(dataAct).forEach(key => {
        const transformedKey: string = /^\d/.test(key) ? `S_${key}` : key;
        transformedDataAct[transformedKey] = dataAct[key];
    });
    return transformedDataAct;
};

export {
    addArrayToSession,
    addItemToSession,
    formatDate,
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
    difference,
    mergeObjects,
    revertTransformedArray,
    transformCollectedArray,
};
