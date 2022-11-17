import activitySurveySource from "activity-survey.json";
import { LunaticModel } from "interface/lunatic/Lunatic";
import { EdtRoutesNameEnum } from "routes/EdtRoutes";
import { getParameterizedNavigatePath } from "service/navigation-service";

const getCurrentPageSource = (idSurvey: string): LunaticModel | undefined => {
    if (
        window.location.pathname.includes(
            getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey),
        )
    ) {
        return activitySurveySource;
    }
};

export { getCurrentPageSource };
