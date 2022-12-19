import {
    SelectedActivity,
    findItemInCategoriesNomenclature,
    findItemInAutoCompleteRef,
    AutoCompleteActiviteOption,
    NomenclatureActivityOption,
} from "lunatic-edt";
import activitesAutoCompleteRef from "activitesAutoCompleteRef.json";
import categoriesAndActivitesNomenclature from "activitiesCategoriesNomenclature.json";

// TODO replace by API call at initialization
const getAutoCompleteRef = () => {
    return activitesAutoCompleteRef;
};

// TODO replace by API call at initialization
const getNomenclatureRef = () => {
    return categoriesAndActivitesNomenclature;
};

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

export {
    getAutoCompleteRef,
    getNomenclatureRef,
    findActivityInAutoCompleteReferentiel,
    findActivityInNomenclatureReferentiel,
};
