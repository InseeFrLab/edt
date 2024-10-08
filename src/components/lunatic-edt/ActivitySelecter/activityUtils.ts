import elasticlunr, { Index } from "elasticlunrjs";

import React from "react";
import { validate } from "uuid";
import stopWords from "../ClickableList//stop_words_french.json";
import {
    FullScreenComponent,
    historyActivitySelecter,
    historyInputSuggester,
    selectedIdNewActivity,
    selectedLabelNewActivity,
} from "./ActivitySelecter";
import { ActivitySelecterNavigationEnum } from "../../../enumerations/lunatic-edt/ActivitySelecterNavigationEnum";
import { NomenclatureActivityOption, AutoCompleteActiviteOption, SelectedActivity, responseType, responsesType } from "../../../interface/lunatic-edt";
import { removeAccents, skipApostrophes, addMisspellings } from "../../../service/suggester-service";

/**
 * Find category of activity
 * @param id id of activity
 * @param referentiel list of categories
 * @param parent if category's activty is subcategory, list of subcategories
 * @returns category's activity and upper category's
 */
export const findItemInCategoriesNomenclature = (
    id: string | undefined,
    referentiel: NomenclatureActivityOption[],
    parent?: NomenclatureActivityOption,
): { item: NomenclatureActivityOption; parent: NomenclatureActivityOption | undefined } | undefined => {
    let categoriesFirstRank = referentiel.find(a => a.id === id);
    if (categoriesFirstRank) {
        return {
            item: categoriesFirstRank,
            parent: parent,
        };
    } else {
        for (let ref of referentiel) {
            let subsubs = ref.subs;
            if (subsubs) {
                //if category of activity have sub categories that match the selected item
                let categoriesSecondRank = findItemInCategoriesNomenclature(id, subsubs, ref);
                if (categoriesSecondRank) {
                    return categoriesSecondRank;
                }
            }
        }
    }
};

export const findItemInAutoCompleteRef = (
    id: string | undefined,
    ref: AutoCompleteActiviteOption[],
): AutoCompleteActiviteOption | undefined => {
    return ref.find(a => a.id === id);
};

export const findItemInAutoCompleteRefByLabel = (
    label: string | undefined,
    ref: AutoCompleteActiviteOption[],
): AutoCompleteActiviteOption | undefined => {
    return ref.find(a => a.label === label);
};

/**
 * Get category of upper rang of activity searched
 * @param res
 * @returns
 */
const getParentFromSearchResult = (
    res:
        | {
            item: NomenclatureActivityOption;
            parent: NomenclatureActivityOption | undefined;
        }
        | undefined,
) => {
    return res?.parent ? [res?.parent] : [];
};

/**
 * Get category of activity searched
 * @param res
 * @returns
 */
const getItemFromSearchResult = (
    res:
        | {
            item: NomenclatureActivityOption;
            parent: NomenclatureActivityOption | undefined;
        }
        | undefined,
) => {
    return res?.item ? [res?.item] : [];
};

/**
 * When selectionne activity with categories
 */
export const processActivityCategory = (
    value: { [key: string]: string | boolean },
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    setSelectedId: (id: string | undefined) => void,
    setSelectedCategories: (cats: NomenclatureActivityOption[]) => void,
    setShowSubCategories: (show: boolean) => void,
) => {
    const hasId: boolean = parsedValue.id != null;
    const hasLabel: boolean = parsedValue.label != null;
    if (hasId && value && categoriesAndActivitesNomenclature) {
        setSelectedId(parsedValue.id);
        localStorage.setItem(selectedIdNewActivity, parsedValue?.id ?? "");
        const res = findItemInCategoriesNomenclature(parsedValue.id, categoriesAndActivitesNomenclature);
        const resParent = getParentFromSearchResult(res);
        const resItem = getItemFromSearchResult(res);
        const isFullyCompleted: boolean = parsedValue.isFullyCompleted ?? false;
        if (isFullyCompleted) {
            setSelectedCategories(resParent);
        } else {
            setSelectedCategories(resItem);
            setShowSubCategories(true);
        }

        if (hasLabel && resItem) {
            const findItem = resItem[0]?.subs?.find(opt => opt.label == parsedValue.label);
            if (findItem) {
                setSelectedId(findItem?.id);
                localStorage.setItem(selectedIdNewActivity, findItem.id);
            }
        }
    }
};

