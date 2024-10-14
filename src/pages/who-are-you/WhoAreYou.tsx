import React, { useCallback } from "react";
import WhoAreYouImg from "../../assets/illustration/who-are-you.svg?react";
import SurveyPageStep from "../../components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "../../enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "../../interface/lunatic/Lunatic";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { surveyReadOnly } from "../../service/survey-activity-service";
import { validateAllGroup } from "../../service/survey-service";
import { getSurveyIdFromUrl } from "../../utils/utils";

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

    // const keydownChange = useCallback(() => {
    //     const input = (document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement)?.value;
    //     if (input) {
    //         setDisabledButton(input.length <= 1);
    //     }
    // }, []);

    // React.useEffect(() => {
    //     document.addEventListener("keyup", keydownChange, true);
    //     return () => document.removeEventListener("keyup", keydownChange, true);
    // }, [keydownChange]);

    const keypressChange = useCallback((event: KeyboardEvent) => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (event.key === "Enter" && isMobile) {
            (document.activeElement as HTMLElement)?.blur();
        }
        const input = (document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement)?.value;
        setDisabledButton(!input || input.length <= 1);
    }, []);

    React.useEffect(() => {
        document.addEventListener("keypress", keypressChange, true);
        return () => document.removeEventListener("keypress", keypressChange, true);
    }, [keypressChange]);

    const validate = useCallback(() => {
        const input = (document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement)?.value;
        validateAllGroup(navigate, idSurvey, input);
    }, [navigate, idSurvey]);

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
