
import elasticlunr, { Index } from "elasticlunrjs";
import { Dispatch, SetStateAction } from "react";
import { stopWordsFrench, synonymesMisspellings } from "../assets/surveyData";
import { AutoCompleteActiviteOption } from "../interface/lunatic-edt";

/**
 * Remove accents
 * @param value
 * @returns
 */
export const removeAccents = (value: string) => {
    return value
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
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

    synonymesMisspellings.forEach((pairSynonyme: { termination: any[]; misspelling: any[] }) => {
        const term = pairSynonyme.termination[0];
        pairSynonyme.misspelling.forEach(misspelling => {
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

export const activitesFiltredMap = (optionsFiltered: AutoCompleteActiviteOption[]) => {
    const optionsFilteredMap = optionsFiltered.map(opt => {
        const newOption: AutoCompleteActiviteOption = {
            id: opt.id,
            label: removeAccents(skipApostrophes(addMisspellings(opt).label)).replaceAll("’", "'"),
            synonymes: opt.synonymes.replaceAll(";", "; "),
        };
        return newOption;
    });
    return optionsFilteredMap;
};

export const CreateIndexation = (optionsFiltered: AutoCompleteActiviteOption[]) => {
    const optionsFilteredMap = activitesFiltredMap(optionsFiltered);

    elasticlunr.clearStopWords();
    elasticlunr.addStopWords(stopWordsFrench);

    const temp: Index<AutoCompleteActiviteOption> = elasticlunr();
    temp.addField("label");
    temp.addField("synonymes");
    temp.setRef("id");

    for (const doc of optionsFilteredMap) {
        temp.addDoc(doc);
    }
    return temp;
};

export function CreateIndex(
    optionsFiltered: AutoCompleteActiviteOption[],
    // TODO : Remove this parameter since it's not used
    _: elasticlunr.Index<AutoCompleteActiviteOption> | undefined,
    setIndex: Dispatch<SetStateAction<elasticlunr.Index<AutoCompleteActiviteOption> | undefined>>,
) {
    const optionsFilteredMap = activitesFiltredMap(optionsFiltered);
    const newIndex = CreateIndexation(optionsFilteredMap);
    setIndex(newIndex);

    return newIndex;
}

export const activitesFiltredUnique = (activitesAutoCompleteRef: AutoCompleteActiviteOption[]) => {
    const optionsFiltered: AutoCompleteActiviteOption[] = activitesAutoCompleteRef.filter(
        (option, i, arr) => arr.findIndex(opt => opt.label === option.label) === i,
    );
    return optionsFiltered;
};

export const optionsFiltered = (activitesAutoCompleteRef: AutoCompleteActiviteOption[]) => {
    return activitesFiltredUnique(activitesAutoCompleteRef);
};

let indexSuggester: elasticlunr.Index<AutoCompleteActiviteOption>;

export const getIndexSuggester = () => {
    return indexSuggester;
};

export const setIndexSuggester = (index: Index<AutoCompleteActiviteOption>) => {
    indexSuggester = index;
};