/**
 * When search activity
 */
export const processActivityAutocomplete = (
    value: { [key: string]: string | boolean },
    parsedValue: SelectedActivity,
    setFullScreenComponent: (screen: FullScreenComponent) => void,
    setSelectedSuggesterId: (id: string | undefined) => void,
) => {
    const hasSuggesterId: boolean = parsedValue.suggesterId != null;
    if (hasSuggesterId && value) {
        setFullScreenComponent(FullScreenComponent.ClickableListComp);
        setSelectedSuggesterId(parsedValue.suggesterId);
    }
};

/**
 * When selectionne option new activity
 */
export const processNewActivity = (
    value: { [key: string]: string | boolean },
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    setFullScreenComponent: (screen: FullScreenComponent) => void,
    setCreateActivityValue: (val: string | undefined) => void,
    setSelectedCategories: (cats: NomenclatureActivityOption[]) => void,
) => {
    const hasLabel: boolean = parsedValue.label != null;

    if (hasLabel && value && categoriesAndActivitesNomenclature) {
        setFullScreenComponent(FullScreenComponent.FreeInput);
        setCreateActivityValue(parsedValue.label);
        const hasId: boolean = parsedValue.id != null;
        if (hasId) {
            const res = findItemInCategoriesNomenclature(
                parsedValue.id,
                categoriesAndActivitesNomenclature,
            );
            let resItem = res?.item ? [res?.item] : [];

            if (parsedValue.label != null && parsedValue.isFullyCompleted) {
                resItem = res?.parent ? [res?.parent] : [];
            }
            setSelectedCategories(resItem);
            localStorage.setItem(selectedIdNewActivity, parsedValue.id ?? "");
        }
    }
};

/**
 * Find category of rank 1 when selectionne categories of rank 2 or 3
 */
export const findRank1Category = (
    parsedValue: SelectedActivity,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
) => {
    const idSelected = parsedValue.id;
    const isFullyCompleted = parsedValue.isFullyCompleted;
    //if category of 3nd rank, get category 2n rank, other get category 1r rank
    const categorySecondOrThirdRank = findItemInCategoriesNomenclature(
        idSelected,
        categoriesAndActivitesNomenclature,
    );
    //if category of 2nd rank, get category 1r rank, other undefined
    const categoryFirstOrSecondRank = findItemInCategoriesNomenclature(
        categorySecondOrThirdRank?.parent?.id,
        categoriesAndActivitesNomenclature,
    );

    const category =
        categoryFirstOrSecondRank?.parent == null
            ? categorySecondOrThirdRank
            : categoryFirstOrSecondRank;
    const categoryFirstRank = category?.parent ?? category?.item;

    return isFullyCompleted ? categoryFirstRank : category?.item;
};

const saveNewOrCurrentActivity = (
    id: string | undefined,
    categoriesAndActivitesNomenclature: NomenclatureActivityOption[],
    isFullyCompleted: boolean,
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ],
    newItemId: string,
) => {
    if (validate(id ?? "")) {
        const labelOfActivity = findItemInCategoriesNomenclature(id, categoriesAndActivitesNomenclature)
            ?.item.label;
        onChange(handleChange, {
            responses,
            newItemId,
            isFullyCompleted,
            id,
            suggesterId: id,
            activityLabel: labelOfActivity,
        });
    } else
        onChange(handleChange, {
            responses,
            newItemId,
            isFullyCompleted,
            id,
            suggesterId: undefined,
        });
};

