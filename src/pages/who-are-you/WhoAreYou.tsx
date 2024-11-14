import React, { useCallback, useMemo } from "react";
import WhoAreYouImg from "../../assets/illustration/who-are-you.svg?react";
import SurveyPageStep from "../../components/commons/SurveyPage/SurveyPageStep/SurveyPageStep";
import { EdtRoutesNameEnum } from "../../enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "../../interface/lunatic/Lunatic";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { surveyReadOnly } from "../../service/survey-activity-service";
import { validateAllGroup } from "../../service/survey-service";
import { getSurveyIdFromUrl } from "../../utils/utils";
import * as lunaticComponents from "@inseefr/lunatic/lib/index";

// We will inject a custom handleChange on component to intercept value change
const originalComponents = lunaticComponents as Record<string, any>;

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

    const validate = useCallback(() => {
        const input = (document.getElementsByClassName("MuiInputBase-input")?.[0] as HTMLInputElement)
            ?.value;
        validateAllGroup(navigate, idSurvey, input);
    }, [navigate, idSurvey]);

    // Create a list of lunatic components with a spy on handleChange to detect an input
    const components = useMemo(
        () => ({
            ...lunaticComponents,
            Input: (props: any) => {
                const handleChange = useCallback(
                    (response: unknown, value: string, ...rest: any) => {
                        setDisabledButton(value.length <= 1);
                        props.handleChange(response, value, ...rest);
                    },
                    [props.handleChange, setDisabledButton],
                );
                return <originalComponents.Input {...props} handleChange={handleChange} />;
            },
        }),
        [setDisabledButton],
    );

    return (
        <SurveyPageStep
            currentPage={EdtRoutesNameEnum.WHO_ARE_YOU}
            errorIcon={WhoAreYouImg}
            errorAltIcon={"accessibility.asset.who-are-you-alt"}
            isStep={false}
            disableButton={modifiable ? disabledButton : true}
            validateButton={validate}
            lunaticComponents={components}
        />
    );
};

export default WhoAreYouPage;
