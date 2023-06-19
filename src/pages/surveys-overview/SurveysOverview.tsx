import { makeStylesEdt, important } from "@inseefrlab/lunatic-edt";
import { Checkbox, InputAdornment, OutlinedInput, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import arrowForwardIosGrey from "assets/illustration/mui-icon/arrow-forward-ios-grey.svg";
import refresh from "assets/illustration/mui-icon/refresh-white.svg";
import home from "assets/illustration/mui-icon/home.svg";
import person from "assets/illustration/mui-icon/person-white.svg";
import search from "assets/illustration/mui-icon/search.svg";
import stats from "assets/illustration/stats.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import ReviewerPage from "components/commons/ReviewerPage/ReviewerPage";
import HouseholdCard from "components/edt/HouseholdCard/HouseholdCard";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import {
    getListSurveysHousehold,
    initializeSurveysIdsDataModeReviewer,
    initializeListSurveys,
    refreshSurveyData,
} from "service/survey-service";
import { isMobile } from "service/responsive";

const SurveysOverviewPage = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const emptyArray: any[] = [];
    const isItMobile = isMobile();

    let dataHouseholds = getListSurveysHousehold();

    let [isFilterValidatedSurvey, setIsFilterValidatedSurvey] = React.useState(false);
    let [searchResult, setSearchResult] = React.useState(dataHouseholds);
    let [filterValidatedResult, setFilterValidatedResult] = React.useState(emptyArray);
    let [initialized, setInitialized] = React.useState(false);

    const initHouseholds = () => {
        dataHouseholds = getListSurveysHousehold();
        setSearchResult(dataHouseholds);
        setInitialized(true);
    };

    useEffect(() => {
        initializeSurveysIdsDataModeReviewer().then(() => {
            initHouseholds();
        });
    }, []);

    const navToReviewerHome = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME));
    }, []);

    const refreshHouseholds = useCallback(() => {
        setInitialized(false);
        initializeListSurveys().then(() => {
            refreshSurveyData().then(() => {
                initHouseholds();
            });
        });
    }, []);

    const isToFilter = (houseHoldData: any): boolean => {
        return (
            houseHoldData.surveys.startedSurveysAmount == 0 &&
            houseHoldData.surveys.closedSurveysAmount == 0 &&
            houseHoldData.surveys.validatedSurveysAmount >= 1
        );
    };

    const onFilterSearchBox = useCallback(
        (event: any) => {
            let newSearchResult = dataHouseholds.filter(
                houseHoldData =>
                    houseHoldData?.userName?.toLowerCase().includes(event.target.value.toLowerCase()) ||
                    houseHoldData?.idHousehold?.toLowerCase().includes(event.target.value.toLowerCase()),
            );

            if (isFilterValidatedSurvey) {
                newSearchResult = newSearchResult?.filter(houseHoldData => !isToFilter(houseHoldData));
            }
            sortSearchResult(newSearchResult);
            setSearchResult(newSearchResult);

            let newFilterValidatedResult = dataHouseholds.filter(
                houseHoldData =>
                    (houseHoldData?.userName?.toLowerCase().includes(event.target.value.toLowerCase()) ||
                        houseHoldData?.idHousehold?.includes(event.target.value)) &&
                    isToFilter(houseHoldData),
            );
            setFilterValidatedResult(newFilterValidatedResult);
        },
        [searchResult, filterValidatedResult],
    );

    const onFilterValidatedSurveyChange = useCallback(() => {
        isFilterValidatedSurvey = !isFilterValidatedSurvey;
        setIsFilterValidatedSurvey(isFilterValidatedSurvey);

        if (isFilterValidatedSurvey) {
            const newSearchResult = searchResult?.filter(
                (houseHoldData: any) => !isToFilter(houseHoldData),
            );
            sortSearchResult(newSearchResult);
            setSearchResult(newSearchResult);

            const newFilterValidatedResult = searchResult?.filter((houseHoldData: any) =>
                isToFilter(houseHoldData),
            );
            setFilterValidatedResult(newFilterValidatedResult);
        } else {
            const newSearchResult = searchResult?.concat(filterValidatedResult);
            sortSearchResult(newSearchResult);
            setSearchResult(newSearchResult);
            onFilterSearchBox;
        }
    }, [searchResult, filterValidatedResult]);

    const sortSearchResult = useCallback(
        (houseHoldData: any) => {
            const newSearchResult = houseHoldData.sort(
                (houseHoldData1: any, houseHoldData2: any) =>
                    Number(houseHoldData1.idHousehold) - Number(houseHoldData2.idHousehold),
            );
            setSearchResult(newSearchResult);
        },
        [searchResult],
    );

    const renderHouseHold = useCallback(
        (dataHousehold: any, index: number) => {
            console.log(dataHousehold);
            return (
                <HouseholdCard
                    key={"household-card-" + index}
                    idHousehold={dataHousehold.idHousehold}
                    householdStaticLabel={t("page.surveys-overview.household-static-label")}
                    iconPerson={person}
                    iconPersonAlt={t("accessibility.asset.mui-icon.person")}
                    iconArrow={arrowForwardIosGrey}
                    iconArrowAlt={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                    startedSurveyLabel={
                        dataHousehold?.stats?.numHouseholdsInProgress > 1
                            ? t("page.surveys-overview.starteds-survey-label")
                            : t("page.surveys-overview.started-survey-label")
                    }
                    closedSurveyLabel={
                        dataHousehold?.stats?.numHouseholdsClosed > 1
                            ? t("page.surveys-overview.closeds-survey-label")
                            : t("page.surveys-overview.closed-survey-label")
                    }
                    validatedSurveyLabel={
                        dataHousehold?.stats?.numHouseholdsValidated > 1
                            ? t("page.surveys-overview.validateds-survey-label")
                            : t("page.surveys-overview.validated-survey-label")
                    }
                    dataHousehold={dataHousehold}
                />
            );
        },
        [searchResult],
    );

    const renderResults = useCallback(() => {
        return searchResult?.map((dataHousehold: any, index: number) =>
            renderHouseHold(dataHousehold, index),
        );
    }, [searchResult]);

    return initialized ? (
        <ReviewerPage
            className={classes.reviewerPage}
            onClickHome={navToReviewerHome}
            homeIcon={home}
            homeIconAlt={t("accessibility.asset.mui-icon.home")}
        >
            <Box className={cx(classes.title, isItMobile ? classes.titleMobile : "")}>
                <img src={stats} alt={t("accessibility.asset.stats-alt")} />
                <Typography className={classes.label}>{t("page.surveys-overview.title")}</Typography>
            </Box>
            <Box className={classes.searchBox}>
                <Box
                    className={cx(
                        classes.innerSearchBox,
                        isItMobile ? classes.innerSearchMobileBox : "",
                    )}
                >
                    <OutlinedInput
                        onChange={onFilterSearchBox}
                        className={classes.searchInput}
                        placeholder={t("page.surveys-overview.search-placeholder")}
                        endAdornment={
                            <InputAdornment position="end">
                                <img src={search} alt={t("accessibility.asset.mui-icon.search")} />
                            </InputAdornment>
                        }
                    ></OutlinedInput>
                    <Box className={cx(classes.filterBox)}>
                        <Checkbox onChange={onFilterValidatedSurveyChange} />
                        {t("page.surveys-overview.filter-label")}
                    </Box>
                </Box>

                <Box className={cx(classes.refreshBox, isItMobile ? classes.refreshMobileBox : "")}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={refreshHouseholds}
                        aria-label={"refresh"}
                        startIcon={<img src={refresh} alt={t("accessibility.asset.mui-icon.refresh")} />}
                        disabled={!navigator.onLine}
                    >
                        <Box className={classes.labelButton}>
                            {t("page.surveys-overview.refresh-button")}
                        </Box>
                    </Button>
                </Box>
            </Box>

            <FlexCenter className={classes.searchResultBox}>{renderResults()}</FlexCenter>
        </ReviewerPage>
    ) : (
        <>
            <LoadingFull
                message={t("page.home.loading.message")}
                thanking={t("page.home.loading.thanking")}
            />
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveysOverviewPage } })(theme => ({
    reviewerPage: {
        maxHeight: "100vh",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },
    label: {
        fontSize: "18px",
        fontWeight: "bold",
        marginLeft: "0.5rem",
    },
    title: {
        display: "flex",
        marginBottom: "2rem",
    },
    titleMobile: {
        marginBottom: important("0rem"),
    },
    searchBox: {
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
    },
    innerSearchBox: {
        display: "flex",
        flexWrap: "wrap",
        width: "80%",
        justifyContent: "flex-start",
    },
    innerSearchMobileBox: {
        width: important("100%"),
    },
    filterBox: {
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        borderRadius: "10px",
        paddingRight: "1.5rem",
        marginTop: "1rem",
    },
    searchInput: {
        borderRadius: "50px",
        "& .MuiInputBase-input": {
            paddingTop: ".5rem",
            paddingBottom: ".5rem",
        },
        backgroundColor: theme.variables.white,
        width: "100%",
        marginTop: "1rem",
        maxWidth: "340px",
        marginRight: "1rem",
    },
    searchResultBox: {
        marginTop: "1rem",
        paddingBottom: "6rem",
        height: "100%",
        maxHeight: "100vh",
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start !important",
    },
    buttonBox: {
        borderRadius: "0",
        height: "3.75rem",
    },
    labelButton: {
        fontSize: "18px",
    },
    refreshBox: {
        marginTop: "1rem",
    },
    refreshMobileBox: {
        width: "100%",
    },
}));

export default SurveysOverviewPage;
