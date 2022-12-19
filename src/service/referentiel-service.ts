import {
    SelectedActivity,
    findItemInCategoriesNomenclature,
    findItemInAutoCompleteRef,
    AutoCompleteActiviteOption,
    NomenclatureActivityOption,
    CheckboxOneCustomOption
} from "lunatic-edt";
import activitesAutoCompleteRef from "activitesAutoCompleteRef.json";
import categoriesAndActivitesNomenclature from "activitiesCategoriesNomenclature.json";
import secondaryCategoriesRef from "secondaryActivityRef.json";

// TODO replace by API call at initialization
const getAutoCompleteRef = (): AutoCompleteActiviteOption[] => {
    return activitesAutoCompleteRef;
};
// TODO replace by API call at initialization
const getNomenclatureRef = (): NomenclatureActivityOption[] => {
    return categoriesAndActivitesNomenclature;
};
// TODO replace by API call at initialization
const getSecondaryActivityRef = (): CheckboxOneCustomOption[] => {
    return secondaryCategoriesRef;
}

const findActivityInAutoCompleteReferentiel = (
    selectedActivity: SelectedActivity,
): AutoCompleteActiviteOption | undefined => {
    return findItemInAutoCompleteRef(selectedActivity?.suggesterId, getAutoCompleteRef());
};

const findActivityInNomenclatureReferentiel = (
    selectedActivity: SelectedActivity,
): NomenclatureActivityOption | undefined => {
    return findItemInCategoriesNomenclature(selectedActivity.id, getNomenclatureRef())?.item;
};

const findSecondaryActivityInRef = (id: string): CheckboxOneCustomOption | undefined => {
    return getSecondaryActivityRef().find(a => a.value === id);
};

export {
    getAutoCompleteRef,
    getNomenclatureRef,
    getSecondaryActivityRef,
    findActivityInAutoCompleteReferentiel,
    findActivityInNomenclatureReferentiel,
    findSecondaryActivityInRef
};