export const selectSubCategory = (
    selectedId: string | undefined,
    selectedCategories: NomenclatureActivityOption[],
    setSelectedCategories: (activities: NomenclatureActivityOption[]) => void,
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
    inputs: {
        selection: NomenclatureActivityOption;
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
        newItemId: string;
    },
) => {
    const id = selectedId == inputs.selection.id ? undefined : inputs.selection.id;
    const temp = [...selectedCategories];
    temp.push(inputs.selection);
    appendHistoryActivitySelecter(
        inputs.selection.label,
        inputs.separatorSuggester,
        inputs.historyActivitySelecterBindingDep,
        handleChange,
    );
    setSelectedCategories(temp);
    saveNewOrCurrentActivity(
        id,
        inputs.categoriesAndActivitesNomenclature,
        false,
        handleChange,
        inputs.responses,
        inputs.newItemId,
    );
};

export const selectFinalCategory = (
    states: {
        selectedId: string | undefined;
        labelOfSelectedId: string | undefined;
        setSelectedId: (id?: string) => void;
        setLabelOfSelectedId: (label?: string) => void;
    },
    onSelectValue: () => void,
    inputs: {
        selection: NomenclatureActivityOption;
        categoriesAndActivitesNomenclature: NomenclatureActivityOption[];
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
        newItemId: string;
    },
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
) => {
    const id = states.selectedId == inputs.selection.id ? undefined : inputs.selection.id;
    const label =
        states.labelOfSelectedId == inputs.selection.label ? undefined : inputs.selection.label;

    saveNewOrCurrentActivity(
        id,
        inputs.categoriesAndActivitesNomenclature,
        true,
        handleChange,
        inputs.responses,
        inputs.newItemId,
    );

    states.setSelectedId(id);
    states.setLabelOfSelectedId(label);
    appendHistoryActivitySelecter(
        label || "",
        inputs.separatorSuggester,
        inputs.historyActivitySelecterBindingDep,
        handleChange,
    );
    if (id != null) onSelectValue();
};

export const activitesFiltredUnique = (activitesAutoCompleteRef: AutoCompleteActiviteOption[]) => {
    const optionsFiltered: AutoCompleteActiviteOption[] = activitesAutoCompleteRef.filter(
        (option, i, arr) => arr.findIndex(opt => opt.label === option.label) === i,
    );
    return optionsFiltered;
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
    return React.useState<Index<AutoCompleteActiviteOption>>(() => {
        elasticlunr.clearStopWords();
        elasticlunr.addStopWords(stopWords);

        const temp: Index<AutoCompleteActiviteOption> = elasticlunr();
        temp.addField("label");
        temp.addField("synonymes");
        temp.setRef("id");

        for (const doc of optionsFilteredMap) {
            temp.addDoc(doc);
        }
        return temp;
    })[0];
};

let inputValue: string | undefined;

export const updateNewValue = (
    value: string | undefined,
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
        responsesType,
    ],
    newItemId: string,
) => {
    onChange(handleChange, {
        responses,
        newItemId,
        isFullyCompleted: true,
        id: undefined,
        suggesterId: undefined,
        activityLabel: value,
    });
    if (value) localStorage.setItem(selectedLabelNewActivity, value);
    inputValue = value;
};

export const getInputValue = (): string | undefined => {
    return inputValue;
};

export const optionsFiltered = (activitesAutoCompleteRef: AutoCompleteActiviteOption[]) => {
    return activitesFiltredUnique(activitesAutoCompleteRef);
};

export const createIndexSuggester = (
    activitesAutoCompleteRef: AutoCompleteActiviteOption[],
    selectedSuggesterId: string | undefined,
    createIndex?: (
        optionsFiltered: AutoCompleteActiviteOption[],
    ) => elasticlunr.Index<AutoCompleteActiviteOption>,
    indexSuggester?: elasticlunr.Index<AutoCompleteActiviteOption>,
) => {
    const options = optionsFiltered(activitesAutoCompleteRef);
    const selectedvalue: AutoCompleteActiviteOption = activitesAutoCompleteRef.filter(
        e => e.id === selectedSuggesterId,
    )[0];
    const index = createIndex ? indexSuggester ?? createIndex(options) : null;
    return [index, options, selectedvalue];
};

