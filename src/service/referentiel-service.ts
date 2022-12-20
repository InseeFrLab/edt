import {
    SelectedActivity,
    findItemInCategoriesNomenclature,
    findItemInAutoCompleteRef,
    AutoCompleteActiviteOption,
    NomenclatureActivityOption,
    CheckboxOneCustomOption,
} from "lunatic-edt";
import activitesAutoCompleteRef from "activitesAutoCompleteRef.json";
import categoriesAndActivitesNomenclature from "activitiesCategoriesNomenclature.json";
import secondaryCategoriesRef from "secondaryActivityRef.json";
import { ReferentielData, REFERENTIEL_ID } from "interface/lunatic/Lunatic";
import { getReferentiel, getValue, ReferentielsEnum } from "./survey-service";

export const fetchReferentiels = (): Promise<ReferentielData> => {
    // To be replaced by API calls
    return new Promise(resolve => {
        resolve({
            activityNomenclature: categoriesAndActivitesNomenclature,
            activityAutocomplete: activitesAutoCompleteRef,
            secondaryActivity: secondaryCategoriesRef,
        });
    });
};

export const getAutoCompleteRef = (): AutoCompleteActiviteOption[] => {
    return getReferentiel(ReferentielsEnum.ACTIVITYAUTOCOMPLETE) as AutoCompleteActiviteOption[];
};

export const getNomenclatureRef = (): NomenclatureActivityOption[] => {
    return getReferentiel(ReferentielsEnum.ACTIVITYNOMENCLATURE) as NomenclatureActivityOption[];
};

export const getSecondaryActivityRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.SECONDARYACTIVITY) as CheckboxOneCustomOption[];
};

export const findActivityInAutoCompleteReferentiel = (
    selectedActivity: SelectedActivity,
): AutoCompleteActiviteOption | undefined => {
    return findItemInAutoCompleteRef(selectedActivity?.suggesterId, getAutoCompleteRef());
};

export const findActivityInNomenclatureReferentiel = (
    selectedActivity: SelectedActivity,
): NomenclatureActivityOption | undefined => {
    return findItemInCategoriesNomenclature(selectedActivity.id, getNomenclatureRef())?.item;
};

export const findSecondaryActivityInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getSecondaryActivityRef().find(a => a.value === id);
};
