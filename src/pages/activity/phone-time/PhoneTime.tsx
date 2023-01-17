import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { SetStateAction, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import {
    getOrchestratorPage,
    saveAndNav,
    saveAndNavFullPath,
    setEnviro,
} from "service/navigation-service";
import { getStepData } from "service/stepper.service";
import { getPrintedFirstName } from "service/survey-service";

const validateAndNav = (
    forceQuit: boolean,
    setIsModalDisplayed: (value: SetStateAction<boolean>) => void,
): void => {
    if (forceQuit) {
        saveAndNav();
    } else {
        setIsModalDisplayed(true);
    }
};

const PhoneTimePage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.PHONE_TIME;
    const stepData = getStepData(currentPage);
    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    return (
        <SurveyPage
            validate={useCallback(() => validateAndNav(false, setIsModalDisplayed), [])}
            onNavigateBack={useCallback(() => validateAndNav(false, setIsModalDisplayed), [])}
            onPrevious={useCallback(() => saveAndNavFullPath(EdtRoutesNameEnum.TRAVEL_TIME), [])}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.complementary-questions.simple-header-label")}
            displayStepper={true}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            backgroundWhiteHeader={true}
        >
            <FlexCenter>
                <FelicitationModal
                    isModalDisplayed={isModalDisplayed}
                    onCompleteCallBack={useCallback(() => validateAndNav(true, setIsModalDisplayed), [])}
                    content={t("component.modal-edt.modal-felicitation.activity-content")}
                />
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    cbHolder={callbackHolder}
                    page={getOrchestratorPage(currentPage)}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default PhoneTimePage;
