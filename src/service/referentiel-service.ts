import {
    AutoCompleteActiviteOption,
    CheckboxOneCustomOption,
    findItemInAutoCompleteRef,
    findItemInCategoriesNomenclature,
    NomenclatureActivityOption,
    SelectedActivity,
} from "@inseefrlab/lunatic-edt";
import { FieldNameEnum } from "../enumerations/FieldNameEnum";
import { ReferentielsEnum } from "../enumerations/ReferentielsEnum";
import i18n from "i18next";
import { getReferentiel, getValue, saveReferentiels } from "./survey-service";
import { lunaticDatabase } from "./lunatic-database";
import { validate } from "uuid";
import { REFERENTIELS_ID } from "../interface/lunatic/Lunatic";
import { Dispatch, SetStateAction } from "react";
import { CreateIndex, optionsFiltered, setIndexSuggester } from "./suggester-service";

export const getAutoCompleteRef = (): AutoCompleteActiviteOption[] => {
    return getReferentiel(ReferentielsEnum.ACTIVITYAUTOCOMPLETE) as AutoCompleteActiviteOption[];
};

export const getNomenclatureRef = (): NomenclatureActivityOption[] => {
    return getReferentiel(ReferentielsEnum.ACTIVITYNOMENCLATURE) as NomenclatureActivityOption[];
};

export const getActivitySecondaryActivityRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.ACTIVITYSECONDARYACTIVITY) as CheckboxOneCustomOption[];
};

export const getRouteSecondaryActivityRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.ROUTESECONDARYACTIVITY) as CheckboxOneCustomOption[];
};

export const getPlaceRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.LOCATION) as CheckboxOneCustomOption[];
};

export const getRouteRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.ROUTE) as CheckboxOneCustomOption[];
};

export const getActivityGoalRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.ACTIVITYGOAL) as CheckboxOneCustomOption[];
};

export const getMeanOfTransportRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.MEANOFTRANSPORT) as CheckboxOneCustomOption[];
};

export const getKindOfWeekRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.KINDOFWEEK) as CheckboxOneCustomOption[];
};

export const getKindOfDayRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.KINDOFDAY) as CheckboxOneCustomOption[];
};

export const findActivityInAutoCompleteReferentiel = (
    selectedActivity: SelectedActivity,
): AutoCompleteActiviteOption | undefined => {
    return findItemInAutoCompleteRef(selectedActivity?.suggesterId, getAutoCompleteRef());
};

export const findActivityInAutoCompleteReferentielById = (
    activityCode: string,
): AutoCompleteActiviteOption | undefined => {
    return findItemInAutoCompleteRef(activityCode, getAutoCompleteRef());
};

export const findActivityInNomenclatureReferentiel = (
    selectedActivity: SelectedActivity,
): NomenclatureActivityOption | undefined => {
    return findItemInCategoriesNomenclature(selectedActivity.id, getNomenclatureRef())?.item;
};

export const findNewActivityById = (idSurvey: string, activityId: string): string | undefined => {
    const newActivities = getValue(idSurvey, FieldNameEnum.MAINACTIVITY_SUGGESTERID) as string[];
    if (newActivities != null && newActivities.length > 0) {
        const index = newActivities.findIndex(act => act == activityId);
        const activitiesLabel = getValue(idSurvey, FieldNameEnum.MAINACTIVITY_LABEL) as string[];
        return activitiesLabel[index];
    } else return undefined;
};

export const findActivityInNomenclatureReferentielById = (
    activityCode: string,
): NomenclatureActivityOption | undefined => {
    return findItemInCategoriesNomenclature(activityCode, getNomenclatureRef())?.item;
};

export const findActivitySecondaryActivityInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getActivitySecondaryActivityRef().find(a => a.value == id);
};

export const findRouteSecondaryActivityInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getRouteSecondaryActivityRef().find(a => a.value == id);
};

export const findPlaceInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getPlaceRef().find(a => a.value === id);
};

export const findRouteInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getRouteRef().find(a => a.value === id);
};

export const findMeanOfTransportInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getMeanOfTransportRef().find(a => a.value === id);
};

export const findKindOfDayInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getKindOfDayRef().find(a => a.value === id);
};

export const getLanguage = () => {
    return i18n.language || (typeof window !== "undefined" && window.localStorage.i18nextLng) || "fr";
};

/**
 * Adds a new item to the secondary activity referentiel when the user select "other?" option.
 *
 * @param {ReferentielsEnum.ACTIVITYSECONDARYACTIVITY | ReferentielsEnum.ROUTESECONDARYACTIVITY} referentiel - The referentiel to add the item to.
 * @param {CheckboxOneCustomOption} newItem -
 */
