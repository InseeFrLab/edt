import axios from "axios";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { SurveyData, UserSurveys } from "interface/entity/Api";
import { ReferentielData, SourceData } from "interface/lunatic/Lunatic";
import { NomenclatureActivityOption } from "lunatic-edt";
import { AuthContextProps } from "oidc-react";
import { getUserToken } from "./user-service";

const edtOrganisationApiBaseUrl = process.env.REACT_APP_EDT_ORGANISATION_API_BASE_URL;
const stromaeBackOfficeApiBaseUrl = process.env.REACT_APP_STROMAE_BACK_OFFICE_API_BASE_URL;

const getHeader = () => {
    return {
        headers: {
            "Authorization": "Bearer " + getUserToken(),
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json",
        },
    };
};

const fetchReferentiel = (auth: AuthContextProps, idReferentiel: ReferentielsEnum) => {
    return axios.get<NomenclatureActivityOption[]>(
        stromaeBackOfficeApiBaseUrl + "api/nomenclature/" + idReferentiel,
        getHeader(),
    );
};

export const fetchReferentiels = (): Promise<ReferentielData> => {
    let refs: ReferentielData = {
        [ReferentielsEnum.ACTIVITYNOMENCLATURE]: [],
        [ReferentielsEnum.ACTIVITYAUTOCOMPLETE]: [],
        [ReferentielsEnum.ROUTE]: [],
        [ReferentielsEnum.MEANOFTRANSPORT]: [],
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
                    axios.get(stromaeBackOfficeApiBaseUrl + endPoint, getHeader()),
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

const fetchUserSurveysInfo = (setError: (error: ErrorCodeEnum) => void): Promise<UserSurveys[]> => {
    return new Promise(resolve => {
        axios
            .get(edtOrganisationApiBaseUrl + "api/survey-assigment/interviewer/my-surveys", getHeader())
            .then(response => {
                const data: UserSurveys[] = response.data;
                resolve(data);
            })
            .catch(err => {
                setError(ErrorCodeEnum.NO_RIGHTS);
            });
    });
};

const fetchSurveysSourcesByIds = (sourcesIds: string[]): Promise<SourceData> => {
    let sources: any = {};
    let sourcesEndPoints: string[] = [];
    sourcesIds.map(sourceId => sourcesEndPoints.push("api/questionnaire/" + sourceId));
    return new Promise(resolve => {
        axios
            .all(
                sourcesEndPoints.map(endPoint =>
                    axios.get(stromaeBackOfficeApiBaseUrl + endPoint, getHeader()),
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

const remotePutSurveyData = (idSurvey: string, data: SurveyData): Promise<SurveyData> => {
    return new Promise(resolve => {
        axios
            .put(stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey, data, getHeader())
            .then(() => {
                resolve(data);
            });
    });
};

const remoteGetSurveyData = (
    idSurvey: string,
    setError: (error: ErrorCodeEnum) => void,
): Promise<SurveyData> => {
    return new Promise(resolve => {
        axios
            .get(stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey, getHeader())
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                if (err.response.status === 403) setError(ErrorCodeEnum.NO_RIGHTS);
            });
    });
};

export {
    fetchReferentiel,
    fetchUserSurveysInfo,
    fetchSurveysSourcesByIds,
    remotePutSurveyData,
    remoteGetSurveyData,
};
