import worstActivityDay from "assets/illustration/worst-activity-day.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getActivitesSelectedLabel } from "service/survey-activity-service";

const WorstActivityDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const activites = getActivitesSelectedLabel(context.idSurvey);

    const specifiquesProps = {
        options: activites.map(activity => {
            return { label: activity.activityLabel || "", value: activity.activityCode || "" };
        }),
        defaultIcon: true,
    };

    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.WORST_ACTIVITY_DAY}
            backRoute={EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY}
            errorIcon={worstActivityDay}
            errorAltIcon={"accessibility.asset.worst-activity-day-alt"}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default WorstActivityDayPage;
