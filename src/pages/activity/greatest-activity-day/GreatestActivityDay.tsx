import greatestActivityDay from "assets/illustration/greatest-activity-day.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useOutletContext } from "react-router-dom";
import { getActivitesSelectedLabel } from "service/survey-activity-service";

const GreatestActivityDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const uniqueActivities = getActivitesSelectedLabel(context.idSurvey).filter(
        (value, index, self) =>
            index === self.findIndex(activity => activity.activityCode === value.activityCode),
    );

    const specifiquesProps = {
        options: uniqueActivities.map(activity => {
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
