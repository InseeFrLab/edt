import axios from "axios";
import { UserSurveys } from "interface/entity/Api";
import { ReferentielData } from "interface/lunatic/Lunatic";
import { NomenclatureActivityOption } from "lunatic-edt";
import { AuthContextProps } from "oidc-react";
import { ReferentielsEnum } from "./survey-service";

const edtOrganisationApiBaseUrl = process.env.REACT_APP_EDT_ORGANISATION_API_BASE_URL;
const stromaeBackOfficeApiBaseUrl = process.env.REACT_APP_STROMAE_BACK_OFFICE_API_BASE_URL;

const getHeader = (auth: AuthContextProps) => {
    return {
        headers: {
            "Authorization": "Bearer " + auth.userData?.access_token,
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json",
        },
    };
};

const fetchReferentiel = (auth: AuthContextProps, idReferentiel: ReferentielsEnum) => {
    return axios.get<NomenclatureActivityOption[]>(
        stromaeBackOfficeApiBaseUrl + "api/nomenclature/" + idReferentiel,
        getHeader(auth),
    );
};

export const fetchReferentiels = (auth: AuthContextProps): Promise<ReferentielData> => {
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
    Object.values(ReferentielsEnum).map(value => {
        refsEndPoints.push("api/nomenclature/" + value);
    });

    return new Promise(resolve => {
        axios
            .all(
                refsEndPoints.map(endPoint =>
                    axios.get(stromaeBackOfficeApiBaseUrl + endPoint, getHeader(auth)),
                ),
            )
            .then(res => {
                Object.values(ReferentielsEnum).forEach((key, index) => {
                    refs[key as ReferentielsEnum] = res[index].data;
                });
                resolve(refs);
            });
    });
};

const fetchSurveysIds = (auth: AuthContextProps): Promise<string[]> => {
    let idsSurvey: string[] = [];
    return new Promise(resolve => {
        axios
            .get(
                edtOrganisationApiBaseUrl + "api/survey-assigment/interviewer/my-surveys",
                getHeader(auth),
            )
            .then(response => {
                const data: UserSurveys[] = response.data;
                idsSurvey = data.map(survey => survey.surveyUnitId);
                resolve(idsSurvey);
            });
    });
};

const saveSurveysData = (): void => {
    //TODO : to complete
};

export { fetchReferentiel, fetchSurveysIds };
