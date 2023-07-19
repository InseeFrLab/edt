import greatestActivityDay from "assets/illustration/greatest-activity-day.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useOutletContext } from "react-router-dom";
import { getActivitesSelectedLabel } from "service/survey-activity-service";
import { getSurveyIdFromUrl } from "utils/utils";

const GreatestActivityDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const idSurvey = getSurveyIdFromUrl(context);
    const uniqueActivities = getActivitesSelectedLabel(idSurvey).filter(
        (value, index, self) =>
            index ===
            self.findIndex(
                activity =>
                    activity.activityCode === value.activityCode ||
                    activity.activityLabel === value.activityLabel,
            ),
    );

    const specifiquesProps = {
        options: uniqueActivities.map(activity => {
            return { label: activity.activityLabel || "", value: activity.activityCode || "" };
        }),
        defaultIcon: true,
    };

    return (
        <SurveyPageStep
            idSurvey={idSurvey}
            currentPage={EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY}
            backRoute={EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER}
            errorIcon={greatestActivityDay}
            errorAltIcon={"accessibility.asset.greatest-activity-day-alt"}
            specifiquesProps={specifiquesProps}
            withBottomPadding={true}
        />
    );
};

export default GreatestActivityDayPage;
