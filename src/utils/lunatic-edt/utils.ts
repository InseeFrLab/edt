
import { validate } from "uuid";
import { TimeLineRowType } from "../../interface/lunatic-edt/DayOverviewTypes";
import { AutoCompleteActiviteOption } from "../../interface/lunatic-edt";
import { synonymesMisspellings } from "../../assets/surveyData";

export const important = (value: string): string => {
    return value + " !important";
};

/**
 * Returns string of date with french format
 * e.g. mercredi 14 juin 2022
 * @param date
 * @returns
 */
export const formateDateToFrenchFormat = (date: Date, language: string, dateOptions?: any): string => {
    if (!dateOptions) {
        dateOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    }
    return date.toLocaleDateString(language, dateOptions);
};

/**
 * Returns french day from date
 * e.g. lundi
 * @param date
 */
export const getFrenchDayFromDate = (date: Date): string => {
    const dateOptions: any = { weekday: "long" };
    return date.toLocaleDateString("fr-FR", dateOptions);
};

/**
 * Returns a date from string of date formatted as:
 * yyyy-mm-dd
 * @param input
 * @returns
 */
export const generateDateFromStringInput = (input: string): Date => {
    const splittedDate = input.split("-");
    const date = new Date();

    date.setUTCDate(Number(splittedDate[2]));
    date.setUTCMonth(Number(splittedDate[1]) - 1, Number(splittedDate[2]));
    date.setFullYear(Number(splittedDate[0]));
    return date;
};

/**
 * Returns a string with format: yyyy-mm-dd
 * @param date
 * @returns
 */
export const generateStringInputFromDate = (date: Date): string => {
    const day = date.getDate();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (day < 10 ? "0" : "") + day;
};

/**
 * Sets hours, minutes, seconds and milliseconds to 0 to allow comparison at date level
 * @param date
 * @returns
 */
export const setDateTimeToZero = (date: Date): Date => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
};

/**
 * Returns time from Date, with format: hhhmm
 * @param t
 * @returns
 */
export const convertTime = (t: Date): string => {
    let hour = t.getHours().toString();
    hour = Number(hour) < 10 ? "0" + hour : hour;
    let min = t.getMinutes().toString();
    min = Number(min) < 10 ? "0" + min : min;
    return hour + "H" + min;
};

/**
 * Generates options and default values for DayOverview HourChecker components
 * Returns a TimeLineRowType for each timeline interval
 * @returns
 */
export const generateDayOverviewTimelineRawData = (): TimeLineRowType[] => {
    //TODO: Edit this to add S_
    const rowData: TimeLineRowType[] = [];

    for (let h = 0; h < 24; h++) {
        const date = new Date();
        date.setHours(h);
        date.setMinutes(0);
        const row: TimeLineRowType = { label: "", options: [], value: {} };

        if (date.getHours() === 0) {
            row.label = "Minuit";
        } else if (date.getHours() === 12) {
            row.label = "Midi";
        } else {
            row.label = date.getHours() + "h00";
        }

        for (let i = 1; i <= 4; i++) {
            const dateCurrent = new Date();
            dateCurrent.setHours(date.getHours());
            dateCurrent.setMinutes(date.getMinutes());
            const keyCurrent = convertTime(dateCurrent);

            const dateAfter15Min = date;
            dateAfter15Min.setMinutes(date.getMinutes() + 15);
            const keyAfter15Min = convertTime(dateAfter15Min);

            row.options.push({
                id: i.toString(),
                label: keyAfter15Min,
                response: { name: keyCurrent },
            });
            row.value[keyCurrent] = false;
        }
        rowData.push(row);
    }
    return rowData;
};

/**
 * Splits a label (e.g. of categories) in two if it has some parenthesis
 * @param fullLabel
 * @returns
 */
export const splitLabelWithParenthesis = (
    fullLabel: string,
): { mainLabel: string; secondLabel: string | undefined } => {
    let mainLabel;
    let secondLabel;
    const indexOfParenthesis = fullLabel.indexOf("(");
    if (indexOfParenthesis !== -1) {
        mainLabel = fullLabel.substring(0, indexOfParenthesis);
        secondLabel = fullLabel.substring(indexOfParenthesis + 1, fullLabel.length - 1);
    } else {
        mainLabel = fullLabel;
    }
    return {
        mainLabel: mainLabel,
        secondLabel: secondLabel,
    };
};

export const isUUID = (uuid: string) => {
    return validate(uuid);
};

/**
 * Remove accents
 * @param value
 * @returns
 */
export const removeAccents = (value: string) => {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/'/g, " ");
};

const pronounAbbreviations = ["l", "d", "m", "s", "t"];

/**
 * Activities with abbreviated pronouns (ex: de -> d')
 * are not searched because pronouns are not skipped
 * @param labelWithApostrophe
 * @returns activity label with pronoun + apostroph replace
 * with pronoun without abbreviation
 */
export const skipApostrophes = (labelWithApostrophe: string) => {
    let label = labelWithApostrophe.toLowerCase();
    pronounAbbreviations.forEach(abbrev => {
        if (label?.includes(abbrev + "’")) {
            label = label.replace(abbrev + "’", abbrev + "e ");
        }
    });
    return label;
};

/**
 * Add synonymes of misspellings
 * @param option
 * @returns
 */
export const addMisspellings = (option: AutoCompleteActiviteOption) => {
    let labelWithMisspelling = "";

    synonymesMisspellings.forEach((synonymesMisspelling: any) => {
        const term = synonymesMisspelling.termination[0];
        synonymesMisspelling.misspelling.forEach((misspelling: any) => {
            if (option.label.includes(term)) {
                const labelToReplace = option.label.replaceAll(term, misspelling) + "; ";
                labelWithMisspelling =
                    labelWithMisspelling +
                    (labelWithMisspelling.includes(labelToReplace) ? "" : labelToReplace);
            }
            if (option.label.includes(misspelling)) {
                const labelToReplace = option.label.replaceAll(misspelling, term) + "; ";
                labelWithMisspelling =
                    labelWithMisspelling +
                    (labelWithMisspelling.includes(labelToReplace) ? "" : labelToReplace);
            }
        });
    });
    option.synonymes = option.synonymes + "; " + labelWithMisspelling;

    return option;
};

export const addArrayToSession = (nameItem: string, array: any[]) => {
    let copyArray = "";
    array.forEach(item => {
        if (copyArray != "") copyArray += ";;";
        copyArray += JSON.stringify(item);
    });
    let arrayToString = copyArray.toString();
    sessionStorage.setItem(nameItem, arrayToString);
};

export const getArrayFromSession = (nameItem: string): any[] => {
    let stringArray = sessionStorage.getItem(nameItem);
    if (stringArray) {
        let copyArrayString = stringArray.split(";;");
        let array = copyArrayString.map(c => JSON.parse(c ?? "{}"));
        return array;
    } else return [];
};
