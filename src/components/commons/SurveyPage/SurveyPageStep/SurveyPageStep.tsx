import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import ExtensionIcon from "../../../../assets/illustration/mui-icon/extension.svg?react";
import FlexCenter from "../../../../components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "../../../../components/commons/Modal/FelicitationModal/FelicitationModal";
import { FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "../../../../constants/constants";
import { EdtRoutesNameEnum } from "../../../../enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "../../../../interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "../../../../orchestrator/Orchestrator";
import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router";
import { useLocation } from "react-router-dom";
import {
    getNavigatePath,
    getOrchestratorPage,
    getParameterizedNavigatePath,
    saveAndNav,
    saveAndNavFullPath,
    saveAndNavLocally,
    saveAndNextStep,
    setEnviro,
    validateAndNextStep,
} from "../../../../service/navigation-service";
import { getLanguage } from "../../../../service/referentiel-service";
import { isPwa } from "../../../../service/responsive";
import { getStepData } from "../../../../service/stepper.service";
import { surveyReadOnly } from "../../../../service/survey-activity-service";
import { getData, getPrintedFirstName, getPrintedSurveyDate, isDemoMode } from "../../../../service/survey-service";
import { getSurveyIdFromUrl } from "../../../../utils/utils";
import SurveyPage from "../SurveyPage";
import { EdtUserRightsEnum } from "../../../../enumerations/EdtUserRightsEnum";
import { getUserRights } from "../../../../service/user-service";
import _ from "lodash";

export interface SurveyPageStepProps {
    currentPage: EdtRoutesNameEnum;
    backRoute?: EdtRoutesNameEnum;
    nextRoute?: EdtRoutesNameEnum;
    isStep?: boolean;
    errorIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    errorAltIcon?: string;
    specifiquesProps?: any;
    disableButton?: boolean;
    validateButton?: () => void;
    withBottomPadding?: boolean;
    lunaticComponents?: Record<string, any>;
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
        validateButton,
        withBottomPadding = false,
    } = props;

    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);

    const navigate = useNavigate();
    const isReviewerMode = getUserRights() === EdtUserRightsEnum.REVIEWER;
    const isDemo = isDemoMode();

    useEffect(() => {
        setEnviro(context, navigate, callbackHolder);
    });

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

    const navigateHome = useCallback(() => {
        return navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
    }, []);

    const { classes, cx } = useStyles({
        "isMobile": !isPwa(),
        "isIOS": isIOS,
        "iosHeight": context.isOpenHeader ? "80vh" : "87vh",
        "withStepper": isStep,
        "innerHeight": window.innerHeight,
    });

    const stepData = getStepData(currentPage);
    const modifiable =
        context.surveyRootPage == EdtRoutesNameEnum.WORK_TIME
            ? true
            : !surveyReadOnly(context.rightsSurvey);

    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    const componentLunaticProps: any = useMemo(
        () => ({
            onSelectValue: () => validateAndNextStep(idSurvey, context.source, currentPage),
            options: specifiquesProps?.options,
            defaultIcon: specifiquesProps?.defaultIcon,
            icon: specifiquesProps?.icon,
            language: getLanguage(),
            constants: {
                START_TIME_DAY: START_TIME_DAY,
                FORMAT_TIME: FORMAT_TIME,
                MINUTE_LABEL: MINUTE_LABEL,
            },
            extensionIcon: <ExtensionIcon aria-label={t("accessibility.asset.mui-icon.extension")} />,
            modifiable: modifiable,
            defaultLanguage: "fr",
        }),
        [specifiquesProps, modifiable],
    );

    const IconError = errorIcon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    const surveyPageStepProps = {
        idSurvey: idSurvey,
        onNavigateBack: useCallback(
            () => {
                if (!isReviewerMode || isDemo) {
                    if (specifiquesProps?.displayModal) {
                        validateAndNav(false, setIsModalDisplayed);
                    } else {
                        saveAndNavLocally(idSurvey);
                    }
                }
                navigateHome();
            },
            [isReviewerMode, isModalDisplayed, idSurvey, navigateHome, validateAndNav, saveAndNavLocally, isDemo],
        ),
        onNext: useCallback(() => {

            if (!isReviewerMode || isDemo) {
                if (specifiquesProps?.displayModal) {
                    validateAndNav(false, setIsModalDisplayed);
                } else {
                    saveAndNextStep(idSurvey, context.source, EdtRoutesNameEnum.ACTIVITY, currentPage);
                }
            }
        }, [
            isReviewerMode,
            isModalDisplayed,
            saveAndNextStep,
            validateAndNav,
            idSurvey,
            context,
            currentPage,
            isDemo
        ]),
        onPrevious: useCallback(
            () => {
                if (!isReviewerMode || isDemo) {
                    backRoute
                        ? saveAndNavFullPath(idSurvey, backRoute)
                        : saveAndNavLocally(idSurvey);
                }
                navigate(
                    backRoute
                        ? getNavigatePath(backRoute)
                        : `${getParameterizedNavigatePath(
                            EdtRoutesNameEnum.ACTIVITY,
                            idSurvey,
                        )}${getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY)}`,
                );
            },
            [
                isReviewerMode,
                backRoute,
                idSurvey,
                saveAndNavFullPath,
                saveAndNavLocally,
                isDemo

            ],
        ),
        simpleHeader: true,
        simpleHeaderLabel: t("page.complementary-questions.simple-header-label"),
        icon: errorIcon ? <IconError aria-label={t(errorAltIcon ?? "")} /> : undefined,
        displayStepper: true,
        currentStepNumber: stepData.stepNumber,
        currentStepLabel: stepData.stepLabel,
        backgroundWhiteHeader: true,
        disableNav: disableButton,
        modifiable: modifiable,
    };

    const surveyPageNotStepProps = {
        idSurvey: idSurvey,
        validate: useCallback(() => {
            if (!validateButton) {
                return;
            }
            if (!isReviewerMode || isDemo) {
                validateButton();
                if (nextRoute) {
                    saveAndNavFullPath(idSurvey, nextRoute);
                } else {
                    saveAndNextStep(idSurvey, context.source, context.surveyRootPage, currentPage);
                }
            }
        }, [
            isReviewerMode,
            nextRoute,
            saveAndNavFullPath,
            saveAndNextStep,
            idSurvey,
            context,
            currentPage,
            isDemo
        ]),
        icon: errorIcon ? <IconError aria-label={t(errorAltIcon ?? "")} /> : undefined,
        onNavigateBack: useCallback(() => {
            if (!isReviewerMode || isDemo) {
                saveAndNavLocally(idSurvey);
            }
            navigateHome();
        }, [isReviewerMode, saveAndNavLocally, idSurvey, navigateHome, isDemo]),
        onPrevious: useCallback(
            () => {
                if (!isReviewerMode || isDemo) {
                    backRoute
                        ? saveAndNavFullPath(idSurvey, backRoute)
                        : saveAndNavLocally(idSurvey);
                }
                navigate(getNavigatePath(backRoute ?? EdtRoutesNameEnum.ACTIVITY));
            },
            [
                isReviewerMode,
                backRoute,
                saveAndNavFullPath,
                saveAndNavLocally,
                idSurvey,
                getNavigatePath,
                isDemo
            ],
        ),
        firstName: getPrintedFirstName(idSurvey),
        surveyDate: getPrintedSurveyDate(idSurvey, context.surveyRootPage),
        disableNav: disableButton,
        modifiable: modifiable,
    };

    const surveyPageProps = isStep ? surveyPageStepProps : surveyPageNotStepProps;
    const surveyData = useMemo(() => getData(idSurvey), [idSurvey]);

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
                    <OrchestratorForStories
                        source={context.source}
                        data={surveyData}
                        callbackHolder={callbackHolder}
                        page={getOrchestratorPage(currentPage, context.surveyRootPage)}
                        overrideOptions={specifiquesProps?.referentiel}
                        componentSpecificProps={componentLunaticProps}
                        components={props.lunaticComponents}
                    />
                </FlexCenter>
            </SurveyPage>
        </Box>
    );
};

const useStyles = makeStylesEdt<{
    isMobile: boolean;
    isIOS: boolean;
    iosHeight: string;
    withStepper: boolean;
    innerHeight: number;
}>({
    "name": { SurveyPageStep },
})((_, { isIOS, iosHeight, withStepper, innerHeight }) => ({
    bottomPadding: {
        paddingBottom: "4rem",
    },
    pageDesktop: {
        height: withStepper ? "90%" : "100%",
    },
    pageMobileTablet: {
        maxHeight: isIOS ? iosHeight : innerHeight + "px",
        height: "100%",
    },
}));

export default SurveyPageStep;
