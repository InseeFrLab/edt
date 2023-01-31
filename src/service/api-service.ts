import axios from "axios";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { SurveyData, UserSurveys } from "interface/entity/Api";
import { ReferentielData, SourceData } from "interface/lunatic/Lunatic";
import { NomenclatureActivityOption } from "lunatic-edt";
import { AuthContextProps } from "oidc-react";

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

const fetchUserSurveysInfo = (auth: AuthContextProps): Promise<UserSurveys[]> => {
    return new Promise(resolve => {
        axios
            .get(
                edtOrganisationApiBaseUrl + "api/survey-assigment/interviewer/my-surveys",
                getHeader(auth),
            )
            .then(response => {
                const data: UserSurveys[] = response.data;
                resolve(data);
            });
    });
};

const fetchSurveysSourcesByIds = (auth: AuthContextProps, sourcesIds: string[]): Promise<SourceData> => {
    let sources: any = {};
    let sourcesEndPoints: string[] = [];
    sourcesIds.map(sourceId => sourcesEndPoints.push("api/questionnaire/" + sourceId));
    return new Promise(resolve => {
        axios
            .all(
                sourcesEndPoints.map(endPoint =>
                    axios.get(stromaeBackOfficeApiBaseUrl + endPoint, getHeader(auth)),
                ),
            )
            .then(res => {
                sourcesIds.forEach((idSource, index) => {
                    sources[idSource] = res[index].data.value;
                });
                resolve(sources as SourceData);
            });
    });
};

const remoteSaveSurveyData = (auth: AuthContextProps, idSurvey: string, data: SurveyData) => {
    return new Promise(resolve => {
        axios
            .put(edtOrganisationApiBaseUrl + "api/survey-unit/" + idSurvey, data, getHeader(auth))
            .then(response => {
                console.log(response);
                resolve(response);
            });
    });
};

export { fetchReferentiel, fetchUserSurveysInfo, fetchSurveysSourcesByIds, remoteSaveSurveyData };
