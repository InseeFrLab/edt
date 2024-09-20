import { ReferentielsEnum } from "../../enumerations/ReferentielsEnum";
import { ReferentielData } from "../../interface/lunatic/Lunatic";
import { AuthContextProps } from "oidc-react";
import {
    edtActivityAutoComplete,
    edtActivityCategory,
    edtActivityGoal,
    edtActivitySecondaryActivity,
    edtKindOfDay,
    edtKindOfWeek,
    edtMeanOfTransport,
    edtPlace,
    edtRoute,
    edtRouteSecondaryActivity,
} from "../../assets/surveyData/edtNomenclatures";

const fetchReferentiel = (_: AuthContextProps, idReferentiel: ReferentielsEnum) => {
    return Promise.resolve({ data: idReferentiel });
};

const fetchReferentiels = (): Promise<ReferentielData> => {
    let refs: ReferentielData = {
        // @ts-ignore
        [ReferentielsEnum.ACTIVITYNOMENCLATURE]: [...edtActivityCategory],
        [ReferentielsEnum.ACTIVITYAUTOCOMPLETE]: [...edtActivityAutoComplete],
        [ReferentielsEnum.ROUTE]: [...edtRoute],
        [ReferentielsEnum.MEANOFTRANSPORT]: [...edtMeanOfTransport],
        [ReferentielsEnum.ACTIVITYSECONDARYACTIVITY]: [...edtActivitySecondaryActivity],
        [ReferentielsEnum.ROUTESECONDARYACTIVITY]: [...edtRouteSecondaryActivity],
        [ReferentielsEnum.LOCATION]: [...edtPlace],
        [ReferentielsEnum.KINDOFWEEK]: [...edtKindOfWeek],
        [ReferentielsEnum.KINDOFDAY]: [...edtKindOfDay],
        [ReferentielsEnum.ACTIVITYGOAL]: [...edtActivityGoal],
    };
    return new Promise(resolve => {
        resolve(refs);
    });
};

export { fetchReferentiel, fetchReferentiels };
