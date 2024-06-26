import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import {
    Button,
    Checkbox,
    InputAdornment,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ReactComponent as ArrowForwardIosGreyIcon } from "assets/illustration/mui-icon/arrow-forward-ios-grey.svg";
import { ReactComponent as HomeIcon } from "assets/illustration/mui-icon/home.svg";
import { ReactComponent as PersonIcon } from "assets/illustration/mui-icon/person-white.svg";
import { ReactComponent as RefreshIcon } from "assets/illustration/mui-icon/refresh-white.svg";
import { ReactComponent as SearchIcon } from "assets/illustration/mui-icon/search.svg";
import { ReactComponent as StatsImg } from "assets/illustration/stats.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoadingFull from "components/commons/LoadingFull/LoadingFull";
import ReviewerPage from "components/commons/ReviewerPage/ReviewerPage";
import HouseholdCard from "components/edt/HouseholdCard/HouseholdCard";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { Household } from "interface/entity/Household";
import ErrorPage from "pages/error/Error";
import React, { useCallback, useEffect } from "react";
import { TFunction, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import { isMobile } from "service/responsive";
import {
    getListSurveysHousehold,
    initializeListSurveys,
    initializeSurveysIdsDataModeReviewer,
    refreshSurveyData,
    saveDatas,
} from "service/survey-service";
import { getUniquesValues } from "utils/utils";

const getListCampaigns = (dataHouseholds: Household[], t: TFunction<"translation", undefined>) => {
    const subCampaignIds = getUniquesValues(dataHouseholds.map(household => household.campaingId)).map(
        household => {
            return {
                value: household,
                label: household,
            };
        },
    );
    return [{ value: "all", label: t("page.surveys-overview.all-campaigns") }].concat(subCampaignIds);
};

const isToFilterValidate = (houseHoldData: any): boolean => {
    return (
        houseHoldData.stats?.numHouseholdsInProgress == 0 &&
        houseHoldData.stats?.numHouseholdsClosed == 0 &&
        houseHoldData.stats?.numHouseholdsValidated == houseHoldData.stats?.numHouseholds
    );
};

const isToFilterCampaing = (houseHoldData: any, value: string): boolean => {
    return houseHoldData.campaingId.toLowerCase() == value.toLowerCase();
};

const isToFilterNameOrIdentifiant = (houseHoldData: any, value: string): boolean => {
    return (
        houseHoldData?.userName?.toLowerCase().includes(value.toLowerCase()) ||
        houseHoldData?.idHousehold?.toLowerCase().includes(value.toLowerCase())
    );
};

const isToFilter = (listOfElements: Household[], houseHoldData: Household): boolean => {
    return listOfElements.findIndex(hh => hh.idHousehold == houseHoldData.idHousehold) >= 0;
};

const filterValidate = (listStart: any[], value: boolean): Household[] => {
    if (value) {
        return getUniquesValues(
            listStart?.filter((houseHoldData: any) => isToFilterValidate(houseHoldData)),
        );
    } else return [];
};

const filterCampaign = (listStart: any[], value: string): Household[] => {
    if (value != "all") {
        return listStart?.filter((houseHoldData: any) => !isToFilterCampaing(houseHoldData, value));
    } else return [];
};

const filterNameOrIdentifiant = (listStart: any[], value: string): Household[] => {
    if (value != "") {
        return listStart?.filter(
            (houseHoldData: any) => !isToFilterNameOrIdentifiant(houseHoldData, value),
        );
    } else return [];
};

const SurveysOverviewPage = () => {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const emptyArray: any[] = [];
    const isItMobile = isMobile();

    let dataHouseholds = getListSurveysHousehold();
    let campaingsList = getListCampaigns(dataHouseholds, t);
    let [isFilterValidatedSurvey, setIsFilterValidatedSurvey] = React.useState(false);
    let [campaingFilter, setCampaingFilter] = React.useState<string>("all");
    let [nameOrIdentiantFilter, setNameOrIdentiantFilter] = React.useState<string>("");

    let [searchResult, setSearchResult] = React.useState<Household[] | undefined>(undefined);
    let [filterValidatedResult, setFilterValidatedResult] = React.useState<Household[]>(emptyArray);
    let [filterCampaingResult, setFilterCampaingResult] = React.useState<Household[]>(emptyArray);
    let [filterNameOrIdentiantResult, setFilterNameOrIdentiantResult] =
        React.useState<Household[]>(emptyArray);

    let [initialized, setInitialized] = React.useState(false);
    let [refreshing, setRefreshing] = React.useState(false);
    const [error, setError] = React.useState<ErrorCodeEnum | undefined>(undefined);

    const initHouseholds = () => {
        dataHouseholds = getListSurveysHousehold();
        if (searchResult == null || searchResult.length == 0) {
            setSearchResult(dataHouseholds);
        }
        campaingsList = getListCampaigns(dataHouseholds, t);
    };

    const refreshHouseholds = useCallback(() => {
        setRefreshing(true);
        return refreshSurveyData(setError).then(() => {
            return initializeListSurveys(setError).then(() => {
                setRefreshing(true);
                initHouseholds();
                setSearchResult(dataHouseholds);
                setRefreshing(false);
            });
        });
    }, [searchResult]);

    const saveAllAndUpdate = useCallback(() => {
        setRefreshing(true);
        saveDatas().then(() => {
            return initializeListSurveys(setError).then(() => {
                return refreshSurveyData(setError).then(() => {
                    initHouseholds();
                    setSearchResult(dataHouseholds);
                    setRefreshing(false);
                });
            });
        });
    }, [searchResult]);

    useEffect(() => {
        initializeSurveysIdsDataModeReviewer(setError)
            .then(() => {
                dataHouseholds = getListSurveysHousehold();
                if (dataHouseholds.length == 0) {
                    setInitialized(false);
                    setRefreshing(true);
                    refreshHouseholds().then(() => {
                        initHouseholds();
                    });
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                initHouseholds();
                setInitialized(true);
            });
    });

    const navToReviewerHome = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_HOME));
    }, []);

    useEffect(() => {
        const allFiltres = filterNameOrIdentiantResult
            .concat(filterValidatedResult)
            .concat(filterCampaingResult);
        const arrayUniqueByKey = [
            ...new Map(allFiltres.map(item => [item["idHousehold"], item])).values(),
        ];
        let newFilterCampaingResult =
            dataHouseholds?.filter(houseHoldData => !isToFilter(arrayUniqueByKey, houseHoldData)) ??
            dataHouseholds;

        setSearchResult(newFilterCampaingResult);
        sortSearchResult(newFilterCampaingResult);
    }, [filterNameOrIdentiantResult, filterValidatedResult, filterCampaingResult]);

    const onFilter = useCallback(
        (type: string) => (event: any) => {
            if (type == "nameOrIdentifiant") {
                const nameOrIdentifiant = event.target.value.toLowerCase();
                setNameOrIdentiantFilter(nameOrIdentiantFilter);
                const filter = filterNameOrIdentifiant(dataHouseholds, nameOrIdentifiant);
                setFilterNameOrIdentiantResult(filter);
            }

            if (type == "validate") {
                setIsFilterValidatedSurvey(!isFilterValidatedSurvey);
                const filter = filterValidate(dataHouseholds, !isFilterValidatedSurvey);
                setFilterValidatedResult(filter);
            }

            if (type == "campaign") {
                const campaign = event.target.value.toLowerCase();
                setCampaingFilter(campaign);
                const filter = filterCampaign(dataHouseholds, campaign);
                setFilterCampaingResult(filter);
            }
        },
        [campaingFilter, isFilterValidatedSurvey, nameOrIdentiantFilter],
    );

    const sortSearchResult = useCallback(
        (houseHoldData: any) => {
            const newSearchResult = houseHoldData.sort((houseHoldData1: any, houseHoldData2: any) =>
                houseHoldData1.idHousehold.localeCompare(houseHoldData2.idHousehold),
            );
            setSearchResult(newSearchResult);
        },
        [searchResult],
    );

    const renderHouseHold = useCallback(
        (dataHousehold: any, index: number) => {
            return (
                <HouseholdCard
                    key={"household-card-" + index}
                    idHousehold={dataHousehold?.idHousehold}
                    householdStaticLabel={t("page.surveys-overview.household-static-label")}
                    iconPerson={<PersonIcon aria-label={t("accessibility.asset.mui-icon.person")} />}
                    iconArrow={
                        <ArrowForwardIosGreyIcon
                            aria-label={t("accessibility.asset.mui-icon.arrow-forward-ios")}
                        />
                    }
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
                    tabIndex={index}
                />
            );
        },
        [searchResult],
    );

    const renderResults = useCallback(() => {
        return (
            searchResult?.map((dataHousehold: any, index: number) =>
                renderHouseHold(dataHousehold, index),
            ) ?? renderHouseHold(null, 0)
        );
    }, [searchResult]);

    const renderPageOrLoadingOrError = (page: any) => {
        if (initialized && !refreshing && searchResult != null) {
            return page;
        } else {
            return !error ? (
                <LoadingFull
                    message={t("page.home.loading.message")}
                    thanking={t("page.home.loading.thanking")}
                />
            ) : (
                <ErrorPage errorCode={error} atInit={true} />
            );
        }
    };

    return renderPageOrLoadingOrError(
        <ReviewerPage
            className={classes.reviewerPage}
            onClickHome={navToReviewerHome}
            icon={<HomeIcon aria-label={t("accessibility.asset.mui-icon.home")} />}
        >
            <Box className={cx(classes.title, isItMobile ? classes.titleMobile : "")}>
                <StatsImg aria-label={t("accessibility.asset.stats-alt")} />
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
                        onChange={onFilter("nameOrIdentifiant")}
                        className={classes.searchInput}
                        placeholder={t("page.surveys-overview.search-placeholder")}
                        endAdornment={
                            <InputAdornment position="end">
                                <SearchIcon aria-label={t("accessibility.asset.mui-icon.search")} />
                            </InputAdornment>
                        }
                        inputProps={{
                            "aria-label": t("accessibility.component.surveys-overviewer.search"),
                        }}
                    ></OutlinedInput>
                    <Box className={cx(classes.filterBox)}>
                        <Checkbox
                            onChange={onFilter("validate")}
                            inputProps={{
                                "aria-label": t("accessibility.component.surveys-overviewer.filter"),
                            }}
                        />
                        {t("page.surveys-overview.filter-label")}
                    </Box>
                    <Box className={classes.filterCampaingBox}>
                        <InputLabel id="filter-campaing-select" className={classes.emptyLabel}>
                            Vague
                        </InputLabel>
                        <Select
                            id="filter-campaing-select"
                            value={
                                campaingsList.filter(option => {
                                    return option?.value.toUpperCase() == campaingFilter.toUpperCase();
                                })[0].value
                            }
                            onChange={onFilter("campaign")}
                            style={{ backgroundColor: "white" }}
                            MenuProps={{
                                classes: {
                                    paper: classes.paperClass,
                                },
                                "aria-label": t("accessibility.component.surveys-overviewer.filter"),
                            }}
                            inputProps={{
                                "aria-label": t("accessibility.component.surveys-overviewer.filter"),
                            }}
                        >
                            {campaingsList.map(campaing => (
                                <MenuItem
                                    key={campaing.value}
                                    value={campaing.value}
                                    style={{ backgroundColor: "white" }}
                                >
                                    {campaing.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>

                <Box className={cx(classes.refreshBox, isItMobile ? classes.refreshMobileBox : "")}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={saveAllAndUpdate}
                        aria-label={"refresh"}
                        startIcon={
                            <RefreshIcon aria-label={t("accessibility.asset.mui-icon.refresh")} />
                        }
                        disabled={!navigator.onLine}
                    >
                        <Box className={classes.labelButton}>
                            {t("page.surveys-overview.refresh-button")}
                        </Box>
                    </Button>
                </Box>
            </Box>

            <FlexCenter className={classes.searchResultBox}>{renderResults()}</FlexCenter>
        </ReviewerPage>,
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
    filterCampaingBox: {
        padding: "1rem 0rem 0rem 1rem",
    },
    paperClass: {
        backgroundColor: "white",
    },
    emptyLabel: {
        display: important("none"),
    },
}));

export default SurveysOverviewPage;
