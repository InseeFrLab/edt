import {
    SelectedActivity,
    findItemInCategoriesNomenclature,
    findItemInAutoCompleteRef,
    AutoCompleteActiviteOption,
    NomenclatureActivityOption,
    CheckboxOneCustomOption,
} from "lunatic-edt";
import activitesAutoCompleteRef from "refs/activitesAutoCompleteRef.json";
import categoriesAndActivitesNomenclature from "refs/activitiesCategoriesNomenclature.json";
import secondaryCategoriesRef from "refs/secondaryActivityRef.json";
import placeRef from "refs/placeRef.json";
import { ReferentielData } from "interface/lunatic/Lunatic";
import { getReferentiel, ReferentielsEnum } from "./survey-service";

export const fetchReferentiels = (): Promise<ReferentielData> => {
    // To be replaced by API calls
    return new Promise(resolve => {
        const refs: ReferentielData = {
            [ReferentielsEnum.ACTIVITYNOMENCLATURE]: categoriesAndActivitesNomenclature,
            [ReferentielsEnum.ACTIVITYAUTOCOMPLETE]: activitesAutoCompleteRef,
            [ReferentielsEnum.SECONDARYACTIVITY]: secondaryCategoriesRef,
            [ReferentielsEnum.LOCATION]: placeRef,
        };
        resolve(refs);
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

export const getPlaceRef = (): CheckboxOneCustomOption[] => {
    return getReferentiel(ReferentielsEnum.LOCATION) as CheckboxOneCustomOption[];
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

export const findPlaceInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getPlaceRef().find(a => a.value === id);
};
