import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Checkbox, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { Box } from "@mui/system";
import arrowForwardIosGrey from "assets/illustration/mui-icon/arrow-forward-ios-grey.svg";
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
import { getListSurveysHousehold, initializeSurveysIdsModeReviewer } from "service/survey-service";

const SurveysOverviewPage = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const emptyArray: any[] = [];

    let dataHouseholds = getListSurveysHousehold();

    let [isFilterValidatedSurvey, setIsFilterValidatedSurvey] = React.useState(false);
    let [searchResult, setSearchResult] = React.useState(dataHouseholds);
    let [filterValidatedResult, setFilterValidatedResult] = React.useState(emptyArray);
    let [initialized, setInitialized] = React.useState(false);

    useEffect(() => {
        initializeSurveysIdsModeReviewer().then(() => {
            dataHouseholds = getListSurveysHousehold();
            setSearchResult(dataHouseholds);
            setInitialized(true);
        });
    }, []);

    const navToReviewerHome = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME));
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
                    houseHoldData?.idHousehold?.includes(event.target.value),
            );

            if (isFilterValidatedSurvey) {
                newSearchResult = newSearchResult.filter(houseHoldData => !isToFilter(houseHoldData));
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
            const newSearchResult = searchResult.filter(
                (houseHoldData: any) => !isToFilter(houseHoldData),
            );
            sortSearchResult(newSearchResult);
            setSearchResult(newSearchResult);

            const newFilterValidatedResult = searchResult.filter((houseHoldData: any) =>
                isToFilter(houseHoldData),
            );
            setFilterValidatedResult(newFilterValidatedResult);
        } else {
            const newSearchResult = searchResult.concat(filterValidatedResult);
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

    return initialized ? (
        <ReviewerPage
            className={classes.reviewerPage}
            onClickHome={navToReviewerHome}
            homeIcon={home}
            homeIconAlt={t("accessibility.asset.mui-icon.home")}
        >
            <Box className={classes.title}>
                <img src={stats} alt={t("accessibility.asset.stats-alt")} />
                <Typography className={classes.label}>{t("page.surveys-overview.title")}</Typography>
            </Box>
            <Box className={classes.searchBox}>
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
                <Box className={classes.filterBox}>
                    <Checkbox onChange={onFilterValidatedSurveyChange} />
                    {t("page.surveys-overview.filter-label")}
                </Box>
            </Box>

            <FlexCenter className={classes.searchResultBox}>
                {searchResult.map((dataHousehold: any, index: number) => (
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
                ))}
            </FlexCenter>
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
        marginBottom: "3rem",
    },
    searchBox: {
        display: "flex",
    },
    filterBox: {
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        borderRadius: "10px",
        paddingRight: "1.5rem",
        paddingLeft: ".5rem",
        marginLeft: "1.5rem",
    },
    searchInput: {
        minWidth: "340px",
        borderRadius: "50px",
        "& .MuiInputBase-input": {
            paddingTop: ".5rem",
            paddingBottom: ".5rem",
        },
        backgroundColor: theme.variables.white,
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
}));

export default SurveysOverviewPage;
