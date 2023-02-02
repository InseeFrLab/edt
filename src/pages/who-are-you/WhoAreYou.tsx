import who_are_you from "assets/illustration/who-are-you.svg";
import SurveyPageStep from "components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import React from "react";
import { useOutletContext } from "react-router-dom";
import { navToErrorPage } from "service/navigation-service";
import { getComponentId } from "service/survey-service";

const WhoAreYouPage = () => {
    const context: OrchestratorContext = useOutletContext();
    let [disabledButton, setDisabledButton] = React.useState<boolean>(true);

    const keydownChange = () => {
        const componentId = getComponentId(FieldNameEnum.FIRSTNAME, context.source);
        if (componentId == null) {
            navToErrorPage();
        } else {
            setDisabledButton(
                callbackHolder.getErrors() == undefined ||
                    callbackHolder.getErrors()[componentId].length > 0,
            );
        }
    };

    React.useEffect(() => {
        document.addEventListener("keyup", keydownChange, true);
        return () => document.removeEventListener("keyup", keydownChange, true);
    }, [callbackHolder]);

    const keypressChange = (event: any) => {
        if (event.key === "Enter") {
            document.getElementById("validateButton")?.click();
        }
    };

    React.useEffect(() => {
        document.addEventListener("keypress", keypressChange, true);
        return () => document.removeEventListener("keypress", keypressChange, true);
    }, [callbackHolder]);

    return (
        <>
            <SurveyPageStep
                currentPage={EdtRoutesNameEnum.WHO_ARE_YOU}
                errorIcon={who_are_you}
                errorAltIcon={"accessibility.asset.who-are-you-alt"}
                isStep={false}
                disableButton={disabledButton}
            />
        </>
    );
};

export default WhoAreYouPage;
