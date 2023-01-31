import greatestActivityDay from "assets/illustration/greatest-activity-day.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getActivitesSelectedLabel } from "service/survey-activity-service";

const GreatestActivityDayPage = () => {
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
            currentPage={EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY}
            backRoute={EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER}
            errorIcon={greatestActivityDay}
            errorAltIcon={"accessibility.asset.greatest-activity-day-alt"}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default GreatestActivityDayPage;
