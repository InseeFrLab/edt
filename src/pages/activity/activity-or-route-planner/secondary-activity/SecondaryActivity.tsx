import { ReactComponent as activityErrorIcon } from "../../../../assets/illustration/error/activity.svg";
import LoopSurveyPageStep from "../../../../components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "../../../../enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "../../../../enumerations/FieldNameEnum";

const SecondaryActivityPage = () => {
    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.SECONDARY_ACTIVITY}
            labelOfPage={"secondary-activity-selecter"}
            errorIcon={activityErrorIcon}
            backRoute={EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL}
            nextRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
            fieldConditionBack={FieldNameEnum.GOAL}
            fieldConditionNext={FieldNameEnum.WITHSECONDARYACTIVITY}
            specifiquesProps={{
                infoLight: "page.secondary-activity.info-light",
                infoBold: "page.secondary-activity.info-bold",
            }}
        />
    );
};

export default SecondaryActivityPage;
