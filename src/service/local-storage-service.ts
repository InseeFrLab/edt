import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";

const getLocalStorageValue = (idSurvey: string, localStorageVariable: LocalStorageVariableEnum) => {
    const surveyLocalStorage = JSON.parse(localStorage.getItem(idSurvey) ?? "{}");
    return surveyLocalStorage[localStorageVariable] ?? undefined;
};

const getFlatLocalStorageValue = (localStorageVariable: LocalStorageVariableEnum) => {
    return localStorage.getItem(localStorageVariable);
};

export { getLocalStorageValue, getFlatLocalStorageValue };
