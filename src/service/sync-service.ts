import { lunaticDatabase } from "./lunatic-database.ts";
import { SURVEYS_IDS, type SurveysIds } from "../interface/lunatic/Lunatic.ts";
import { SurveysIdsEnum } from "../enumerations/SurveysIdsEnum.ts";
import { getUserRights } from "./user-service.ts";
import { EdtUserRightsEnum } from "../enumerations/EdtUserRightsEnum.ts";
import { LocalStorageVariableEnum } from "../enumerations/LocalStorageVariableEnum.ts";
import { getListSurveysHousehold } from "./survey-service.ts";
import { remotePutSurveyData } from "./api-service/putRemoteData.ts";
import { remoteGetSurveyData, remoteGetSurveyStateData } from "./api-service/getRemoteData.ts";

/**
 * Sync local data with the server
 * @param {boolean} pushOnly Only send updated data, do not retrieve data from the serveur
 */
export async function syncSurveys(pushOnly = false): Promise<void> {
    const ids = await getAllSurveyIds();

    // We have no data locally, do nothing
    if (!ids) {
        return;
    }

    await Promise.allSettled(ids.map(id => syncSurvey(id, pushOnly)));
}

async function syncSurvey(surveyId: string, pushOnly: boolean): Promise<void> {
    const localData = await lunaticDatabase.get(surveyId);

    if (!localData || !localData.stateData) {
        return;
    }

    // We have local changes that need to be synced
    if ((localData?.lastLocalSaveDate ?? 0) > (localData?.lastRemoteSaveDate ?? 0)) {
        await remotePutSurveyData(surveyId, {
            data: localData,
            stateData: {
                ...localData.stateData,
                date: localData.stateData.date || Date.now(),
            },
        });
        await lunaticDatabase.save(surveyId, {
            ...localData,
            lastRemoteSaveDate: Date.now(),
        });
        return;
    }

    if (pushOnly) {
        return;
    }

    // Retrieve remote data
    const remoteData = await remoteGetSurveyData(surveyId);
    const stateData = await remoteGetSurveyStateData(surveyId);
    await lunaticDatabase.save(surveyId, {
        ...remoteData,
        stateData: stateData,
    });
}

/**
 * Retrieve the list of all survey ids from the database
 */
export async function getAllSurveyIds(): Promise<string[]> {
    if (getUserRights() !== EdtUserRightsEnum.REVIEWER) {
        const surveyIdsMap = (await lunaticDatabase.get(SURVEYS_IDS)) as SurveysIds;
        return surveyIdsMap[SurveysIdsEnum.ALL_SURVEYS_IDS];
    }

    const idHousehold = localStorage.getItem(LocalStorageVariableEnum.ID_HOUSEHOLD);
    return (
        getListSurveysHousehold()
            .find(household => household.idHousehold === idHousehold)
            ?.surveys?.map(survey => survey.surveyUnitId) ?? []
    );
}