export const clickableListOnChange = (
    id: string | undefined,
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
    responses: [
        responsesType,
        responsesType,
        responsesType,
        responsesType | undefined,
        responsesType | undefined,
        responsesType | undefined,
    ],
    newItemId: string,
    setSelectedSuggesterId: (id: string | undefined) => void,
    historyInputSug?: string,
) => {
    setSelectedSuggesterId(id);
    let isFully = false;
    if (id) {
        isFully = true;
    }
    let historyInputSuggesterValueLocal = localStorage.getItem(historyInputSuggester) ?? "";
    historyInputSuggesterValueLocal += historyInputSug;
    onChange(handleChange, {
        responses,
        newItemId,
        isFullyCompleted: responses[3] ? isFully : undefined,
        id: undefined,
        suggesterId: id,
        activityLabel: historyInputSug,
        historyInputSuggester: responses[4] ? historyInputSuggesterValueLocal : undefined,
    });
    localStorage.removeItem(historyInputSuggester);
};

export const clickableListHistoryOnChange = (historyInputSug?: string) => {
    let historyInputSuggesterValueLocal = localStorage.getItem(historyInputSuggester) ?? "";

    if (historyInputSuggesterValueLocal != historyInputSug) {
        historyInputSuggesterValueLocal += historyInputSug;
        localStorage.setItem(historyInputSuggester, historyInputSuggesterValueLocal);
    }
};

export const appendHistoryActivitySelecter = (
    actionOrSelection: ActivitySelecterNavigationEnum | string,
    separatorSuggester: string,
    historyActivitySelecterBindingDep: responseType,
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
) => {
    let historyActivitySelecterValue = localStorage.getItem(historyActivitySelecter) ?? "";

    const allHistoryActivitiesValues = historyActivitySelecterValue.split(separatorSuggester);
    const lastActivitySelected = allHistoryActivitiesValues[allHistoryActivitiesValues.length - 2];

    if (lastActivitySelected != actionOrSelection) {
        historyActivitySelecterValue =
            historyActivitySelecterValue + (actionOrSelection as string) + separatorSuggester;
        localStorage.setItem(historyActivitySelecter, historyActivitySelecterValue);
        handleChange(historyActivitySelecterBindingDep, historyActivitySelecterValue);
    }
};

export const createActivityCallBack = (
    states: {
        selectedCategoryId: string;
        selectedCategories?: NomenclatureActivityOption[];
    },
    setters: {
        setCreateActivityValue: (value?: string) => void;
        setFullScreenComponent: (comp: FullScreenComponent) => void;
        setNewValue: (value?: string) => void;
    },
    functions: {
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
    inputs: {
        activityLabel: string;
        newItemId: string;
        separatorSuggester: string;
        historyActivitySelecterBindingDep: responseType | undefined;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType | undefined,
            responsesType | undefined,
            responsesType | undefined,
        ];
    },
) => {
    let historyInputSuggesterValueLocal = localStorage.getItem(historyInputSuggester) ?? "";

    onChange(functions.handleChange, {
        responses: inputs.responses,
        newItemId: inputs.newItemId,
        isFullyCompleted: true,
        id: states.selectedCategoryId,
        suggesterId: inputs.newItemId,
        activityLabel: inputs.activityLabel,
        historyInputSuggester: historyInputSuggesterValueLocal,
    });

    if (inputs.historyActivitySelecterBindingDep) {
        appendHistoryActivitySelecter(
            ActivitySelecterNavigationEnum.ADD_ACTIVITY_BUTTON,
            inputs.separatorSuggester,
            inputs.historyActivitySelecterBindingDep,
            functions.handleChange,
        );
    }

    setters.setFullScreenComponent(FullScreenComponent.FreeInput);
    setters.setCreateActivityValue(inputs.activityLabel);
    setters.setNewValue(inputs.activityLabel);

    const selectedCategory =
        states.selectedCategories && states.selectedCategories[states.selectedCategories.length - 1];
    if (selectedCategory && selectedCategory.subs) {
        selectedCategory.subs.push({
            id: inputs.newItemId,
            rang: selectedCategory.rang + 1,
            label: inputs.activityLabel,
        });
    }
    localStorage.setItem(selectedLabelNewActivity, inputs.activityLabel);
};

