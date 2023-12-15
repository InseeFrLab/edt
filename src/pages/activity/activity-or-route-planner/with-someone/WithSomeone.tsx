import peopleErrorIcon from "assets/illustration/error/people.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useOutletContext } from "react-router";

const WithSomeonePage = () => {
    const context: OrchestratorContext = useOutletContext();
    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.WITH_SOMEONE}
            labelOfPage={"with-someone-selecter"}
            errorIcon={peopleErrorIcon}
            backRoute={
                context.isRoute
                    ? EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION
                    : EdtRoutesNameEnum.ACTIVITY_LOCATION
            }
            nextRoute={EdtRoutesNameEnum.WITH_SOMEONE_SELECTION}
            fieldConditionBack={FieldNameEnum.WITHSECONDARYACTIVITY}
            fieldConditionNext={FieldNameEnum.WITHSOMEONE}
            specifiquesProps={{
                infoBold: "page.with-someone.tooltip-bold",
            }}
        />
    );
};

export default WithSomeonePage;
