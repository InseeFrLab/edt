import axios from "axios";
import { ReferentielData } from "interface/lunatic/Lunatic";
import { NomenclatureActivityOption } from "lunatic-edt";
import https from "../http-common";
import { ReferentielsEnum } from "./survey-service";

const fetchReferentiel = (idReferentiel: ReferentielsEnum) => {
    return https.get<NomenclatureActivityOption[]>("/nomenclature/" + idReferentiel);
};

export const fetchReferentiels = (): Promise<ReferentielData> => {
    let refs: ReferentielData = {
        [ReferentielsEnum.ACTIVITYNOMENCLATURE]: [],
        [ReferentielsEnum.ACTIVITYAUTOCOMPLETE]: [],
        [ReferentielsEnum.ROUTE]: [],
        [ReferentielsEnum.ACTIVITYSECONDARYACTIVITY]: [],
        [ReferentielsEnum.ROUTESECONDARYACTIVITY]: [],
        [ReferentielsEnum.LOCATION]: [],
        [ReferentielsEnum.KINDOFWEEK]: [],
        [ReferentielsEnum.KINDOFDAY]: [],
    };
    let refsEndPoints: string[] = [];
    Object.values(ReferentielsEnum).forEach(value => {
        refsEndPoints.push("/nomenclature/" + value);
    });

    return new Promise(resolve => {
        axios.all(refsEndPoints.map(endPoint => https.get(endPoint))).then(res => {
            Object.values(ReferentielsEnum).forEach((key, index) => {
                refs[key as ReferentielsEnum] = res[index].data;
            });
            resolve(refs);
        });
    });
};

export { fetchReferentiel };