export const onChange = (
    handleChange: (response: responseType, value: string | boolean | undefined) => void,
    inputs: {
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType | undefined,
            responsesType | undefined,
            responsesType | undefined,
        ];
        newItemId: string;
        isFullyCompleted?: boolean;
        id?: string;
        suggesterId?: string;
        activityLabel?: string;
        historyInputSuggester?: string;
    },
) => {
    const idBindingDep = inputs.responses?.[0]?.response;
    const suggesterIdBindingDep = inputs.responses?.[1]?.response;
    const labelBindingDep = inputs.responses?.[2]?.response;
    const isFullyCompletedBindingDep = inputs.responses?.[3]?.response;
    const historyInputSuggesterDep = inputs.responses?.[4]?.response;

    const selection: SelectedActivity = {
        id: inputs.id,
        suggesterId: inputs.suggesterId,
        label: inputs.activityLabel,
        isFullyCompleted: inputs.isFullyCompleted,
        historyInputSuggester: inputs.historyInputSuggester,
    };
    const label = selection.label;
    const idSelected = selection.id ?? localStorage.getItem(selectedIdNewActivity) ?? undefined;
    const suggesterId = inputs.suggesterId ?? inputs.newItemId;
    if (idSelected != null) handleChange(idBindingDep, idSelected);
    handleChange(suggesterIdBindingDep, label ? suggesterId : undefined);
    handleChange(labelBindingDep, label);
    if (inputs.isFullyCompleted && isFullyCompletedBindingDep)
        handleChange(isFullyCompletedBindingDep, selection.isFullyCompleted);
    if (historyInputSuggester && historyInputSuggesterDep)
        handleChange(historyInputSuggesterDep, selection.historyInputSuggester);
};

export const nextStepFreeInput = (
    states: {
        selectedCategories?: NomenclatureActivityOption[];
        createActivityValue: string | undefined;
        freeInput: string | undefined;
    },
    functions: {
        setDisplayAlert: (display: boolean) => void;
        nextClickCallback: (routeToGoal: boolean) => void;
        addToReferentielCallBack: (
            newItem: AutoCompleteActiviteOption,
            categoryId: string | undefined,
            newActivity: string,
        ) => void;
        handleChange: (response: responseType, value: string | boolean | undefined) => void;
    },
    inputs: {
        separatorSuggester: string;
        historyActivitySelecterBindingDep?: responseType;
        newItemId: string;
        displayAlertNewActivity: boolean;
        routeToGoal: boolean;
        responses: [
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
            responsesType,
        ];
    },
) => {
    if (inputs.displayAlertNewActivity) {
        functions.setDisplayAlert(true);
    } else {
        if (
            states.selectedCategories &&
            states.selectedCategories[states.selectedCategories.length - 1]
        ) {
            inputs.routeToGoal = false;
        }
        const label = states.freeInput ?? localStorage.getItem(selectedLabelNewActivity) ?? undefined;
        functions.addToReferentielCallBack(
            {
                id: inputs.newItemId,
                label: label ?? "",
                synonymes: "",
            },
            states.selectedCategories
                ? states.selectedCategories[states.selectedCategories.length - 1]?.id
                : undefined,
            inputs.newItemId,
        );
        localStorage.setItem(selectedIdNewActivity, inputs.newItemId);

        onChange(functions.handleChange, {
            responses: inputs.responses,
            newItemId: inputs.newItemId,
            isFullyCompleted: true,
            id: states.selectedCategories
                ? states.selectedCategories[states.selectedCategories.length - 1]?.id
                : undefined,
            suggesterId: inputs.newItemId,
            activityLabel: label,
        });
        if (inputs.historyActivitySelecterBindingDep) {
            appendHistoryActivitySelecter(
                ActivitySelecterNavigationEnum.SAVE_BUTTON,
                inputs.separatorSuggester,
                inputs.historyActivitySelecterBindingDep,
                functions.handleChange,
            );
            appendHistoryActivitySelecter(
                states.createActivityValue ?? "",
                inputs.separatorSuggester,
                inputs.historyActivitySelecterBindingDep,
                functions.handleChange,
            );
        }
        functions.nextClickCallback(inputs.routeToGoal);
    }
};
