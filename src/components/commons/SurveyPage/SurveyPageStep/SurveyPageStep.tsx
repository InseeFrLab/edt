import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import extension from "assets/illustration/mui-icon/extension.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import { FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "constants/constants";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "orchestrator/Orchestrator";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router";
import {
    getOrchestratorPage,
    saveAndNav,
    saveAndNavFullPath,
    saveAndNextStep,
    setEnviro,
    validateAndNextStep,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { isPwa } from "service/responsive";
import { getStepData } from "service/stepper.service";
import { surveyReadOnly } from "service/survey-activity-service";
import { getPrintedFirstName, getPrintedSurveyDate } from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";
import SurveyPage from "../SurveyPage";

export interface SurveyPageStepProps {
    currentPage: EdtRoutesNameEnum;
    backRoute?: EdtRoutesNameEnum;
    nextRoute?: EdtRoutesNameEnum;
    isStep?: boolean;
    errorIcon?: string;
    errorAltIcon?: string;
    specifiquesProps?: any;
    disableButton?: boolean;
    withBottomPadding?: boolean;
}

const SurveyPageStep = (props: SurveyPageStepProps) => {
    const {
        currentPage,
        backRoute,
        nextRoute,
        isStep = true,
        errorIcon,
        errorAltIcon,
        specifiquesProps,
        disableButton,
        withBottomPadding = false,
    } = props;

    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const idSurvey = getSurveyIdFromUrl(context);

    const navigate = useNavigate();

    useEffect(() => {
        setEnviro(context, navigate, callbackHolder);
    });

    const { classes, cx } = useStyles({
        "isMobile": !isPwa(),
        "isIOS": isIOS,
        "isOpen": context.isOpenHeader ?? false,
    });

    const stepData = getStepData(currentPage);
    const modifiable = !surveyReadOnly(context.rightsSurvey);

    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    const componentLunaticProps: any = {
        onSelectValue: () => validateAndNextStep(idSurvey, context.source, currentPage),
        options: specifiquesProps?.options,
        defaultIcon: specifiquesProps?.defaultIcon,
        icon: specifiquesProps?.icon,
        altIcon: t(specifiquesProps?.altIconLabel),
        language: getLanguage(),
        constants: {
            START_TIME_DAY: START_TIME_DAY,
            FORMAT_TIME: FORMAT_TIME,
            MINUTE_LABEL: MINUTE_LABEL,
        },
        extensionIcon: extension,
        extensionIconAlt: t("accessibility.asset.mui-icon.extension"),
        modifiable: modifiable,
    };

    const surveyPageStepProps = {
        idSurvey: idSurvey,
        onNavigateBack: useCallback(
            () =>
                specifiquesProps?.displayModal
                    ? validateAndNav(false, setIsModalDisplayed)
                    : saveAndNav(idSurvey),
            [isModalDisplayed],
        ),
        onNext: useCallback(
            () =>
                specifiquesProps?.displayModal
                    ? validateAndNav(false, setIsModalDisplayed)
                    : saveAndNextStep(idSurvey, context.source, EdtRoutesNameEnum.ACTIVITY, currentPage),
            [isModalDisplayed],
        ),
        onPrevious: useCallback(
            () => (backRoute ? saveAndNavFullPath(idSurvey, backRoute) : saveAndNav(idSurvey)),
            [],
        ),
        simpleHeader: true,
        simpleHeaderLabel: t("page.complementary-questions.simple-header-label"),
        srcIcon: errorIcon,
        altIcon: errorAltIcon ? t(errorAltIcon) : undefined,
        displayStepper: true,
        currentStepNumber: stepData.stepNumber,
        currentStepLabel: stepData.stepLabel,
        backgroundWhiteHeader: true,
        disableNav: disableButton,
        modifiable: modifiable,
    };

    const surveyPageNotStepProps = {
        idSurvey: idSurvey,
        validate: useCallback(
            () =>
                nextRoute
                    ? saveAndNavFullPath(idSurvey, nextRoute)
                    : saveAndNextStep(idSurvey, context.source, context.surveyRootPage, currentPage),
            [],
        ),
        srcIcon: errorIcon,
        altIcon: errorAltIcon ? t(errorAltIcon) : undefined,
        onNavigateBack: useCallback(() => saveAndNav(idSurvey), []),
        onPrevious: useCallback(
            () => (backRoute ? saveAndNavFullPath(idSurvey, backRoute) : saveAndNav(idSurvey)),
            [],
        ),
        firstName: getPrintedFirstName(idSurvey),
        surveyDate: getPrintedSurveyDate(idSurvey, context.surveyRootPage),
        disableNav: disableButton,
        modifiable: modifiable,
    };

    const orchestratorProps = {
        source: context.source,
        data: context.data,
        cbHolder: callbackHolder,
        page: getOrchestratorPage(currentPage, context.surveyRootPage),
        overrideOptions: specifiquesProps?.referentiel,
        componentSpecificProps: componentLunaticProps,
    };

    const validateAndNav = (
        forceQuit: boolean,
        setIsModalDisplayed: (value: SetStateAction<boolean>) => void,
    ): void => {
        if (forceQuit) {
            saveAndNav(idSurvey);
        } else {
            setIsModalDisplayed(true);
        }
    };

    const surveyPageProps = isStep ? surveyPageStepProps : surveyPageNotStepProps;

    return (
        <Box
            className={cx(
                !isPwa() && (isIOS || isAndroid) ? classes.pageMobileTablet : classes.pageDesktop,
            )}
        >
            <SurveyPage {...surveyPageProps}>
                <FlexCenter className={withBottomPadding ? classes.bottomPadding : ""}>
                    <FelicitationModal
                        isModalDisplayed={isModalDisplayed}
                        onCompleteCallBack={useCallback(
                            () => validateAndNav(true, setIsModalDisplayed),
                            [isModalDisplayed],
                        )}
                        content={t("component.modal-edt.modal-felicitation.activity-content")}
                    />
                    <OrchestratorForStories {...orchestratorProps} />
                </FlexCenter>
            </SurveyPage>
        </Box>
    );
};

const useStyles = makeStylesEdt<{ isMobile: boolean; isIOS: boolean; isOpen: boolean }>({
    "name": { SurveyPageStep },
})((theme, { isIOS, isOpen }) => ({
    bottomPadding: {
        paddingBottom: "6rem",
    },
    pageDesktop: {
        height: "100%",
    },
    pageMobileTablet: {
        height: "100%",
        maxHeight: isIOS ? (isOpen ? "80vh" : "87vh") : "94vh",
    },
}));

export default SurveyPageStep;