export const addToSecondaryActivityReferentiel = (
    referentiel: ReferentielsEnum.ACTIVITYSECONDARYACTIVITY | ReferentielsEnum.ROUTESECONDARYACTIVITY,
    newItem: CheckboxOneCustomOption,
) => {
    lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        currentData[referentiel].push(newItem);
        currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE].push({
            id: newItem.value,
            label: newItem.label,
        });
        saveReferentiels(currentData);
    });
};

/**
 * Retrieves new secondary activities based on the survey ID and referentiel created above.
 *
 * @param {string} idSurvey - The ID of the survey.
 * @param {CheckboxOneCustomOption[]} referentiel - The referentiel to check against.
 * @returns {CheckboxOneCustomOption[]} The updated list of secondary activities.
 */
export const getNewSecondaryActivities = (idSurvey: string, referentiel: CheckboxOneCustomOption[]) => {
    const listSecondaryActivitiesIds = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY);
    const listSecondaryActivitiesLabel = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY_LABEL);
    let listSecondaryActivities = referentiel;
    listSecondaryActivitiesIds?.forEach((id: string, index: number) => {
        const existActivity = referentiel.find(ref => ref.value == id) != null;
        if (validate(id) && !existActivity) {
            const newActivity = {
                value: id,
                label: listSecondaryActivitiesLabel[index],
            };
            listSecondaryActivities.push(newActivity);
        }
    });
    return listSecondaryActivities;
};

/**
 * Adds a new item to the autocomplete activity referentiel (in activity label search page).
 *
 * @param {AutoCompleteActiviteOption} newItem - The new activity to add.
 * @returns {Promise<any>} The updated referentiel data.
 */
export const addToAutocompleteActivityReferentiel = (newItem: AutoCompleteActiviteOption) => {
    return lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        const ref = currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE];
        if (!ref.find((opt: any) => opt.label == newItem.label)) {
            currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE].push(newItem);
            return saveReferentiels(currentData);
        } else return currentData;
    });
};

export const updateReferentielAutoComplete = (
    currentData: any,
    newItem: AutoCompleteActiviteOption,
    newActivity: string,
    index: elasticlunr.Index<AutoCompleteActiviteOption> | undefined,
    setIndex: Dispatch<SetStateAction<elasticlunr.Index<AutoCompleteActiviteOption> | undefined>>,
) => {
    return saveReferentiels(currentData).then(() => {
        addToAutocompleteActivityReferentiel(newItem).then(referentielData => {
            const newAutocompleteRef = referentielData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE];
            localStorage.setItem("selectedIdNewActivity", newActivity);
            updateIndexAutoComplete(newAutocompleteRef, index, setIndex);
        });
    });
};

export const updateIndexAutoComplete = (
    // Referentiel parameter is not used anymore
    _: AutoCompleteActiviteOption[],
    index: elasticlunr.Index<AutoCompleteActiviteOption> | undefined,
    setIndex: Dispatch<SetStateAction<elasticlunr.Index<AutoCompleteActiviteOption> | undefined>>,
) => {
    const options = optionsFiltered(getAutoCompleteRef());
    const indexSuggester = CreateIndex(options, index, setIndex);
    setIndexSuggester(indexSuggester);
};

export const createNewActivityInCategory = (
    newItem: AutoCompleteActiviteOption,
    categoryId: string | undefined,
    newActivity: string,
    referentiel: NomenclatureActivityOption[],
    index: elasticlunr.Index<AutoCompleteActiviteOption> | undefined,
    setIndex: Dispatch<SetStateAction<elasticlunr.Index<AutoCompleteActiviteOption> | undefined>>,
) => {
    lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        const ref = currentData[ReferentielsEnum.ACTIVITYNOMENCLATURE];
        const category = findItemInCategoriesNomenclature(categoryId, referentiel);
        const categoryParent = category?.parent ?? category?.item;
        const parentCategoryId = categoryParent?.id;
        const existCategory = category?.item.subs.find((cat: any) => cat.label == newItem.label);
        if (!existCategory) {
            category?.item.subs.push({
                id: newItem.id,
                rang: category?.item.rang + 1,
                label: newItem.label,
            });
            const indexParentCategory = ref.findIndex((opt: any) => opt.id == parentCategoryId);


            ref[indexParentCategory] = categoryParent;
            return updateReferentielAutoComplete(currentData, newItem, newActivity, index, setIndex);
        }

        if (!categoryId) {
            return updateReferentielAutoComplete(currentData, newItem, newActivity, index, setIndex);
        }
    });
};
