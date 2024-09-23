import React, { useCallback } from "react";
import WhoAreYouImg from "../../assets/illustration/who-are-you.svg?react";
import SurveyPageStep from "../../components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "../../enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "../../interface/lunatic/Lunatic";
import { callbackHolder } from "../../orchestrator/Orchestrator";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { surveyReadOnly } from "../../service/survey-activity-service";
import { getComponentId, validateAllGroup } from "../../service/survey-service";
import { getSurveyIdFromUrl } from "../../utils/utils";
import { FieldNameEnum } from "../../enumerations/FieldNameEnum";
import { navToErrorPage } from "../../service/navigation-service";

const WhoAreYouPage = () => {
    const context: OrchestratorContext = useOutletContext();
    let [disabledButton, setDisabledButton] = React.useState<boolean>(true);
    const modifiable =
        context.surveyRootPage == EdtRoutesNameEnum.WORK_TIME
            ? true
            : !surveyReadOnly(context.rightsSurvey);

    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const navigate = useNavigate();

    const keydownChange = () => {
        const componentId = getComponentId(FieldNameEnum.FIRSTNAME, context.source);
        if (componentId == null) {
            navToErrorPage();
        } else {
            const input = (document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement)
                ?.value;
            input.length > 1 ? setDisabledButton(false) : setDisabledButton(true);
        }
    };

    React.useEffect(() => {
        document.addEventListener("keyup", keydownChange, true);
        return () => document.removeEventListener("keyup", keydownChange, true);
    }, [callbackHolder]);

    const keypressChange = (event: KeyboardEvent) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (event.key === "Enter" && isMobile) {
            (document.activeElement as HTMLElement)?.blur();
        }
        setDisabledButton(false);
    };

    React.useEffect(() => {
        document.addEventListener("keypress", keypressChange, true);
        return () => document.removeEventListener("keypress", keypressChange, true);
    }, [callbackHolder]);

    const validate = useCallback(() => {
        const input = (document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement)
            ?.value;
        validateAllGroup(navigate, idSurvey, input);
    }, []);

    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.WHO_ARE_YOU}
            errorIcon={WhoAreYouImg}
            errorAltIcon={"accessibility.asset.who-are-you-alt"}
            isStep={false}
            disableButton={modifiable ? disabledButton : true}
            validateButton={validate}
        />
    );
};

export default WhoAreYouPage;
