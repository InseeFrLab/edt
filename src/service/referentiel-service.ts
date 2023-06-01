import {
    AutoCompleteActiviteOption,
    CheckboxOneCustomOption,
    findItemInAutoCompleteRef,
    findItemInCategoriesNomenclature,
    NomenclatureActivityOption,
    SelectedActivity,
} from "@inseefrlab/lunatic-edt";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import i18n from "i18next";
import { getReferentiel } from "./survey-service";

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
