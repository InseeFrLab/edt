import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Checkbox, InputAdornment, OutlinedInput, Typography } from "@mui/material";
import { Box } from "@mui/system";
import arrowForwardIosGrey from "assets/illustration/mui-icon/arrow-forward-ios-grey.svg";
import home from "assets/illustration/mui-icon/home.svg";
import person from "assets/illustration/mui-icon/person-white.svg";
import search from "assets/illustration/mui-icon/search.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import ReviewerPage from "components/commons/ReviewerPage/ReviewerPage";
import HouseholdCard from "components/edt/HouseholdCard/HouseholdCard";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import React from "react";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchReviewerSurveysAssignments } from "service/api-service";
import { getNavigatePath } from "service/navigation-service";

const SurveysOverviewPage = () => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const dataHouseholds = [
        {
            idMenage: "11000550",
            userName: "Leblois-Gardet",
            surveys: { startedSurveysAmount: 1, closedSurveysAmount: 0, validatedSurveysAmount: 0 },
            surveyDate: "07/03/23",
        },
        {
            idMenage: "11000552",
            userName: "Pignon",
            surveys: { startedSurveysAmount: 0, closedSurveysAmount: 0, validatedSurveysAmount: 3 },
            surveyDate: "08/05/23",
        },
        {
            idMenage: "11000573",
            userName: "Mallimard",
            surveys: { startedSurveysAmount: 2, closedSurveysAmount: 0, validatedSurveysAmount: 0 },
            surveyDate: "11/05/23",
        },
        {
            idMenage: "11000553",
            userName: "Gallimard",
            surveys: { startedSurveysAmount: 2, closedSurveysAmount: 1, validatedSurveysAmount: 1 },
            surveyDate: "01/05/23",
        },
        {
            idMenage: "11000554",
            userName: "Leblois-Gardon",
            surveys: { startedSurveysAmount: 4, closedSurveysAmount: 1, validatedSurveysAmount: 0 },
            surveyDate: "07/03/23",
        },
        {
            idMenage: "11000557",
            userName: "Pigbeef",
            surveys: { startedSurveysAmount: 1, closedSurveysAmount: 1, validatedSurveysAmount: 1 },
            surveyDate: "09/05/23",
        },
        {
            idMenage: "11000551",
            userName: "Blanchard",
            surveys: { startedSurveysAmount: 1, closedSurveysAmount: 2, validatedSurveysAmount: 0 },
            surveyDate: "04/04/23",
        },
        {
            idMenage: "11000560",
            userName: "Pinocchio",
            surveys: { startedSurveysAmount: 0, closedSurveysAmount: 0, validatedSurveysAmount: 0 },
            surveyDate: "19/06/23",
        },

        {
            idMenage: "11000586",
            userName: "Zarella",
            surveys: { startedSurveysAmount: 0, closedSurveysAmount: 0, validatedSurveysAmount: 1 },
            surveyDate: "07/11/23",
        },
        {
            idMenage: "11000555",
            userName: "Leblois-Garcon",
            surveys: { startedSurveysAmount: 0, closedSurveysAmount: 0, validatedSurveysAmount: 5 },
            surveyDate: "07/03/23",
        },
        {
            idMenage: "11000556",
            userName: "Pignaco",
            surveys: { startedSurveysAmount: 1, closedSurveysAmount: 0, validatedSurveysAmount: 1 },
            surveyDate: "08/05/23",
        },
    ].sort(
        (houseHoldData1: any, houseHoldData2: any) =>
            Number(houseHoldData1.idMenage) - Number(houseHoldData2.idMenage),
    );
    const emptyArray: any[] = [];

    let [isFilterValidatedSurvey, setIsFilterValidatedSurvey] = React.useState(false);
    let [searchResult, setSearchResult] = React.useState(dataHouseholds);
    let [filterValidatedResult, setFilterValidatedResult] = React.useState(emptyArray);

    useEffect(() => {
        fetchReviewerSurveysAssignments();
    }, []);

    const navToReviewerHome = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME));
    }, []);

    const onClickHouseholdCard = useCallback(() => {
        console.log("Quand tu me cliques dessus, ça chatouille.");
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
                    houseHoldData.userName.toLowerCase().includes(event.target.value.toLowerCase()) ||
                    houseHoldData.idMenage.includes(event.target.value),
            );
            // console.log("avant filtre")
            // console.log(newSearchResult);

            if (isFilterValidatedSurvey) {
                newSearchResult = newSearchResult.filter(houseHoldData => !isToFilter(houseHoldData));
                // console.log("après filtre")
                // console.log(searchResult);
            }
            sortSearchResult(newSearchResult);
            setSearchResult(newSearchResult);

            let newFilterValidatedResult = dataHouseholds.filter(
                houseHoldData =>
                    (houseHoldData.userName.toLowerCase().includes(event.target.value.toLowerCase()) ||
                        houseHoldData.idMenage.includes(event.target.value)) &&
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
                    Number(houseHoldData1.idMenage) - Number(houseHoldData2.idMenage),
            );
            setSearchResult(newSearchResult);
        },
        [searchResult],
    );

    return (
        <ReviewerPage
            className={classes.reviewerPage}
            onClickHome={navToReviewerHome}
            homeIcon={home}
            homeIconAlt={t("accessibility.asset.mui-icon.home")}
        >
            <Typography className={classes.label}>{t("page.surveys-overview.title")}</Typography>
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
                        householdStaticLabel={t("page.surveys-overview.household-static-label")}
                        iconPerson={person}
                        iconPersonAlt={t("accessibility.asset.mui-icon.person")}
                        iconArrow={arrowForwardIosGrey}
                        iconArrowAlt={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                        startedSurveyLabel={t("page.surveys-overview.started-survey-label")}
                        closedSurveyLabel={t("page.surveys-overview.closed-survey-label")}
                        validatedSurveyLabel={t("page.surveys-overview.validated-survey-label")}
                        onClick={onClickHouseholdCard}
                        dataHousehold={dataHousehold}
                    />
                ))}
            </FlexCenter>
        </ReviewerPage>
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
        fontSize: "14px",
        marginBottom: "2rem",
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
    },
    searchResultBox: {
        // marginTop: "1rem",
        // overflow: "hidden auto",
        // height: "100%",
        // display: "flex",
        // flexDirection: "column",

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
